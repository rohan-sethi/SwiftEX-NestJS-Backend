import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { config } from 'dotenv';
import { ERC20_ABI, TX_NAME_ENUM } from '../utils/constants';
import { ethers } from 'ethers';
import { AdminWalletsService } from './adminWallets.service';
import { getAssetToUsd } from 'src/utils/getAssetPrice';
import {
  ChainNetwork,
  ChainConfig,
  ChainAsset,
  ChainAssetsItem,
} from 'src/types/chain.interface';
import { chainConfig, CHAIN_NATIVE_CURRENCY } from 'chain.config';
import { Web3Network } from 'src/types/web3.interface';
config();

@Injectable()
export class ChainServices {
  currentNetwork: ChainNetwork;
  config: ChainConfig;
  networkNamesList: Array<string> = [];
  networkChainIdsList: Array<number> = [];
  networkType: string;

  // Constants
  private readonly NETWORK_TYPES_ENUM = {
    MAINNET: 'MAINNET',
    TESTNET: 'TESTNET',
  };
  private readonly CHAIN_CONFIG_ERROR = 'CHAIN_CONFIG_ERROR';
  private readonly CHAIN_NETWORK_ERROR = 'CHAIN_NETWORK_ERROR';
  private readonly CHAIN_NETWORK_LOG_CONTEXT = 'BlockchainNetworkConfig';

  constructor() {
    this.setUpNetwork();
  }

  private setUpNetwork() {
    Logger.log(
      'Starting blockchain network configuration',
      this.CHAIN_NETWORK_LOG_CONTEXT,
    );

    // Network type configuration
    this.networkType = process.env.CHAIN_NETWORK_TYPE;
    if (
      !this.networkType ||
      (this.networkType !== this.NETWORK_TYPES_ENUM.MAINNET &&
        this.networkType !== this.NETWORK_TYPES_ENUM.TESTNET)
    ) {
      this.networkType = this.NETWORK_TYPES_ENUM.TESTNET;
      Logger.warn(
        "Chain type isn't properly set in .env, so testnet is used",
        this.CHAIN_NETWORK_LOG_CONTEXT,
      );
    }

    this.config = chainConfig;

    // Set up current network
    const currentNetworks =
      this.networkType === this.NETWORK_TYPES_ENUM.MAINNET
        ? this.config.networks
        : this.config.testNetworks;

    if (!currentNetworks.length)
      throw new Error(
        `${this.CHAIN_CONFIG_ERROR}: No network is set in chain.config.ts`,
      );

    const defaultNetworks = currentNetworks.filter(
      (network) => network.default,
    );
    if (defaultNetworks.length) this.currentNetwork = defaultNetworks[0];
    else {
      this.currentNetwork = currentNetworks[0];
      Logger.warn(
        `No default network is set, thus network defualted to [${this.currentNetwork.name.toUpperCase()}]`,
        this.CHAIN_NETWORK_LOG_CONTEXT,
      );
    }

    // Check for current network assets list
    const assets: Array<ChainAsset> = this.currentNetwork.assets;
    if (!assets.length)
      throw new Error(
        `${this.CHAIN_CONFIG_ERROR}: No assets were listed, native currency is expected at least`,
      );

    if (!assets.some(({ address }) => address === CHAIN_NATIVE_CURRENCY))
      throw new Error(
        `${
          this.CHAIN_CONFIG_ERROR
        }: No native currency is listed in [${this.currentNetwork.name.toUpperCase()}] network`,
      );

    Logger.log(
      'blockchain network configuration completed successfully',
      this.CHAIN_NETWORK_LOG_CONTEXT,
    );

    // Extract network names & chainIds
    currentNetworks.map(({ name, networkId }) => {
      this.networkNamesList.push(name);
      this.networkChainIdsList.push(networkId);
    });
  }

  private _getNetworks() {
    return this.networkType === this.NETWORK_TYPES_ENUM.MAINNET
      ? this.config.networks
      : this.config.testNetworks;
  }

  // Network level getters
  getNetwork(chainId: number): ChainNetwork {
    const networks = this._getNetworks();
    const network = networks.filter(
      ({ networkId }) => networkId === chainId,
    )[0];
    if (!network)
      throw new Error(
        `${this.CHAIN_NETWORK_ERROR}: Could find network with name ${chainId}`,
      );

    return network;
  }

  getNetworkNamesList() {
    return this.networkNamesList;
  }

  getCurrentNetwork(): ChainNetwork {
    return this.currentNetwork;
  }

  getNetworksChainIDList() {
    return this.networkChainIdsList;
  }

  getNetworkAssets(chainId: number): Array<ChainAsset> {
    if (!this.isChainListed(chainId))
      throw new HttpException('Chain not listed', HttpStatus.NOT_FOUND);

    const network = this.getNetwork(chainId);
    return network.assets;
  }

