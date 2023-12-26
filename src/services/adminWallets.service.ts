import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AdminBalancesRepository } from 'src/repositories/adminBalances.repository';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { Balance } from 'src/models/adminBalances.model';
import { ERC20_ABI, MIN_TX_FEE_BALANCE } from '../utils/constants';
import { AwsServices } from './aws.service';
import { ChainServices } from './web3.service';
import { CHAIN_NATIVE_CURRENCY } from 'chain.config';
config();

@Injectable()
export class AdminWalletsService {
  private adminAddresses: Array<string>;
  constructor(
    @Inject(forwardRef(() => AdminBalancesRepository))
    private readonly adminBalancesRepository: AdminBalancesRepository,
    @Inject(forwardRef(() => ChainServices))
    private readonly chainServices: ChainServices,
    private readonly awsServices: AwsServices,
  ) {
    this.updateAdminWallet();
  }

  updateAdminWallet = async () => {
    const adminWallets = await this.awsServices.getAdminWallets();
    this.adminAddresses = Object.keys(adminWallets);
  };

  getAdminAddresses = (): Array<string> => this.adminAddresses;

  getAssetsBalances = async (adminAddress: string): Promise<Array<Balance>> => {
    const assetBalances: Array<Balance> = await Promise.all(
      this.chainServices
        .getAllAssets()
        .map(async ({ name, chainId, address }) => {
          const provider = this.chainServices.getNetwork(chainId).provider;
          if (address === CHAIN_NATIVE_CURRENCY) {
            const balance = await provider.getBalance(adminAddress);
            return {
              assetName: name,
              balance: balance.toString(),
              chainId,
              address,
            };
          }

          const tokenContract = new ethers.Contract(
            address,
            ERC20_ABI,
            provider,
          );
          const balance = await tokenContract.balanceOf(adminAddress);
          return {
            assetName: name,
            balance: balance.toString(),
            chainId,
            address,
          };
        }),
    );

    return assetBalances;
  };

  getRandomAdminWallet = () => {
    const randRange = this.adminAddresses.length;
    const randomIndex = Math.floor(Math.random() * randRange);
    return this.adminAddresses[randomIndex];
  };

  isAnAdminAccount = (address: string): boolean =>
    this.adminAddresses.some(
      (adminAddress) => adminAddress.toLowerCase() === address.toLowerCase(),
    );

  /**
   * Finds first wallet having equal/more amount of ether in balance
   * @param amount amount in ether needed for tx
   * @param chainId the networkId in the chain.config
   * @param coinName the native currency name of the EVM chain
   * @returns a private key of admin wallets
   */
  getEnoughEthBalanceHolder = async (
    amount: ethers.BigNumber,
    chainId: number,
    coinName: string,
  ): Promise<string> => {
    const adminWallets = await this.awsServices.getAdminWallets();
    const walletWithEnoughBalance = [];
    const minTxFeeBalanceInBn = ethers.BigNumber.from(MIN_TX_FEE_BALANCE);
    const balances = await this.adminBalancesRepository.getAdminBalanceByAsset(
      coinName,
      chainId,
    );

    balances.map(({ balance, address }) => {
      const balanceAvailable =
        ethers.BigNumber.from(balance).sub(minTxFeeBalanceInBn);
      if (amount.lte(balanceAvailable))
        walletWithEnoughBalance.push(adminWallets[address]);
    });

    const randomIndex = Math.floor(
      Math.random() * walletWithEnoughBalance.length,
    );

    return walletWithEnoughBalance[randomIndex];
  };

  /**
   * Finds wallet having equal/more amount of ether token in balance
   * @param tokenAddress address of the token
   * @param tokenAmount amount (inWei) of token needed
   * @param chainId the networkId in the chain.config
   * @returns a private key of admin wallets
   */
  getEnoughEthTokenBalanceHolder = async (
    tokenAddress: string,
    tokenAmount: ethers.BigNumber,
    chainId: number,
  ): Promise<string> => {
    const adminWallets = await this.awsServices.getAdminWallets();
    const asset = this.chainServices.getAssetByAddress(chainId, tokenAddress);
    const tokenName = asset.name;

    const walletWithEnoughBalance = [];
    const balances = await this.adminBalancesRepository.getAdminBalanceByAsset(
      tokenName,
      chainId,
    );

    balances.map(({ balance, address }) => {
      const privateKey = adminWallets[address];
      if (tokenAmount.lte(ethers.BigNumber.from(balance)))
        walletWithEnoughBalance.push(privateKey);
    });

    const randomIndex = Math.floor(
      Math.random() * walletWithEnoughBalance.length,
    );

    return walletWithEnoughBalance[randomIndex];
  };
}
