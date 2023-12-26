import { ethers } from 'ethers';

export type ChainAsset = {
  name: string;
  address: string;
  coingechoId: string;
};

export type ChainNetwork = {
  networkId: number;
  default?: boolean;
  name: string;

  /**
   * https://www.coingecko.com/ asset ID to fetch its price
   * To get the asset ID, go to their website and search for the asset
   * when found copy its API id.
   */
  coingechoId: string;
  provider: ethers.providers.JsonRpcProvider;
  assets: Array<ChainAsset>;
};

export type ChainConfig = {
  networks: Array<ChainNetwork>;
  testNetworks: Array<ChainNetwork>;
};

export type ChainAssetsItem = {
  name: string;
  address: string;
  chainId: number;
  chainName?: string;
  coingechoId: string;
};
