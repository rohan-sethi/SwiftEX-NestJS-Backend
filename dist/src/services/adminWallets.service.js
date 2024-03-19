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
exports.AdminWalletsService = void 0;
const common_1 = require("@nestjs/common");
const adminBalances_repository_1 = require("../repositories/adminBalances.repository");
const dotenv_1 = require("dotenv");
const ethers_1 = require("ethers");
const constants_1 = require("../utils/constants");
const aws_service_1 = require("./aws.service");
const web3_service_1 = require("./web3.service");
const chain_config_1 = require("../../chain.config");
(0, dotenv_1.config)();
let AdminWalletsService = class AdminWalletsService {
    constructor(adminBalancesRepository, chainServices, awsServices) {
        this.adminBalancesRepository = adminBalancesRepository;
        this.chainServices = chainServices;
        this.awsServices = awsServices;
        this.updateAdminWallet = async () => {
            const adminWallets = await this.awsServices.getAdminWallets();
            this.adminAddresses = Object.keys(adminWallets);
        };
        this.getAdminAddresses = () => this.adminAddresses;
        this.getAssetsBalances = async (adminAddress) => {
            const assetBalances = await Promise.all(this.chainServices
                .getAllAssets()
                .map(async ({ name, chainId, address }) => {
                const provider = this.chainServices.getNetwork(chainId).provider;
                if (address === chain_config_1.CHAIN_NATIVE_CURRENCY) {
                    const balance = await provider.getBalance(adminAddress);
                    return {
                        assetName: name,
                        balance: balance.toString(),
                        chainId,
                        address,
                    };
                }
                const tokenContract = new ethers_1.ethers.Contract(address, constants_1.ERC20_ABI, provider);
                const balance = await tokenContract.balanceOf(adminAddress);
                return {
                    assetName: name,
                    balance: balance.toString(),
                    chainId,
                    address,
                };
            }));
            return assetBalances;
        };
        this.getRandomAdminWallet = () => {
            const randRange = this.adminAddresses.length;
            const randomIndex = Math.floor(Math.random() * randRange);
            return this.adminAddresses[randomIndex];
        };
        this.isAnAdminAccount = (address) => this.adminAddresses.some((adminAddress) => adminAddress.toLowerCase() === address.toLowerCase());
        this.getEnoughEthBalanceHolder = async (amount, chainId, coinName) => {
            const adminWallets = await this.awsServices.getAdminWallets();
            const walletWithEnoughBalance = [];
            const minTxFeeBalanceInBn = ethers_1.ethers.BigNumber.from(constants_1.MIN_TX_FEE_BALANCE);
            const balances = await this.adminBalancesRepository.getAdminBalanceByAsset(coinName, chainId);
            balances.map(({ balance, address }) => {
                const balanceAvailable = ethers_1.ethers.BigNumber.from(balance).sub(minTxFeeBalanceInBn);
                if (amount.lte(balanceAvailable))
                    walletWithEnoughBalance.push(adminWallets[address]);
            });
            const randomIndex = Math.floor(Math.random() * walletWithEnoughBalance.length);
            return walletWithEnoughBalance[randomIndex];
        };
        this.getEnoughEthTokenBalanceHolder = async (tokenAddress, tokenAmount, chainId) => {
            const adminWallets = await this.awsServices.getAdminWallets();
            const asset = this.chainServices.getAssetByAddress(chainId, tokenAddress);
            const tokenName = asset.name;
            const walletWithEnoughBalance = [];
            const balances = await this.adminBalancesRepository.getAdminBalanceByAsset(tokenName, chainId);
            balances.map(({ balance, address }) => {
                const privateKey = adminWallets[address];
                if (tokenAmount.lte(ethers_1.ethers.BigNumber.from(balance)))
                    walletWithEnoughBalance.push(privateKey);
            });
            const randomIndex = Math.floor(Math.random() * walletWithEnoughBalance.length);
            return walletWithEnoughBalance[randomIndex];
        };
    }
};
AdminWalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => adminBalances_repository_1.AdminBalancesRepository))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => web3_service_1.ChainServices))),
    __metadata("design:paramtypes", [adminBalances_repository_1.AdminBalancesRepository,
        web3_service_1.ChainServices,
        aws_service_1.AwsServices])
], AdminWalletsService);
exports.AdminWalletsService = AdminWalletsService;
//# sourceMappingURL=adminWallets.service.js.map