  getNetworkNativeAsset(chainId: number): ChainAsset {
    const network = this.getNetwork(chainId);
    return network.assets.filter(
      ({ address }) => address === CHAIN_NATIVE_CURRENCY,
    )[0];
  }

  isChainListed(chainId: number): boolean {
    const networks = this._getNetworks();
    return networks.some(({ networkId }) => chainId === networkId);
  }

  // Asset level getters
  getAsset(chainId: number, assetName: string): ChainAsset {
    const assetNameUppercased = assetName.toUpperCase();
    const assets = this.getNetworkAssets(chainId);
    const desiredAsset = assets.filter(
      ({ name }) => name === assetNameUppercased,
    )[0];
    if (!desiredAsset) {
      throw new HttpException(
        `${this.CHAIN_NETWORK_ERROR}: Could not find ${assetName} asset in the ${chainId} networkId`,
        HttpStatus.NOT_FOUND,
      );
    }

    return desiredAsset;
  }

  getAssetAddress(chainId: number, assetName: string): string {
    return this.getAsset(chainId, assetName).address;
  }

  getAssetByAddress(chainId: number, assetAddress: string): ChainAsset {
    const assets = this.getNetworkAssets(chainId);
    const desiredAsset = assets.filter(
      ({ address }) => address === assetAddress,
    )[0];

    if (!desiredAsset) {
      throw new Error(
        `${this.CHAIN_NETWORK_ERROR}: Could not find an asset with ${assetAddress} address in the ${chainId} networkId`,
      );
    }

    return desiredAsset;
  }

  getAllAssets(): Array<ChainAssetsItem> {
    const allAssets: Array<ChainAssetsItem> = [];

    const networks = this._getNetworks();
    networks.map(({ assets, networkId, name }) => {
      assets.map((asset) =>
        allAssets.push({ ...asset, chainId: networkId, chainName: name }),
      );
    });

    return allAssets;
  }

  getAssetsTxName(assetName: string): string {
    const assetNameUppercased = assetName.toUpperCase();
    const assetsList = this.getAllAssets();

    const desiredAsset = assetsList.filter(
      ({ name }) => assetNameUppercased === name,
    )[0];

    if (!desiredAsset)
      throw new HttpException(
        `Could not find ${assetName} in assets list`,
        HttpStatus.NOT_FOUND,
      );

    if (desiredAsset.address === CHAIN_NATIVE_CURRENCY)
      return TX_NAME_ENUM.ETH_TRANSFER;

    return TX_NAME_ENUM.ETH_ERC20_TRANSFER;
  }

  isAssetListed(assetName: string): boolean {
    const assets = this.getAllAssets();
    return assets.some(({ name }) => name === assetName.toUpperCase());
  }
}

@Injectable()
export class Web3Services {
  private readonly txFeeAddOnPercentage: number;
  constructor(
    private readonly adminWalletsService: AdminWalletsService,
    private readonly chainServices: ChainServices,
  ) {
    this.txFeeAddOnPercentage =
      Number(process.env.TX_FEE_ADD_ON_PERCENTAGE) / 100;
  }

  transfer = (chainId: number, tokenName: string, receiver, amount) => {
    const { provider } = this.chainServices.getNetwork(chainId);
    const tokenAddress = this.chainServices.getAssetAddress(chainId, tokenName);
    const network: Web3Network = { provider, chainId };

    if (tokenAddress === CHAIN_NATIVE_CURRENCY)
      return this._transferEth(receiver, amount, network);

    if (!tokenAddress) throw new Error(`Invalid token name: ${tokenName}`);

    return this._transferEthToken(tokenAddress, receiver, amount, network);
  };

  // submitSignedTx = async (chainId: number, signedTx) => {
  //   try {
  //     const { provider } = this.chainServices.getNetwork(chainId);
  //     const sentTx = await provider.sendTransaction(signedTx.rawTransaction);
  //     const minedTx = await sentTx.wait();
  //     return { sentTx: minedTx };
  //   } catch (err) {
  //     console.log(err);
  //     return { err };
  //   }
  // };

  // verifyTransfer = async (
  //   chainId: number,
  //   signedTx,
  //   tokenName: string,
  //   amount,
  // ) => {
  //   // try {
  //   //   const { provider } = this.chainServices.getNetwork(chainId);
  //   //   const assetAddress = this.chainServices.getAssetAddress(
  //   //     chainId,
  //   //     tokenName,
  //   //   );
  //   //   const decodedTx: ethers.Transaction = ethers.utils.parseTransaction(
  //   //     signedTx.rawTransaction,
  //   //   );

