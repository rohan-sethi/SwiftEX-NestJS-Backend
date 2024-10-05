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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Services = exports.ChainServices = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const constants_1 = require("../utils/constants");
const adminWallets_service_1 = require("./adminWallets.service");
const chain_config_1 = require("../../chain.config");
(0, dotenv_1.config)();
let ChainServices = class ChainServices {
    constructor() {
        this.networkNamesList = [];
        this.networkChainIdsList = [];
        this.NETWORK_TYPES_ENUM = {
            MAINNET: 'MAINNET',
            TESTNET: 'TESTNET',
        };
        this.CHAIN_CONFIG_ERROR = 'CHAIN_CONFIG_ERROR';
        this.CHAIN_NETWORK_ERROR = 'CHAIN_NETWORK_ERROR';
        this.CHAIN_NETWORK_LOG_CONTEXT = 'BlockchainNetworkConfig';
        this.setUpNetwork();
    }
    setUpNetwork() {
        common_1.Logger.log('Starting blockchain network configuration', this.CHAIN_NETWORK_LOG_CONTEXT);
        this.networkType = process.env.CHAIN_NETWORK_TYPE;
        if (!this.networkType ||
            (this.networkType !== this.NETWORK_TYPES_ENUM.MAINNET &&
                this.networkType !== this.NETWORK_TYPES_ENUM.TESTNET)) {
            this.networkType = this.NETWORK_TYPES_ENUM.TESTNET;
            common_1.Logger.warn("Chain type isn't properly set in .env, so testnet is used", this.CHAIN_NETWORK_LOG_CONTEXT);
        }
        this.config = chain_config_1.chainConfig;
        const currentNetworks = this.networkType === this.NETWORK_TYPES_ENUM.MAINNET
            ? this.config.networks
            : this.config.testNetworks;
        if (!currentNetworks.length)
            throw new Error(`${this.CHAIN_CONFIG_ERROR}: No network is set in chain.config.ts`);
        const defaultNetworks = currentNetworks.filter((network) => network.default);
        if (defaultNetworks.length)
            this.currentNetwork = defaultNetworks[0];
        else {
            this.currentNetwork = currentNetworks[0];
            common_1.Logger.warn(`No default network is set, thus network defualted to [${this.currentNetwork.name.toUpperCase()}]`, this.CHAIN_NETWORK_LOG_CONTEXT);
        }
        const assets = this.currentNetwork.assets;
        if (!assets.length)
            throw new Error(`${this.CHAIN_CONFIG_ERROR}: No assets were listed, native currency is expected at least`);
        if (!assets.some(({ address }) => address === chain_config_1.CHAIN_NATIVE_CURRENCY))
            throw new Error(`${this.CHAIN_CONFIG_ERROR}: No native currency is listed in [${this.currentNetwork.name.toUpperCase()}] network`);
        common_1.Logger.log('blockchain network configuration completed successfully', this.CHAIN_NETWORK_LOG_CONTEXT);
        currentNetworks.map(({ name, networkId }) => {
            this.networkNamesList.push(name);
            this.networkChainIdsList.push(networkId);
        });
    }
    _getNetworks() {
        return this.networkType === this.NETWORK_TYPES_ENUM.MAINNET
            ? this.config.networks
            : this.config.testNetworks;
    }
    getNetwork(chainId) {
        const networks = this._getNetworks();
        const network = networks.filter(({ networkId }) => networkId === chainId)[0];
        if (!network)
            throw new Error(`${this.CHAIN_NETWORK_ERROR}: Could find network with name ${chainId}`);
        return network;
    }
    getNetworkNamesList() {
        return this.networkNamesList;
    }
    getCurrentNetwork() {
        return this.currentNetwork;
    }
    getNetworksChainIDList() {
        return this.networkChainIdsList;
    }
    getNetworkAssets(chainId) {
        if (!this.isChainListed(chainId))
            throw new common_1.HttpException('Chain not listed', common_1.HttpStatus.NOT_FOUND);
        const network = this.getNetwork(chainId);
        return network.assets;
    }
    getNetworkNativeAsset(chainId) {
        const network = this.getNetwork(chainId);
        return network.assets.filter(({ address }) => address === chain_config_1.CHAIN_NATIVE_CURRENCY)[0];
    }
    isChainListed(chainId) {
        const networks = this._getNetworks();
        return networks.some(({ networkId }) => chainId === networkId);
    }
    getAsset(chainId, assetName) {
        const assetNameUppercased = assetName.toUpperCase();
        const assets = this.getNetworkAssets(chainId);
        const desiredAsset = assets.filter(({ name }) => name === assetNameUppercased)[0];
        if (!desiredAsset) {
            throw new common_1.HttpException(`${this.CHAIN_NETWORK_ERROR}: Could not find ${assetName} asset in the ${chainId} networkId`, common_1.HttpStatus.NOT_FOUND);
        }
        return desiredAsset;
    }
    getAssetAddress(chainId, assetName) {
        return this.getAsset(chainId, assetName).address;
    }
    getAssetByAddress(chainId, assetAddress) {
        const assets = this.getNetworkAssets(chainId);
        const desiredAsset = assets.filter(({ address }) => address === assetAddress)[0];
        if (!desiredAsset) {
            throw new Error(`${this.CHAIN_NETWORK_ERROR}: Could not find an asset with ${assetAddress} address in the ${chainId} networkId`);
        }
        return desiredAsset;
    }
    getAllAssets() {
        const allAssets = [];
        const networks = this._getNetworks();
        networks.map(({ assets, networkId, name }) => {
            assets.map((asset) => allAssets.push(Object.assign(Object.assign({}, asset), { chainId: networkId, chainName: name })));
        });
        return allAssets;
    }
    getAssetsTxName(assetName) {
        const assetNameUppercased = assetName.toUpperCase();
        const assetsList = this.getAllAssets();
        const desiredAsset = assetsList.filter(({ name }) => assetNameUppercased === name)[0];
        if (!desiredAsset)
            throw new common_1.HttpException(`Could not find ${assetName} in assets list`, common_1.HttpStatus.NOT_FOUND);
        if (desiredAsset.address === chain_config_1.CHAIN_NATIVE_CURRENCY)
            return constants_1.TX_NAME_ENUM.ETH_TRANSFER;
        return constants_1.TX_NAME_ENUM.ETH_ERC20_TRANSFER;
    }
    isAssetListed(assetName) {
        const assets = this.getAllAssets();
        return assets.some(({ name }) => name === assetName.toUpperCase());
    }
};
ChainServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChainServices);
exports.ChainServices = ChainServices;
let Web3Services = class Web3Services {
    constructor(adminWalletsService, chainServices) {
        this.adminWalletsService = adminWalletsService;
        this.chainServices = chainServices;
        this.transfer = (chainId, tokenName, receiver, amount) => {
            const { provider } = this.chainServices.getNetwork(chainId);
            const tokenAddress = this.chainServices.getAssetAddress(chainId, tokenName);
            const network = { provider, chainId };
            if (tokenAddress === chain_config_1.CHAIN_NATIVE_CURRENCY)
                return this._transferEth(receiver, amount, network);
            if (!tokenAddress)
                throw new Error(`Invalid token name: ${tokenName}`);
            return this._transferEthToken(tokenAddress, receiver, amount, network);
        };
        this._transferEth = async (reciever, amount, network) => {
        };
        this._transferEthToken = async (tokenAddress, receiver, amount, network) => {
        };
        this._verifyEthTransfer = (tx, amount) => {
            const { to, value } = tx;
        };
        this.txFeeAddOnPercentage =
            Number(process.env.TX_FEE_ADD_ON_PERCENTAGE) / 100;
    }
};
Web3Services = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adminWallets_service_1.AdminWalletsService,
        ChainServices])
], Web3Services);
exports.Web3Services = Web3Services;
//# sourceMappingURL=web3.service.js.map