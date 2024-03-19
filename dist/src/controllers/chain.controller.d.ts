import { ChainServices } from 'src/services/web3.service';
export declare class ChainController {
    private readonly chainServices;
    constructor(chainServices: ChainServices);
    getChianIdList(): number[];
    getNetworkAssets(chainId: number): import("../types/chain.interface").ChainAsset[];
    getNetworkNativeAsset(chainId: number): import("../types/chain.interface").ChainAsset;
    isChainListed(chainId: number): boolean;
    getAllAssets(): import("../types/chain.interface").ChainAssetsItem[];
    isAssetListed(assetName: string): boolean;
}
