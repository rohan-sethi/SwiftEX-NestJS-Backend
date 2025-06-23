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
var SorobanHooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorobanHooksService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let SorobanHooksService = SorobanHooksService_1 = class SorobanHooksService {
    constructor() {
        this.logger = new common_1.Logger(SorobanHooksService_1.name);
    }
    async addWalletWatcher(apiInfo, walletAddress) {
        var _a, _b, _c, _d;
        try {
            let data = JSON.stringify({
                "webhook_url": process.env.NOTIFICATION_WEBHOOK,
                "chainType": process.env.SOROBANHOOKS_API_TYPE,
                "walletAddress": walletAddress
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
                return {
                    status: false,
                    res: ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.message) || false
                };
            }
        }
        catch (error) {
            return {
                status: false,
                res: ((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || false
            };
        }
    }
};
SorobanHooksService = SorobanHooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SorobanHooksService);
exports.SorobanHooksService = SorobanHooksService;
//# sourceMappingURL=sorobanHooks.service.js.map