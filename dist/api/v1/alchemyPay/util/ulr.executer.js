"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UrlExecuter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlExecuter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const url_signer_1 = require("./url.signer");
const urls_1 = require("./urls");
let UrlExecuter = UrlExecuter_1 = class UrlExecuter {
    constructor(urlSigner) {
        this.urlSigner = urlSigner;
        this.logger = new common_1.Logger(UrlExecuter_1.name);
        this.appId = process.env.ALCHEMY_PAY_APPID;
    }
    async getAlchemyQuotes(timestamp, body, signKey, method, url) {
        var _a;
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
            const response = await axios_1.default.request(config);
            return {
                "status": (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.success,
                "res": JSON.stringify(response.data)
            };
        }
        catch (error) {
            this.logger.error("api error", error);
            return {
                "status": false,
                "res": "null"
            };
        }
    }
    async alchemyUserRegister(timestamp, body, signKey, method, url) {
        var _a;
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
            const response = await axios_1.default.request(config);
            return {
                "status": (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.success,
                "res": JSON.stringify(response.data)
            };
        }
        catch (error) {
            this.logger.error("api error", error);
            return {
                "status": false,
                "res": "null"
            };
        }
    }
    async authRequest(timestamp, body, signKey, method, url, userEmail) {
        var _a;
        try {
            const resAuthPayload = await this.urlSigner.payloadGenrator({ "email": userEmail }, urls_1.USERAUTHTOKEN.METHODTYPE, urls_1.USERAUTHTOKEN.REQUESTURL);
            if (!resAuthPayload.status) {
                return {
                    "status": false,
                    "res": "null"
                };
            }
            const authToken = await this.getAlchemyQuotes(resAuthPayload.timestamp, { "email": userEmail }, resAuthPayload.sign, urls_1.USERAUTHTOKEN.METHODTYPE, urls_1.USERAUTHTOKEN.REQUESTURL);
            if (!authToken.status) {
                return {
                    "status": false,
                    "res": "null"
                };
            }
            const authFinder = JSON.parse(authToken.res);
            let data = JSON.stringify(body);
            let config = {
                method: method,
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'access-token': authFinder.data.accessToken,
                    'appid': this.appId,
                    'timestamp': timestamp,
                    'sign': signKey,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios_1.default.request(config);
            return {
                "status": (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.success,
                "res": JSON.stringify(response.data)
            };
        }
        catch (error) {
            this.logger.error("api error", error);
            return {
                "status": false,
                "res": "null"
            };
        }
    }
};
UrlExecuter = UrlExecuter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [url_signer_1.UrlSigner])
], UrlExecuter);
exports.UrlExecuter = UrlExecuter;
//# sourceMappingURL=ulr.executer.js.map