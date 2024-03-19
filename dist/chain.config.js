"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainConfig = exports.CHAIN_NATIVE_CURRENCY = void 0;
const dotenv_1 = require("dotenv");
const ethers_1 = require("ethers");
(0, dotenv_1.config)();
exports.CHAIN_NATIVE_CURRENCY = 'NATIVE';
exports.chainConfig = {
    networks: [
        {
            networkId: 1,
            default: true,
            name: 'eth_mainnet',
            coingechoId: 'ethereum',
            provider: new ethers_1.ethers.providers.JsonRpcProvider(process.env.ETH_MAINNET_RPC),
            assets: [
                {
                    name: 'ETH',
                    address: exports.CHAIN_NATIVE_CURRENCY,
                    coingechoId: 'ethereum',
                },
            ],
        },
    ],
    testNetworks: [
        {
            networkId: 5,
            default: true,
            name: 'Goerli',
            coingechoId: 'ethereum',
            provider: new ethers_1.ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC),
            assets: [
                {
                    name: 'ETH',
                    address: exports.CHAIN_NATIVE_CURRENCY,
                    coingechoId: 'ethereum',
                },
                {
                    name: 'USDT',
                    address: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
                    coingechoId: 'tether',
                },
                {
                    name: 'WBTC',
                    address: '0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE',
                    coingechoId: 'wrapped-bitcoin',
                },
                {
                    name: 'DAI',
                    address: '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464',
                    coingechoId: 'dai',
                },
            ],
        },
        {
            networkId: 97,
            default: true,
            name: 'bsc_testnet',
            coingechoId: 'binancecoin',
            provider: new ethers_1.ethers.providers.JsonRpcProvider(process.env.BSC_TESTNET_RPC),
            assets: [
                {
                    name: 'BNB',
                    address: exports.CHAIN_NATIVE_CURRENCY,
                    coingechoId: 'binancecoin',
                },
                {
                    name: 'DAI(BINANCE)',
                    address: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
                    coingechoId: 'dai',
                },
            ],
        },
        {
            networkId: 80001,
            default: true,
            name: 'mumbai_testnet',
            coingechoId: 'matic-network',
            provider: new ethers_1.ethers.providers.JsonRpcProvider(process.env.MATIC_TESTNET_RPC),
            assets: [
                {
                    name: 'MATIC',
                    address: exports.CHAIN_NATIVE_CURRENCY,
                    coingechoId: 'matic-network',
                },
                {
                    name: 'WBTC(MATIC)',
                    address: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
                    coingechoId: 'wrapped-bitcoin',
                },
            ],
        },
    ],
};
//# sourceMappingURL=chain.config.js.map