import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as Stellar from 'stellar-sdk';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationService } from '../notification/service/notification.service';

dotenv.config();

@Injectable()
export class ContractTransactionListener implements OnModuleInit {
  private readonly logger = new Logger(ContractTransactionListener.name);
  private provider: ethers.WebSocketProvider;
  private contract: ethers.Contract;
  private contractAddress = process.env.ETH_SMART_CONTRACT;
  private readonly StellarRpc = process.env.RPC_STELLAR;
  private server: Stellar.Server;
  

  private contractABI = [
     "event Transfer(address indexed from, address indexed to, uint256 value)"
  ]

  constructor( @InjectModel(User.name) private userModel: Model<User>,
  private readonly notificationService: NotificationService,
) {
    this.provider = new ethers.WebSocketProvider(process.env.ALCHEMY_PROVIDER_WEBSOCKET);
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
    this.server = new Stellar.Server(this.StellarRpc);
    Stellar.Network.useTestNetwork();
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private listenToEvents() {
    this.logger.log('Listening for EthReceived events...');

    this.contract.on('Transfer', (from, to, value, event) => {
      this.logger.log(`EthReceived Event:`);
      this.logger.log(`Sender: ${from}`);
      this.logger.log(`Amount: ${ethers.formatUnits(value, 6)} USDT} USDT`);
      this.logger.log('-----------------------------------');
      this.findUserByWallet(from,ethers.formatUnits(value, 6));

    });
  }

  async findUserByWallet(sender: string,amount: string): Promise<any> {
    const user = await this.userModel.findOne({ walletAddress: sender });
    if (!user) {
      this.logger.log(`User with wallet address not found`);
    }
    else{
      this.sendXLM(user.public_key,amount)
      .then(async()=>{
        await this.notificationService.sendNotification(
          user.fcmRegTokens[0],
          'Cross Chain',
          `Congratulations! ${amount} USDC has been successfully added to your wallet.`
        );
      })
      .catch((error)=>{
        console.log("--->",error)
      })
    }
  }
  async sendXLM(destinationPublic: string, amount: string): Promise<any> {
      const sourceSecretKey = process.env.STELLAR_ONETAP_KEY
      const sourceKeypair = Stellar.Keypair.fromSecret(sourceSecretKey);
  
  
      const res = this.server.loadAccount(sourceKeypair.publicKey())
        .then(account => {
          const newAsset = new Stellar.Asset('USDC', process.env.STELLAR_ONETAP_ISSUER);
          const transaction = new Stellar.TransactionBuilder(account, {
            fee: Stellar.BASE_FEE,
            networkPassphrase: Stellar.Networks.TESTNET
          })
            .addOperation(Stellar.Operation.payment({
              destination: destinationPublic,
              asset: newAsset,
              amount: amount,
            }))
            .setTimeout(30)
            .build();
  
          transaction.sign(sourceKeypair);
  
          const res = this.server.submitTransaction(transaction);
        })
        .then(result => {
          this.logger.log('Success! Result:');
          return { success: true, message: "Sended successfully"};
        })
        .catch(error => {
          this.logger.log('Error in sending funds:', error);
          return { success: false, message: "Error in sending funds" };
        });
   
  }
}
