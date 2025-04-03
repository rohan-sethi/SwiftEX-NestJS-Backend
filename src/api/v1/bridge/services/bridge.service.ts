import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AllbridgeCoreSdk, ChainSymbol, Messenger } from "@allbridge/bridge-core-sdk";

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
        const tokens={"symbol":"USDC","poolAddress":"CAOTMWRKNMV5GWSVOMWCTCM5ZZFEQFUSWNLCZXA2KAXD4YG5A4DIPNFT","tokenAddress":"CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75","decimals":7,"name":"USDC","originTokenAddress":"USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN","feeShare":"0.0015","apr":"0.00539366263763284889","apr7d":"0.00539366263763284889","apr30d":"0.01920902464693611048","lpRate":"0.49916956736366436919","chainSymbol":"SRB","chainType":"SRB","allbridgeChainId":7,"bridgeAddress":"CBQ6GW7QCFFE252QEVENUNG45KYHHBRO4IZIWFJOXEFANHPQUXX5NFWV","transferTime":{"ETH":{"1":420000,"2":null,"3":null},"BSC":{"1":120000,"2":null,"3":null},"POL":{"1":120000,"2":null,"3":null},"ARB":{"1":120000,"2":null,"3":null},"AVA":{"1":180000,"2":null,"3":null},"OPT":{"1":180000,"2":null,"3":null},"BAS":{"1":120000,"2":null,"3":null},"CEL":{"1":120000,"2":null,"3":null},"TRX":{"1":120000,"2":null,"3":null},"SOL":{"1":180000,"2":null,"3":null},"SUI":{"1":600000,"2":null,"3":null}},"txCostAmount":{"swap":"15000000","transfer":"5000000","maxAmount":"30000000"},"confirmations":10,"chainName":"Stellar"}
        // const { tokens } = chains[ChainSymbol.SRB];
        // const res_Token = tokens.find(token => token.symbol === source_token);
        return {
          result: tokens,
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

      const destinationToken = await this.fetch_tokens(destination_token, "Stellar");
      
        if (!(await this.sdk.bridge.checkAllowance({ token: sourceToken.result, owner: fromAddress, amount: amount }))) {
          const rawTransactionApprove = (await this.sdk.bridge.rawTxBuilder.approve({
            token: sourceToken.result,
            owner: fromAddress,
          }));
          console.log("rawTransactionApprove",rawTransactionApprove)
          return new HttpException({ res: rawTransactionApprove,status_swap:true }, HttpStatus.CREATED)
        }
        // Initiate transfer
        const rawTransactionTransfer = (await this.sdk.bridge.rawTxBuilder.send({
          amount: amount,
          fromAccountAddress: fromAddress,
          toAccountAddress: toAddress,
          sourceToken: sourceToken.result,
          destinationToken: destinationToken.result,
          messenger: Messenger.ALLBRIDGE,
        }));
        return new HttpException({ res: rawTransactionTransfer }, HttpStatus.OK)
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
          destinationToken: destinationToken.result,
          messenger: Messenger.ALLBRIDGE,
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

