import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import Moralis from 'moralis';
import { User } from '../../user/schema/user.schema';

@Injectable()
export class WalletNotificationService implements OnModuleInit {
    private readonly logger = new Logger(WalletNotificationService.name);

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async onModuleInit() {
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        });
    }

    async addWalletWatcher(apiInfo: any, stellarWalletAddress: string,userData:any): Promise<any> {
        try {
            const encrypted =await this.encryptMessageToString(userData.fcmRegTokens[0]);
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
                return {
                    status: false,
                    res: response?.data?.message || false
                }
            }
        } catch (error) {
            return {
                status: false,
                res: error?.response?.data?.message || false
            }
        }
    }

    async addWalletToMoralis(walletAddress: string, userDetils: any): Promise<any> {
        try {
            if (userDetils.streamId===null) {
                console.log("called when streamId not avilable");
                // creating new stream
                const encrypted = await this.encryptMessageToString(userDetils.fcmRegTokens[0]);
                const creatStreams = await Moralis.Streams.add({
                    webhookUrl: process.env.NOTIFICATION_WEBHOOK,
                    description: "user wallet",
                    tag: encrypted,
                    chains: ["0xaa36a7", "0x61"],
                    includeNativeTxs: true,
                });

                const addressAddestoStream = await Moralis.Streams.addAddress({
                    id: creatStreams.toJSON().id,
                    address: [walletAddress],
                });
                const updateUserDB = await this.userModel.findOneAndUpdate({ _id: userDetils._id }, { $set: { streamId: creatStreams.toJSON().id } }, { new: true });
                return {
                    status: true,
                    Stream_ID: creatStreams.toJSON().id,
                    respo: addressAddestoStream,
                    updateUserDB: updateUserDB
                }
            } else {
                console.log("called when streamId avilable ---0");
                const stream = await Moralis.Streams.getAddresses({ limit: 10, id: userDetils.streamId });
                if (!stream || !stream.raw || stream.raw.total === 0) {
                    return {
                        status: false,
                        respo: 'No addresses found in this stream.',
                    }
                }
                const deleResponse = await Moralis.Streams.deleteAddress({
                    id: userDetils.streamId,
                    address: stream.raw.result[0].address,
                });
                const addingNewAddress = await Moralis.Streams.addAddress({
                    id: userDetils.streamId,
                    address: [walletAddress],
                });
                return {
                    status: true,
                    respo: addingNewAddress || "null",
                    Stream_ID: userDetils.streamId,
                    deleResponse: deleResponse,
                    addingNewAddress: addingNewAddress
                }
            } 
        } catch (error) {
            return {
                status: false,
                respo: error || false
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

        // const packed = [
        //     encrypted.toString('base64'),
        //     iv.toString('base64'),
        //     authTag.toString('base64')
        // ].join('.');

        // return Buffer.from(packed).toString('base64');

        // new short method
        const packed = Buffer.concat([iv,encrypted, authTag]);
        return Buffer.from(packed).toString('base64');
    }

}