  //   //   if (assetAddress === CHAIN_NATIVE_CURRENCY)
  //   //     return this._verifyEthTransfer(decodedTx, amount);
  //   //   return await this._verifyEthTokenTransfer(decodedTx, tokenName, amount, {
  //   //     provider,
  //   //     chainId,
  //   //   });
  //   // } catch (err) {
  //   //   console.log(err);
  //   // }
  // };

  // async getTxFeeData(chainId: number, gasAmount: string, assetId: string) {
  //   // const { provider } = this.chainServices.getNetwork(chainId);
  //   // const { maxFeePerGas, gasPrice } = await provider.getFeeData();
  //   // const estimatedGasFee = maxFeePerGas || gasPrice;
  //   // const gasInBn = ethers.BigNumber.from(gasAmount);
  //   // const gasPriceInEth = ethers.utils.formatEther(
  //   //   gasInBn.mul(estimatedGasFee),
  //   // );

  //   // const ethPriceInUsd = await getAssetToUsd(assetId);
  //   // let gasPriceInUsd = Math.ceil(+gasPriceInEth * +ethPriceInUsd);
  //   // gasPriceInUsd = gasPriceInUsd + gasPriceInUsd * this.txFeeAddOnPercentage;

  //   // return {
  //   //   gasFee: estimatedGasFee.toString(),
  //   //   gasPriceInEth,
  //   //   gasPriceInUsd: gasPriceInUsd.toString(),
  //   // };
  // }

  // <------------------------------< Private >------------------------------>
  private _transferEth = async (reciever, amount, network: Web3Network) => {
    // try {
    //   const value = ethers.utils.parseEther(amount.toString());
    //   const { name } = this.chainServices.getNetworkNativeAsset(
    //     network.chainId,
    //   );

    //   const rawTx = {
    //     to: reciever,
    //     value,
    //   };

    //   const adminPK = await this.adminWalletsService.getEnoughEthBalanceHolder(
    //     value,
    //     network.chainId,
    //     name,
    //   );

    //   const wallet = new ethers.Wallet(adminPK, network.provider);
    //   const sentTx = await wallet.sendTransaction(rawTx);
    //   await sentTx.wait();

    //   return { sentTx };
    // } catch (err) {
    //   console.log('SEND_ETH_ERROR:', err);
    //   return { err };
    // }
  };

  private _transferEthToken = async (
    tokenAddress,
    receiver,
    amount,
    network: Web3Network,
  ) => {
    // try {
    //   const token = new ethers.Contract(
    //     tokenAddress,
    //     JSON.parse(JSON.stringify(ERC20_ABI)),
    //     network.provider,
    //   );

    //   const decimals = await token.decimals();
    //   const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);
    //   const adminPK =
    //     await this.adminWalletsService.getEnoughEthTokenBalanceHolder(
    //       tokenAddress,
    //       amountInWei,
    //       network.chainId,
    //     );

    //   const wallet = new ethers.Wallet(adminPK, network.provider);
    //   const connectedToken = token.connect(wallet);
    //   const sentTx = await connectedToken.transfer(receiver, amountInWei);
    //   await sentTx.wait();

    //   return { sentTx };
    // } catch (err) {
    //   console.log('SEND_ETH_TOKEN_ERROR:', err);
    //   return { err };
    // }
  };

  private _verifyEthTransfer = (tx: ethers.Transaction, amount) => {
    const { to, value } = tx;

    // const amountInWei = Web3.utils.toWei(amount);
    // if (amountInWei.toString() !== value.toString()) return false;
    // if (!this.adminWalletsService.isAnAdminAccount(to)) return false;
    // return true;
  };

//   private _verifyEthTokenTransfer = async (
//   //   tx: ethers.Transaction,
//   //   tokenName: string,
//   //   amount,
//   //   network: Web3Network,
//   // ) => {
//   //   const tokenInterface = new ethers.utils.Interface(ERC20_ABI);

//   //   const tokenAddress = this.chainServices.getAssetAddress(
//   //     network.chainId,
//   //     tokenName,
//   //   );

//   //   const tokenContract = new ethers.Contract(
//   //     tokenAddress,
//   //     JSON.parse(JSON.stringify(ERC20_ABI)),
//   //     network.provider,
//   //   );

//   //   const decimals = await tokenContract.decimals();
//   //   const amountInWei = ethers.utils.parseUnits(amount, decimals);

//   //   const { to, data } = tx;
//   //   const txData = tokenInterface.decodeFunctionData('transfer', data);
//   //   const reciever = txData[0];
//   //   const value = txData[1];

//   //   // verify
//   //   if (to.toLowerCase() !== tokenAddress.toLowerCase()) return false;
//   //   if (!this.adminWalletsService.isAnAdminAccount(reciever)) return false;
//   //   if (amountInWei.toString() !== value.toString()) return false;
//   //   return true;
//   // };
}
