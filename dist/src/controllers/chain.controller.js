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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainController = void 0;
const common_1 = require("@nestjs/common");
const web3_service_1 = require("../services/web3.service");
let ChainController = class ChainController {
    constructor(chainServices) {
        this.chainServices = chainServices;
    }
    getChianIdList() {
        return this.chainServices.getNetworksChainIDList();
    }
    getNetworkAssets(chainId) {
        return this.chainServices.getNetworkAssets(chainId);
    }
    getNetworkNativeAsset(chainId) {
        return this.chainServices.getNetworkNativeAsset(chainId);
    }
    isChainListed(chainId) {
        return this.chainServices.isChainListed(chainId);
    }
    getAllAssets() {
        return this.chainServices.getAllAssets();
    }
    isAssetListed(assetName) {
        return this.chainServices.isAssetListed(assetName);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "getChianIdList", null);
__decorate([
    (0, common_1.Get)('getNetworkAssets/:chainId'),
    __param(0, (0, common_1.Param)('chainId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "getNetworkAssets", null);
__decorate([
    (0, common_1.Get)('getNetworkNativeAsset/:chainId'),
    __param(0, (0, common_1.Param)('chainId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "getNetworkNativeAsset", null);
__decorate([
    (0, common_1.Get)('isChainListed/:chainId'),
    __param(0, (0, common_1.Param)('chainId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "isChainListed", null);
__decorate([
    (0, common_1.Get)('getAllAssets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "getAllAssets", null);
__decorate([
    (0, common_1.Get)('isAssetListed/:assetName'),
    __param(0, (0, common_1.Param)('assetName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChainController.prototype, "isAssetListed", null);
ChainController = __decorate([
    (0, common_1.Controller)('chains'),
    __metadata("design:paramtypes", [web3_service_1.ChainServices])
], ChainController);
exports.ChainController = ChainController;
//# sourceMappingURL=chain.controller.js.map