import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ContractTransactionListener implements OnModuleInit {
  private readonly logger = new Logger(ContractTransactionListener.name);
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private contractAddress = process.env.ETH_SMART_CONTRACT;

  private contractABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'EthReceived',
      type: 'event',
    },
  ];

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_WEBSOCKET);
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private listenToEvents() {
    this.logger.log('Listening for EthReceived events...');

    this.contract.on('EthReceived', (sender, amount, event) => {
      this.logger.log(`EthReceived Event:`);
      this.logger.log(`Sender: ${sender}`);
      this.logger.log(`Amount: ${ethers.formatUnits(amount, 'ether')} ETH`);
      this.logger.log(`Transaction Hash: ${event.transactionHash}`);
      this.logger.log('-----------------------------------');
    });
  }
}
