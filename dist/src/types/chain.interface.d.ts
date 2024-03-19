import { ethers } from 'ethers';
export declare type ChainAsset = {
    name: string;
    address: string;
    coingechoId: string;
};
export declare type ChainNetwork = {
    networkId: number;
    default?: boolean;
    name: string;
    coingechoId: string;
    provider: ethers.providers.JsonRpcProvider;
    assets: Array<ChainAsset>;
};
export declare type ChainConfig = {
    networks: Array<ChainNetwork>;
    testNetworks: Array<ChainNetwork>;
};
export declare type ChainAssetsItem = {
    name: string;
    address: string;
    chainId: number;
    chainName?: string;
    coingechoId: string;
};
