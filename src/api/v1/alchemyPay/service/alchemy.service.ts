import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UrlSigner } from "../util/url.signer";
import { UrlExecuter } from "../util/ulr.executer";
import { ORDERCREATION, QUOTES, USERKYCSTATUS, USERREGISTER, USERSELLORDER } from "../util/urls";
import * as crypto from 'crypto';


@Injectable()
export class AlchemyService {
    private readonly logger = new Logger(AlchemyService.name);
    private readonly appId = process.env.ALCHEMY_PAY_APPID;
    private readonly appSecret = process.env.ALCHEMY_PAY_SECRET;
    constructor(
        private readonly urlSigner: UrlSigner,
        private readonly urlExecuter: UrlExecuter,
    ) { }

    async fetchQuotes(payload:JSON){
        try {
            const resPayloadGen=await this.urlSigner.payloadGenrator(payload,QUOTES.METHODTYPE,QUOTES.REQUESTURL)
             if(!resPayloadGen.status)
             {
                throw new HttpException('fetching Quotes faild', HttpStatus.BAD_REQUEST);
             }
            const resUrlExe=await this.urlExecuter.getAlchemyQuotes(resPayloadGen.timestamp,payload,resPayloadGen.sign,QUOTES.METHODTYPE,QUOTES.REQUESTURL)
            if(!resUrlExe.status)
            {
                return {
                    "status":false,
                    "res":resUrlExe.res
                }
            }
            return {
                "status":true,
                "res":resUrlExe.res
            }

        } catch (error) {
            this.logger.error("fetchQuotes Error",error)
            throw new HttpException('fetching Quotes faild', HttpStatus.BAD_REQUEST);
        }
    }

    async userRegister(payload){
        try {
            const resPayloadGen=await this.urlSigner.payloadGenrator(payload,USERREGISTER.METHODTYPE,USERREGISTER.REQUESTURL)
            if(!resPayloadGen.status)
                {
                   throw new HttpException('alchemyUserRegister faild', HttpStatus.BAD_REQUEST);
                }
               const resUrlExe=await this.urlExecuter.alchemyUserRegister(resPayloadGen.timestamp,payload,resPayloadGen.sign,USERREGISTER.METHODTYPE,USERREGISTER.REQUESTURL)
               if(!resUrlExe.status)
               {
                   return {
                       "status":false,
                       "res":resUrlExe.res
                   }
               }
               return {
                   "status":true,
                   "res":resUrlExe.res
               }
        } catch (error) {
            this.logger.error("alchemyUserRegister Error",error)
            throw new HttpException('alchemyUserRegister faild', HttpStatus.BAD_REQUEST);
        }
    }

    async userStatus(payload){
        try {
            const resPayloadGen=await this.urlSigner.payloadGenrator(payload,USERKYCSTATUS.METHODTYPE,USERKYCSTATUS.REQUESTURL)
            if(!resPayloadGen.status)
                {
                   throw new HttpException('alchemyUserStatus faild', HttpStatus.BAD_REQUEST);
                }
               const resUrlExe=await this.urlExecuter.alchemyUserRegister(resPayloadGen.timestamp,payload,resPayloadGen.sign,USERKYCSTATUS.METHODTYPE,USERKYCSTATUS.REQUESTURL)
               if(!resUrlExe.status)
               {
                   return {
                       "status":false,
                       "res":resUrlExe.res
                   }
               }
               return {
                   "status":true,
                   "res":resUrlExe.res
               }
        } catch (error) {
            this.logger.error("alchemyUserStatus Error",error)
            throw new HttpException('alchemyUserStatus faild', HttpStatus.BAD_REQUEST);
        }
    }

    async orderCreate(payload: any, userEmail: string) {
        const resPayloadGen = await this.urlSigner.payloadGenrator(payload, ORDERCREATION.METHODTYPE, ORDERCREATION.REQUESTURL)
        if (!resPayloadGen.status) {
            throw new HttpException('alchemyOrderCreate faild', HttpStatus.BAD_REQUEST);
        }
        const resUrlExe = await this.urlExecuter.authRequest(resPayloadGen.timestamp, payload, resPayloadGen.sign, ORDERCREATION.METHODTYPE, ORDERCREATION.REQUESTURL, userEmail)
        if (!resUrlExe.status) {
            throw new HttpException({ "status": false, "res": resUrlExe.res}, HttpStatus.BAD_REQUEST);
        }
        return {
            "status": true,
            "res": resUrlExe.res
        }
    }

    async sellOrderCreate(payload: any, userEmail: string) {
       try {
         // Function to generate HMAC SHA256 signature
         function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
            // Concatenate parameters for signature string
            const signatureString = timestamp + httpMethod + requestPath;

            // Generate HMAC SHA256 signature using the secret key
            const hmac = crypto.createHmac('sha256', secretKey);
            hmac.update(signatureString);
            const signature = hmac.digest('base64');

            return encodeURIComponent(signature);
        }

        // Function to sort parameters and return a string to sign
        function getStringToSign(params) {
            const sortedKeys = Object.keys(params).sort();
            const s2s = sortedKeys
                .map(key => {
                    const value = params[key];
                    if (Array.isArray(value) || value === '') {
                        return null;
                    }
                    return `${key}=${value}`;
                })
                .filter(Boolean)
                .join('&');

            return s2s;
        }

        const timestamp = String(Date.now());
        
        // Request parameters
        const paramsToSign = {
            appId: this.appId,
            timestamp: timestamp,
            type:"sell",
            merchantOrderNo: Date.now(),
            crypto: payload?.crypto,
            network: payload?.network,
            cryptoAmount: payload?.amount,
            fiat: payload?.fiat,
            country:"US",
            email:userEmail,
            redirectUrl:process.env.ALCHEMYPAY_SELL_REDIRECT,
            callbackUrl:process.env.ALCHEMYPAY_SELL_WEBHOOK,
            language:"en-US",
            showTable:"sell"
        };
        
        const rawDataToSign = getStringToSign(paramsToSign);
        const requestPathWithParams = USERSELLORDER.REQUESTURL + '?' + rawDataToSign;
        const onRampSignature = generateSignature(timestamp, USERSELLORDER.METHODTYPE, requestPathWithParams, this.appSecret);
        const finalUrl=USERSELLORDER.SELLORDER + rawDataToSign + "&sign=" + onRampSignature;
        return {
            "status": true,
            "res": finalUrl,
            "servicePayload":paramsToSign
        }
       } catch (error) {
        return {
            "status": false,
            "res": error
        }
       }
    }
}