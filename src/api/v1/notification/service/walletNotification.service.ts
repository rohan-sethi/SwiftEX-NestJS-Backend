import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WalletNotificationService {
    private readonly logger = new Logger(WalletNotificationService.name);

    constructor() { }

    async addWalletWatcher(apiInfo: any, stellarWalletAddress: string,walletAddress:string,userFCM:string): Promise<any> {
        try {
            const encrypted =await this.encryptMessageToString(userFCM);
            let data = JSON.stringify({
                "webhook_url": process.env.NOTIFICATION_WEBHOOK,
                "chainType": process.env.SOROBANHOOKS_API_TYPE,
                "walletAddress": stellarWalletAddress,
                "additionalData":encrypted
            });

            let config = {
                method: apiInfo?.METHODTYPE,
                maxBodyLength: Infinity,
                url: apiInfo?.REQUESTURL,
                headers: {
                    'x-api-key': process.env.SOROBANHOOKS_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response = await axios.request(config)
            if (response.status === 200) {
                return {
                    status: true,
                    res: response?.data?.result
                }
            } else {
                this.logger.log('SorobanHooks Error API : ',{
                    status: false,
                    res: response?.data
                });
                return {
                    status: false,
                    res: response?.data?.message || false
                }
            }
        } catch (error) {
            this.logger.log('SorobanHooks Error: ',{
                status: false,
                res: error
            });
            return {
                status: false,
                res: error?.response?.data?.message || false
            }
        }
    }


    async getSecretKey() {
        const base64Key = process.env.NOTIFICATION_ENCRYPT_KEY;
        if (!base64Key) throw new Error("key not found");
        const keyBuffer = Buffer.from(base64Key, 'base64');
        if (keyBuffer.length !== 32) throw new Error("invalid key must be 32 bytes");
        return keyBuffer;
    }


    async encryptMessageToString(payload) {
        const secretKey = await this.getSecretKey();
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();

        const packed = [
            encrypted.toString('base64'),
            iv.toString('base64'),
            authTag.toString('base64')
        ].join('.');

        return Buffer.from(packed).toString('base64');
    }

}
