import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SorobanHooksService {
    private readonly logger = new Logger(SorobanHooksService.name);

    constructor() { }

    async addWalletWatcher(apiInfo: any, walletAddress: string): Promise<any> {
        try {
            let data = JSON.stringify({
                "webhook_url": process.env.NOTIFICATION_WEBHOOK,
                "chainType": process.env.SOROBANHOOKS_API_TYPE,
                "walletAddress": walletAddress
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

}
