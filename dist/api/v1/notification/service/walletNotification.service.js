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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WalletNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletNotificationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
let WalletNotificationService = WalletNotificationService_1 = class WalletNotificationService {
    constructor() {
        this.logger = new common_1.Logger(WalletNotificationService_1.name);
    }
    async addWalletWatcher(apiInfo, stellarWalletAddress, walletAddress, userFCM) {
        var _a, _b, _c, _d;
        try {
            const encrypted = await this.encryptMessageToString(userFCM);
            let data = JSON.stringify({
                "webhook_url": process.env.NOTIFICATION_WEBHOOK,
                "chainType": process.env.SOROBANHOOKS_API_TYPE,
                "walletAddress": stellarWalletAddress,
                "additionalData": encrypted
            });
            let config = {
                method: apiInfo === null || apiInfo === void 0 ? void 0 : apiInfo.METHODTYPE,
                maxBodyLength: Infinity,
                url: apiInfo === null || apiInfo === void 0 ? void 0 : apiInfo.REQUESTURL,
                headers: {
                    'x-api-key': process.env.SOROBANHOOKS_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios_1.default.request(config);
            if (response.status === 200) {
                return {
                    status: true,
                    res: (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.result
                };
            }
            else {
                this.logger.log('SorobanHooks Error API : ', {
                    status: false,
                    res: response === null || response === void 0 ? void 0 : response.data
                });
                return {
                    status: false,
                    res: ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.message) || false
                };
            }
        }
        catch (error) {
            this.logger.log('SorobanHooks Error: ', {
                status: false,
                res: error
            });
            return {
                status: false,
                res: ((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || false
            };
        }
    }
    async getSecretKey() {
        const base64Key = process.env.NOTIFICATION_ENCRYPT_KEY;
        if (!base64Key)
            throw new Error("key not found");
        const keyBuffer = Buffer.from(base64Key, 'base64');
        if (keyBuffer.length !== 32)
            throw new Error("invalid key must be 32 bytes");
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
};
WalletNotificationService = WalletNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WalletNotificationService);
exports.WalletNotificationService = WalletNotificationService;
//# sourceMappingURL=walletNotification.service.js.map