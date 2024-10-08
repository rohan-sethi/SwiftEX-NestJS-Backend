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
exports.TxFeeRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const txFees_model_1 = require("../models/txFees.model");
const web3_service_1 = require("../services/web3.service");
const constants_1 = require("../utils/constants");
let TxFeeRepository = class TxFeeRepository {
    constructor(txFeeModel, web3Services, chainServices) {
        this.txFeeModel = txFeeModel;
        this.web3Services = web3Services;
        this.chainServices = chainServices;
        this.createTxFeePrice();
    }
    async getTxFeePrice(txName, chainId) {
        return await this.txFeeModel.findOne({ txName, chainId });
    }
    async createTxFeePrice() {
        for (let txKey of Object.keys(constants_1.TX_NAME_ENUM)) {
            const chainIdList = this.chainServices.getNetworksChainIDList();
            for (let chainId of chainIdList) {
                const txName = constants_1.TX_NAME_ENUM[txKey];
                const avgGasAmount = constants_1.TX_NAME_TO_AVG_GAS[txName];
                const { coingechoId } = this.chainServices.getNetwork(chainId);
                const txFee = await this.txFeeModel.findOne({ txName, chainId });
                if (txFee)
                    continue;
                const { gasFee, gasPriceInEth, gasPriceInUsd } = await this.web3Services.getTxFeeData(chainId, avgGasAmount, coingechoId);
                await this.txFeeModel.create({
                    chainId,
                    txName,
                    avgGasAmount,
                    gasFee,
                    gasPriceInEth,
                    gasPriceInUsd,
                });
            }
        }
    }
    async updateTxFeePrice() {
        for (let txKey of Object.keys(constants_1.TX_NAME_ENUM)) {
            const chainIdList = this.chainServices.getNetworksChainIDList();
            for (let chainId of chainIdList) {
                const txName = constants_1.TX_NAME_ENUM[txKey];
                const avgGasAmount = constants_1.TX_NAME_TO_AVG_GAS[txName];
                const { coingechoId } = this.chainServices.getNetwork(chainId);
                const { gasFee, gasPriceInEth, gasPriceInUsd } = await this.web3Services.getTxFeeData(chainId, avgGasAmount, coingechoId);
                await this.txFeeModel.updateOne({ chainId, txName }, {
                    avgGasAmount,
                    gasFee,
                    gasPriceInEth,
                    gasPriceInUsd,
                });
            }
        }
    }
};
TxFeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(txFees_model_1.TxFee.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        web3_service_1.Web3Services,
        web3_service_1.ChainServices])
], TxFeeRepository);
exports.TxFeeRepository = TxFeeRepository;
//# sourceMappingURL=txFees.repository.js.map