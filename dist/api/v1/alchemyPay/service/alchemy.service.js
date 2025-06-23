"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AlchemyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemyService = void 0;
const common_1 = require("@nestjs/common");
const url_signer_1 = require("../util/url.signer");
const ulr_executer_1 = require("../util/ulr.executer");
const urls_1 = require("../util/urls");
const crypto = __importStar(require("crypto"));
let AlchemyService = AlchemyService_1 = class AlchemyService {
    constructor(urlSigner, urlExecuter) {
        this.urlSigner = urlSigner;
        this.urlExecuter = urlExecuter;
        this.logger = new common_1.Logger(AlchemyService_1.name);
        this.appId = process.env.ALCHEMY_PAY_APPID;
        this.appSecret = process.env.ALCHEMY_PAY_SECRET;
    }
    async fetchQuotes(payload) {
        try {
            const resPayloadGen = await this.urlSigner.payloadGenrator(payload, urls_1.QUOTES.METHODTYPE, urls_1.QUOTES.REQUESTURL);
            if (!resPayloadGen.status) {
                throw new common_1.HttpException('fetching Quotes faild', common_1.HttpStatus.BAD_REQUEST);
            }
            const resUrlExe = await this.urlExecuter.getAlchemyQuotes(resPayloadGen.timestamp, payload, resPayloadGen.sign, urls_1.QUOTES.METHODTYPE, urls_1.QUOTES.REQUESTURL);
            if (!resUrlExe.status) {
                return {
                    "status": false,
                    "res": resUrlExe.res
                };
            }
            return {
                "status": true,
                "res": resUrlExe.res
            };
        }
        catch (error) {
            this.logger.error("fetchQuotes Error", error);
            throw new common_1.HttpException('fetching Quotes faild', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async userRegister(payload) {
        try {
            const resPayloadGen = await this.urlSigner.payloadGenrator(payload, urls_1.USERREGISTER.METHODTYPE, urls_1.USERREGISTER.REQUESTURL);
            if (!resPayloadGen.status) {
                throw new common_1.HttpException('alchemyUserRegister faild', common_1.HttpStatus.BAD_REQUEST);
            }
            const resUrlExe = await this.urlExecuter.alchemyUserRegister(resPayloadGen.timestamp, payload, resPayloadGen.sign, urls_1.USERREGISTER.METHODTYPE, urls_1.USERREGISTER.REQUESTURL);
            if (!resUrlExe.status) {
                return {
                    "status": false,
                    "res": resUrlExe.res
                };
            }
            return {
                "status": true,
                "res": resUrlExe.res
            };
        }
        catch (error) {
            this.logger.error("alchemyUserRegister Error", error);
            throw new common_1.HttpException('alchemyUserRegister faild', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async userStatus(payload) {
        try {
            const resPayloadGen = await this.urlSigner.payloadGenrator(payload, urls_1.USERKYCSTATUS.METHODTYPE, urls_1.USERKYCSTATUS.REQUESTURL);
            if (!resPayloadGen.status) {
                throw new common_1.HttpException('alchemyUserStatus faild', common_1.HttpStatus.BAD_REQUEST);
            }
            const resUrlExe = await this.urlExecuter.alchemyUserRegister(resPayloadGen.timestamp, payload, resPayloadGen.sign, urls_1.USERKYCSTATUS.METHODTYPE, urls_1.USERKYCSTATUS.REQUESTURL);
            if (!resUrlExe.status) {
                return {
                    "status": false,
                    "res": resUrlExe.res
                };
            }
            return {
                "status": true,
                "res": resUrlExe.res
            };
        }
        catch (error) {
            this.logger.error("alchemyUserStatus Error", error);
            throw new common_1.HttpException('alchemyUserStatus faild', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async orderCreate(payload, userEmail) {
        const resPayloadGen = await this.urlSigner.payloadGenrator(payload, urls_1.ORDERCREATION.METHODTYPE, urls_1.ORDERCREATION.REQUESTURL);
        if (!resPayloadGen.status) {
            throw new common_1.HttpException('alchemyOrderCreate faild', common_1.HttpStatus.BAD_REQUEST);
        }
        const resUrlExe = await this.urlExecuter.authRequest(resPayloadGen.timestamp, payload, resPayloadGen.sign, urls_1.ORDERCREATION.METHODTYPE, urls_1.ORDERCREATION.REQUESTURL, userEmail);
        if (!resUrlExe.status) {
            throw new common_1.HttpException({ "status": false, "res": resUrlExe.res }, common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            "status": true,
            "res": resUrlExe.res
        };
    }
    async sellOrderCreate(payload, userEmail) {
        try {
            function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
                const signatureString = timestamp + httpMethod + requestPath;
                const hmac = crypto.createHmac('sha256', secretKey);
                hmac.update(signatureString);
                const signature = hmac.digest('base64');
                return encodeURIComponent(signature);
            }
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
            const paramsToSign = {
                appId: this.appId,
                timestamp: timestamp,
                type: "sell",
                merchantOrderNo: Date.now(),
                crypto: payload === null || payload === void 0 ? void 0 : payload.crypto,
                network: payload === null || payload === void 0 ? void 0 : payload.network,
                cryptoAmount: payload === null || payload === void 0 ? void 0 : payload.amount,
                fiat: payload === null || payload === void 0 ? void 0 : payload.fiat,
                country: "US",
                email: userEmail,
                redirectUrl: process.env.ALCHEMYPAY_SELL_REDIRECT,
                callbackUrl: process.env.ALCHEMYPAY_SELL_WEBHOOK,
                language: "en-US",
                showTable: "sell"
            };
            const rawDataToSign = getStringToSign(paramsToSign);
            const requestPathWithParams = urls_1.USERSELLORDER.REQUESTURL + '?' + rawDataToSign;
            const onRampSignature = generateSignature(timestamp, urls_1.USERSELLORDER.METHODTYPE, requestPathWithParams, this.appSecret);
            const finalUrl = urls_1.USERSELLORDER.SELLORDER + rawDataToSign + "&sign=" + onRampSignature;
            return {
                "status": true,
                "res": finalUrl
            };
        }
        catch (error) {
            return {
                "status": false,
                "res": error
            };
        }
    }
};
AlchemyService = AlchemyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [url_signer_1.UrlSigner,
        ulr_executer_1.UrlExecuter])
], AlchemyService);
exports.AlchemyService = AlchemyService;
//# sourceMappingURL=alchemy.service.js.map