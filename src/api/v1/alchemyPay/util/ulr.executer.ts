import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { UrlSigner } from './url.signer';
import { USERAUTHTOKEN } from './urls';

@Injectable()
export class UrlExecuter {
    private readonly logger = new Logger(UrlExecuter.name);
    private readonly appId = process.env.ALCHEMY_PAY_APPID;
    constructor(
        private readonly urlSigner: UrlSigner, 
    ) { }

    async getAlchemyQuotes(timestamp, body, signKey,method,url): Promise<any> {
        try {
            let data = JSON.stringify(body);

            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'appid': this.appId,
                    'timestamp': timestamp,
                    'sign': signKey,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response=await axios.request(config)
            return {
                "status":response?.data?.success,
                "res":JSON.stringify(response.data)
            }
        } catch (error) {
            this.logger.error("api error", error)
            return {
                "status":false,
                "res":"null"
            }
        }
    }

    async alchemyUserRegister(timestamp, body, signKey,method,url): Promise<any> {
        try {
            let data = JSON.stringify(body);

            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'ach-access-key': this.appId,
                    'ach-access-timestamp': timestamp,
                    'ach-access-sign': signKey,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response=await axios.request(config)
            return {
                "status":response?.data?.success,
                "res":JSON.stringify(response.data)
            }
        } catch (error) {
            this.logger.error("api error", error)
            return {
                "status":false,
                "res":"null"
            }
        }
    }

    async authRequest(timestamp, body, signKey,method,url,userEmail): Promise<any> {
        try {
            const resAuthPayload = await this.urlSigner.payloadGenrator({ "email": userEmail }, USERAUTHTOKEN.METHODTYPE, USERAUTHTOKEN.REQUESTURL)
            if (!resAuthPayload.status) {
                return {
                    "status":false,
                    "res":"null"
                }
            }
            const authToken=await this.getAlchemyQuotes(resAuthPayload.timestamp,{ "email": userEmail },resAuthPayload.sign,USERAUTHTOKEN.METHODTYPE,USERAUTHTOKEN.REQUESTURL)
            if (!authToken.status) {
                return {
                    "status":false,
                    "res":"null"
                }
            }
            const authFinder=JSON.parse(authToken.res);
            let data = JSON.stringify(body);

            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'access-token':authFinder.data.accessToken,
                    'appid': this.appId,
                    'timestamp': timestamp,
                    'sign': signKey,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response=await axios.request(config)
            return {
                "status":response?.data?.success,
                "res":JSON.stringify(response.data)
            }
        } catch (error) {
            this.logger.error("api error", error)
            return {
                "status":false,
                "res":"null"
            }
        }
    }
}