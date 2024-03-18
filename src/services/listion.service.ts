import { Injectable,Logger } from '@nestjs/common';
import axios from 'axios';
import Stellar from 'stellar-sdk';

@Injectable()
export class ListionService {
  private readonly logger = new Logger(ListionService.name);
  constructor() {
    Stellar.Network.useTestNetwork();
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getCurrentPrice(): Promise<number> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'stellar',
          vs_currencies: 'usd',
        },
      });

      return response.data.stellar.usd;
    } catch (error) {
      throw new Error(`Error fetching XLM price: ${error.message}`);
    }
  }

  listenForTransactions() {
    const accountId="GBCNZEEQXSVQ3O6DWJXAOVGUT3VRI2ZOU2JB4ZQC27SE3UU4BX7OZ5DN";
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const transactionStream = server.transactions()
      .forAccount(accountId)
      .cursor('now')
      .stream({
        onmessage: (transaction) => {
          this.logger.log('Transaction Received:<>');
          this.logger.log(transaction);
          this.logger.log(transaction.memo);
        },
        onerror: (error) => {
          this.logger.error('Error in transaction stream:', error);
        },
      });

    this.logger.log(`Listening for transactions on account ${accountId}...`);
  }
}
