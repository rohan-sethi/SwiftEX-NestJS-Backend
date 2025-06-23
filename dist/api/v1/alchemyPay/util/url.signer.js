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
var UrlSigner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlSigner = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let UrlSigner = UrlSigner_1 = class UrlSigner {
    constructor() {
        this.logger = new common_1.Logger(UrlSigner_1.name);
        this.alchemyKey = process.env.ALCHEMY_PAY_SECRET;
    }
    apiSign(timestamp, method, requestUrl, body, secretKey) {
        const content = timestamp + method.toUpperCase() + this.getPath(requestUrl) + this.getJsonBody(body);
        return crypto.createHmac('sha256', secretKey)
            .update(content, 'utf8')
            .digest('base64');
    }
    getPath(requestUrl) {
        const uri = new URL(requestUrl);
        const path = uri.pathname;
        const params = Array.from(uri.searchParams.entries());
        if (params.length === 0)
            return path;
        const sortedParams = [...params].sort(([a], [b]) => a.localeCompare(b));
        const queryString = sortedParams.map(([key, val]) => `${key}=${val}`).join('&');
        return `${path}?${queryString}`;
    }
    getJsonBody(body) {
        let map;
        try {
            map = JSON.parse(body);
        }
        catch (_a) {
            map = {};
        }
        if (Object.keys(map).length === 0)
            return '';
        map = this.removeEmptyKeys(map);
        map = this.sortObject(map);
        return JSON.stringify(map);
    }
    removeEmptyKeys(obj) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null && value !== '') {
                result[key] = value;
            }
        }
        return result;
    }
    sortObject(obj) {
        if (Array.isArray(obj)) {
            return this.sortList(obj);
        }
        else if (typeof obj === 'object') {
            return this.sortMap(obj);
        }
        return obj;
    }
    sortMap(map) {
        const sortedEntries = Object.entries(this.removeEmptyKeys(map)).sort(([a], [b]) => a.localeCompare(b));
        const result = {};
        for (const [key, value] of sortedEntries) {
            result[key] = typeof value === 'object' ? this.sortObject(value) : value;
        }
        return result;
    }
    sortList(list) {
        const numbers = list.filter(item => typeof item === 'number' && !Number.isInteger(item)).sort((a, b) => a - b);
        const integers = list.filter(item => Number.isInteger(item)).sort((a, b) => a - b);
        const strings = list.filter(item => typeof item === 'string').sort();
        const objects = list.filter(item => typeof item === 'object').map(item => this.sortObject(item));
        return [...integers, ...numbers, ...strings, ...objects];
    }
    async payloadGenrator(apiPayload, method, requestUrl) {
        try {
            const timestamp = String(Date.now());
            const body = JSON.stringify(apiPayload);
            const sign = await this.apiSign(timestamp, method, requestUrl, body, this.alchemyKey);
            return {
                "status": true,
                "timestamp": timestamp,
                "sign": sign,
                "encodeURI": await encodeURIComponent(sign)
            };
        }
        catch (error) {
            console.log("payloadGenrator faild", error);
            return { "status": false };
        }
    }
};
UrlSigner = UrlSigner_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UrlSigner);
exports.UrlSigner = UrlSigner;
//# sourceMappingURL=url.signer.js.map