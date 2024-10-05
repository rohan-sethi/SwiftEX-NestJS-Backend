import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AllbridgeCoreSdk, ChainSymbol } from "@allbridge/bridge-core-sdk";

@Injectable()
export class SwapService {
  private sdk: AllbridgeCoreSdk;
  constructor() {
    this.sdk = new AllbridgeCoreSdk({
      ETH: process.env.ETH_PROVIDER_NEW,
    });
  }
  async fetch_tokens(source_token: string, wallet_type: string) {
    try {
      const chains = await this.sdk.chainDetailsMap();
      if (wallet_type === "Ethereum") {
        const { tokens } = chains[ChainSymbol.ETH];
        const res_Token = tokens.find(token => token.symbol === source_token);
        return {
          result: res_Token,
          status_opt: true
        };
      }
      if (wallet_type === "BNB") {
        const { tokens } = chains[ChainSymbol.BSC];
        const res_Token = tokens.find(token => token.symbol === source_token);
        return {
          result: res_Token,
          status_opt: true
        };
      }
      if (wallet_type === "Stellar") {
        const { tokens } = chains[ChainSymbol.STLR];
        const res_Token = tokens.find(token => token.symbol === source_token);
        return {
          result: res_Token,
          status_opt: true
        };
      }
    } catch (error) {
      console.log("Error - fetch-tokens : ", error)
      return {
        result: error,
        status_opt: false
      };
    }
  }

  async swap_prepare(fromAddress: string, toAddress: string, amount: string, source_token: string, destination_token: string, wallet_type: string) {
    try {
      const sourceToken = await this.fetch_tokens(source_token, wallet_type);
      // const destinationToken = await this.fetch_tokens(destination_token, "Stellar");
        if (!(await this.sdk.bridge.checkAllowance({ token: sourceToken.result, owner: fromAddress, amount: amount }))) {
          const rawTransactionApprove = (await this.sdk.bridge.rawTxBuilder.approve({
            token: sourceToken.result,
            owner: fromAddress,
          }));
          return new HttpException({ res: rawTransactionApprove,status_swap:true }, HttpStatus.CREATED)
        }
        // // Initiate transfer
        // const rawTransactionTransfer = (await this.sdk.bridge.rawTxBuilder.send({
        //   amount: amount,
        //   fromAccountAddress: fromAddress,
        //   toAccountAddress: toAddress,
        //   sourceToken: sourceToken.result,
        //   destinationToken: destinationToken.result
        // }));
        // return new HttpException({ res: rawTransactionTransfer }, HttpStatus.OK)
    } catch (error) {
      console.error("Error in swap_prepare:", error);
      throw new HttpException({ res: error,status_swap:false }, HttpStatus.BAD_REQUEST)
    }
  }


  async swap_execute(fromAddress: string, toAddress: string, amount: string, source_token: string, destination_token: string, wallet_type: string) {
    try {
      const sourceToken = await this.fetch_tokens(source_token, wallet_type);
      const destinationToken = await this.fetch_tokens(destination_token, "Stellar");
      if (sourceToken.status_opt === true && destinationToken.status_opt === true) {
        // Initiate transfer token
        const rawTransactionTransfer = (await this.sdk.bridge.rawTxBuilder.send({
          amount: amount,
          fromAccountAddress: fromAddress,
          toAccountAddress: toAddress,
          sourceToken: sourceToken.result,
          destinationToken: destinationToken.result
        }));
        return new HttpException({ res: rawTransactionTransfer,status_swap:true }, HttpStatus.OK)
      }
      else{
        throw new HttpException({ res: "token not found:- ",status_swap:false }, HttpStatus.BAD_REQUEST)
      }
      
    } catch (error) {
      console.error("Error in swap_execution:", error);
      throw new HttpException({ res: error,status_swap:false }, HttpStatus.BAD_REQUEST)
    }
  }
}
