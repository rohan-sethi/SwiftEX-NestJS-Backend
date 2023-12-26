import { ethers } from 'ethers';

export type Web3Network = {
  chainId: number;
  provider: ethers.providers.JsonRpcProvider;
};
