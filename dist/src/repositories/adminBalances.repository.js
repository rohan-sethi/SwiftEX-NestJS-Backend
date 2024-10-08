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
exports.AdminBalancesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chain_config_1 = require("../../chain.config");
const ethers_1 = require("ethers");
const mongoose_2 = require("mongoose");
const adminBalances_model_1 = require("../models/adminBalances.model");
const adminWallets_service_1 = require("../services/adminWallets.service");
const constants_1 = require("../utils/constants");
let AdminBalancesRepository = class AdminBalancesRepository {
    constructor(adminBalancesModel, adminWalletsService) {
        this.adminBalancesModel = adminBalancesModel;
        this.adminWalletsService = adminWalletsService;
        this.createAdminBalances();
    }
    async createAdminBalances() {
        try {
            const adminAddresses = this.adminWalletsService.getAdminAddresses();
            for (let address of adminAddresses) {
                const adminBalances = await this.getAdminBalancesByAddress(address);
                if (adminBalances)
                    return;
                const balances = await this.adminWalletsService.getAssetsBalances(address);
                const insufficientBlances = [];
                const txFeeBalances = [];
                const ethBalances = balances.filter((balance) => balance.address === chain_config_1.CHAIN_NATIVE_CURRENCY);
                ethBalances.map(({ balance, chainId }) => {
                    const hasEnoughTxFeeBalance = ethers_1.ethers.BigNumber.from(balance).gte(ethers_1.ethers.BigNumber.from(constants_1.MIN_TX_FEE_BALANCE));
                    txFeeBalances.push({ hasEnoughTxFeeBalance, chainId });
                    if (!hasEnoughTxFeeBalance)
                        insufficientBlances.push(chainId);
                });
                if (insufficientBlances.length)
                    common_1.Logger.warn(`Admin Wallet with "${address}" address has not enough tx fee balance for the ${insufficientBlances.join(', ')} chainId/s`, 'AdminWalletsBalances');
                await this.adminBalancesModel.create({
                    address,
                    txFeeBalances,
                    balances,
                });
            }
        }
        catch (err) {
            common_1.Logger.error(err, 'ADMIN_BALANCES_CREATION_ERROR');
        }
    }
    async updateAdminBalances() {
        try {
            const adminAddresses = this.adminWalletsService.getAdminAddresses();
            for (let address of adminAddresses) {
                const balances = await this.adminWalletsService.getAssetsBalances(address);
                const insufficientBlances = [];
                const txFeeBalances = [];
                const ethBalances = balances.filter((balance) => balance.address === chain_config_1.CHAIN_NATIVE_CURRENCY);
                ethBalances.map(({ balance, chainId }) => {
                    const hasEnoughTxFeeBalance = ethers_1.ethers.BigNumber.from(balance).gte(ethers_1.ethers.BigNumber.from(constants_1.MIN_TX_FEE_BALANCE));
                    txFeeBalances.push({ hasEnoughTxFeeBalance, chainId });
                    if (!hasEnoughTxFeeBalance)
                        insufficientBlances.push(chainId);
                });
                if (insufficientBlances.length)
                    common_1.Logger.warn(`Admin Wallet with "${address}" address has not enough tx fee balance for the ${insufficientBlances.join(', ')} chainId/s`, 'AdminWalletsBalances');
                await this.adminBalancesModel.updateOne({ address }, { balances, txFeeBalances });
            }
        }
        catch (err) {
            common_1.Logger.error(err, 'ADMIN_BALNCES_UPDATE_ERROR');
        }
    }
    async getAdminBalancesByAddress(address) {
        return await this.adminBalancesModel.findOne({ address });
    }
    async getAdminBalanceByAsset(assetName, chainId) {
        const upperCasedAssetName = assetName.toUpperCase();
        const balances = await this.adminBalancesModel.aggregate([
            {
                $match: {
                    $and: [
                        { 'balances.assetName': upperCasedAssetName },
                        {
                            txFeeBalances: {
                                $elemMatch: { hasEnoughTxFeeBalance: true, chainId: chainId },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    address: 1,
                    balances: {
                        $filter: {
                            input: '$balances',
                            as: 'balance',
                            cond: {
                                $and: [{ $eq: ['$$balance.assetName', upperCasedAssetName] }],
                            },
                        },
                    },
                },
            },
        ]);
        return balances.map((adminBalance) => {
            const { balance, assetName } = adminBalance.balances[0];
            const { address } = adminBalance;
            return { address, balance, assetName };
        });
    }
};
AdminBalancesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(adminBalances_model_1.AdminBalances.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => adminWallets_service_1.AdminWalletsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        adminWallets_service_1.AdminWalletsService])
], AdminBalancesRepository);
exports.AdminBalancesRepository = AdminBalancesRepository;
//# sourceMappingURL=adminBalances.repository.js.map