import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TxFee, TxFeeDocument } from 'src/models/txFees.model';
import { ChainServices, Web3Services } from 'src/services/web3.service';
import { TX_NAME_ENUM, TX_NAME_TO_AVG_GAS } from 'src/utils/constants';

@Injectable()
export class TxFeeRepository {
  constructor(
    @InjectModel(TxFee.name) private readonly txFeeModel: Model<TxFeeDocument>,
    private readonly web3Services: Web3Services,
    private readonly chainServices: ChainServices,
  ) {
    this.createTxFeePrice();
  }

  async getTxFeePrice(txName: string, chainId: number) {
    return await this.txFeeModel.findOne({ txName, chainId });
  }

  async createTxFeePrice() {
    // for (let txKey of Object.keys(TX_NAME_ENUM)) {
    //   const chainIdList = this.chainServices.getNetworksChainIDList();
    //   for (let chainId of chainIdList) {
    //     const txName = TX_NAME_ENUM[txKey];
    //     const avgGasAmount = TX_NAME_TO_AVG_GAS[txName];
    //     const { coingechoId } = this.chainServices.getNetwork(chainId);

    //     // check if the record already exit
    //     const txFee = await this.txFeeModel.findOne({ txName, chainId });
    //     if (txFee) continue;

    //     // get gas price
    //     const { gasFee, gasPriceInEth, gasPriceInUsd } =
    //       await this.web3Services.getTxFeeData(
    //         chainId,
    //         avgGasAmount,
    //         coingechoId,
    //       );

    //     // Create tx fee record
    //     await this.txFeeModel.create({
    //       chainId,
    //       txName,
    //       avgGasAmount,
    //       gasFee,
    //       gasPriceInEth,
    //       gasPriceInUsd,
    //     });
    //   }
    // }
  }

  async updateTxFeePrice() {
  //   for (let txKey of Object.keys(TX_NAME_ENUM)) {
  //     const chainIdList = this.chainServices.getNetworksChainIDList();
  //     for (let chainId of chainIdList) {
  //       const txName = TX_NAME_ENUM[txKey];
  //       const avgGasAmount = TX_NAME_TO_AVG_GAS[txName];
  //       const { coingechoId } = this.chainServices.getNetwork(chainId);

  //       // get gas price
  //       const { gasFee, gasPriceInEth, gasPriceInUsd } =
  //         await this.web3Services.getTxFeeData(
  //           chainId,
  //           avgGasAmount,
  //           coingechoId,
  //         );

  //       // Create tx fee record
  //       await this.txFeeModel.updateOne(
  //         { chainId, txName },
  //         {
  //           avgGasAmount,
  //           gasFee,
  //           gasPriceInEth,
  //           gasPriceInUsd,
  //         },
  //       );
  //     }
  //   }
  }
}
