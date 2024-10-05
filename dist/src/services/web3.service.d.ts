import { AdminWalletsService } from './adminWallets.service';
import { ChainNetwork, ChainConfig, ChainAsset, ChainAssetsItem } from 'src/types/chain.interface';
export declare class ChainServices {
    currentNetwork: ChainNetwork;
    config: ChainConfig;
    networkNamesList: Array<string>;
    networkChainIdsList: Array<number>;
    networkType: string;
    private readonly NETWORK_TYPES_ENUM;
    private readonly CHAIN_CONFIG_ERROR;
    private readonly CHAIN_NETWORK_ERROR;
    private readonly CHAIN_NETWORK_LOG_CONTEXT;
    constructor();
    private setUpNetwork;
    private _getNetworks;
    getNetwork(chainId: number): ChainNetwork;
    getNetworkNamesList(): string[];
    getCurrentNetwork(): ChainNetwork;
    getNetworksChainIDList(): number[];
    getNetworkAssets(chainId: number): Array<ChainAsset>;
    getNetworkNativeAsset(chainId: number): ChainAsset;
    isChainListed(chainId: number): boolean;
    getAsset(chainId: number, assetName: string): ChainAsset;
    getAssetAddress(chainId: number, assetName: string): string;
    getAssetByAddress(chainId: number, assetAddress: string): ChainAsset;
    getAllAssets(): Array<ChainAssetsItem>;
    getAssetsTxName(assetName: string): string;
    isAssetListed(assetName: string): boolean;
}
export declare class Web3Services {
    private readonly adminWalletsService;
    private readonly chainServices;
    private readonly txFeeAddOnPercentage;
    constructor(adminWalletsService: AdminWalletsService, chainServices: ChainServices);
    transfer: (chainId: number, tokenName: string, receiver: any, amount: any) => Promise<void>;
    private _transferEth;
    private _transferEthToken;
    private _verifyEthTransfer;
}
