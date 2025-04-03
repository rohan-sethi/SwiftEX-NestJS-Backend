import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AllbridgeCoreSdk, ChainSymbol, Messenger } from '@allbridge/bridge-core-sdk';
import { ethers } from 'ethers';

@Injectable()
export class BridgeUtils {
  private readonly ETHRPC = process.env.ETH_PROVIDER_NEW;

  async getSwapDetails(amount: string,chainType:string) {
    try {
      const sdk = new AllbridgeCoreSdk({ ETH: this.ETHRPC });
      const chains = await sdk.chainDetailsMap();
      if (chainType !== "ETH" && chainType !== "BSC") {
        throw new HttpException('Wrong Chain', HttpStatus.BAD_REQUEST);
      }     
      const sourceChain = chainType=="ETH"?chains[ChainSymbol.ETH]:chains[ChainSymbol.BSC]
      const destinationChain = chains[ChainSymbol.SRB];

      if (!sourceChain || !destinationChain) {
        throw new HttpException('Chain details not found', HttpStatus.BAD_REQUEST);
      }

      const sourceToken = sourceChain.tokens.find(token => token.symbol === 'USDT');
      const destinationToken = destinationChain.tokens.find(token => token.symbol === 'USDC');

      if (!sourceToken || !destinationToken) {
        throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);
      }

      // Get minimum amount after bridge swap
      const minimumReceiveAmount = await sdk.getAmountToBeReceived(
        amount,
        sourceToken,
        destinationToken,
        Messenger.ALLBRIDGE,
      );

      // Calculate conversion rate
      const conversionRate = (parseFloat(minimumReceiveAmount) / parseFloat(amount)).toFixed(12);

      // Set slippage tolerance (default 1%)
      const slippageTolerance = "1";
      const result= {
        conversionRate,
        minimumAmountOut: minimumReceiveAmount,
        slippageTolerance,
      };
      return new HttpException(result,HttpStatus.OK)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
