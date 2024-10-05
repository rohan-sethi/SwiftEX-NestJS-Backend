import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CHAIN_NATIVE_CURRENCY } from 'chain.config';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import {
  AdminBalances,
  AdminBalancesDocument,
  HasEnoughFeeBalance,
} from 'src/models/adminBalances.model';
import { AdminWalletsService } from 'src/services/adminWallets.service';
import { MIN_TX_FEE_BALANCE } from 'src/utils/constants';

@Injectable()
export class AdminBalancesRepository {
  constructor(
    @InjectModel(AdminBalances.name)
    private adminBalancesModel: Model<AdminBalancesDocument>,
    @Inject(forwardRef(() => AdminWalletsService))
    private readonly adminWalletsService: AdminWalletsService,
  ) {
    this.createAdminBalances();
  }

  private async createAdminBalances() {
    // try {
    //   // Get admin addresses
    //   const adminAddresses = this.adminWalletsService.getAdminAddresses();

    //   for (let address of adminAddresses) {
    //     // Check if admin already exist
    //     const adminBalances = await this.getAdminBalancesByAddress(address);
    //     if (adminBalances) return;

    //     // Create admin balances collection
    //     const balances = await this.adminWalletsService.getAssetsBalances(
    //       address,
    //     );

    //     // Check if it has enough tx fee balance
    //     const insufficientBlances = [];
    //     const txFeeBalances: Array<HasEnoughFeeBalance> = [];
    //     const ethBalances = balances.filter(
    //       (balance) => balance.address === CHAIN_NATIVE_CURRENCY,
    //     );

    //     ethBalances.map(({ balance, chainId }) => {
    //       const hasEnoughTxFeeBalance = ethers.BigNumber.from(balance).gte(
    //         ethers.BigNumber.from(MIN_TX_FEE_BALANCE),
    //       );
    //       txFeeBalances.push({ hasEnoughTxFeeBalance, chainId });
    //       if (!hasEnoughTxFeeBalance) insufficientBlances.push(chainId);
    //     });

    //     // NOTE: this can be annoying if every ten min an email is sent or
    //     //       a seperate email is sent for each address/wallet
    //     if (insufficientBlances.length)
    //       Logger.warn(
    //         `Admin Wallet with "${address}" address has not enough tx fee balance for the ${insufficientBlances.join(
    //           ', ',
    //         )} chainId/s`,
    //         'AdminWalletsBalances',
    //       );

    //     await this.adminBalancesModel.create({
    //       address,
    //       txFeeBalances,
    //       balances,
    //     });
    //   }
    // } catch (err) {
    //   Logger.error(err, 'ADMIN_BALANCES_CREATION_ERROR');
    // }
  }
  
  async updateAdminBalances() {
    // try {
    //   // Get admin addresses
    //   const adminAddresses = this.adminWalletsService.getAdminAddresses();

    //   // Update balances
    //   for (let address of adminAddresses) {
    //     // Create admin balances collection
    //     const balances = await this.adminWalletsService.getAssetsBalances(
    //       address,
    //     );

    //     // Check if it has enough tx fee balance
    //     const insufficientBlances = [];
    //     const txFeeBalances: Array<HasEnoughFeeBalance> = [];
    //     const ethBalances = balances.filter(
    //       (balance) => balance.address === CHAIN_NATIVE_CURRENCY,
    //     );

    //     ethBalances.map(({ balance, chainId }) => {
    //       const hasEnoughTxFeeBalance = ethers.BigNumber.from(balance).gte(
    //         ethers.BigNumber.from(MIN_TX_FEE_BALANCE),
    //       );
    //       txFeeBalances.push({ hasEnoughTxFeeBalance, chainId });
    //       if (!hasEnoughTxFeeBalance) insufficientBlances.push(chainId);
    //     });

    //     // NOTE: this can be annoying if every ten min an email is sent or
    //     //       a seperate email is sent for each address/wallet
    //     if (insufficientBlances.length)
    //       Logger.warn(
    //         `Admin Wallet with "${address}" address has not enough tx fee balance for the ${insufficientBlances.join(
    //           ', ',
    //         )} chainId/s`,
    //         'AdminWalletsBalances',
    //       );

    //     await this.adminBalancesModel.updateOne(
    //       { address },
    //       { balances, txFeeBalances },
    //     );
    //   }
    // } catch (err) {
    //   Logger.error(err, 'ADMIN_BALNCES_UPDATE_ERROR');
    // }
  }

  async getAdminBalancesByAddress(address: string) {
    return await this.adminBalancesModel.findOne({ address });
  }

  async getAdminBalanceByAsset(assetName: string, chainId: number) {
    const upperCasedAssetName = assetName.toUpperCase();
    const balances = await this.adminBalancesModel.aggregate([
      {
        $match: {
          $and: [
            { 'balances.assetName': upperCasedAssetName },
            {
              txFeeBalances: {
                $elemMatch: { hasEnoughTxFeeBalance: true, chainId: chainId },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          address: 1,
          balances: {
            $filter: {
              input: '$balances',
              as: 'balance',
              cond: {
                $and: [{ $eq: ['$$balance.assetName', upperCasedAssetName] }],
              },
            },
          },
        },
      },
    ]);

    return balances.map((adminBalance) => {
      const { balance, assetName } = adminBalance.balances[0];
      const { address } = adminBalance;
      return { address, balance, assetName };
    });
  }
}
