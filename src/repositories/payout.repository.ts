import { HttpException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PayoutRepository {
  stripe: Stripe;
  PAYOUT_ERROR: string = 'PAYOUT_ERROR';
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });
  }

  async createPayout(stripeAccountId) {
    try {
      const { available = null } = await this.stripe.balance.retrieve({
        stripeAccount: stripeAccountId,
      });

      if (!available)
        throw new Error(
          `couldn't get external account balance of the accountId: ${stripeAccountId}`,
        );

      for (let balance of available) {
        const { amount, currency } = balance;

        await this.stripe.payouts.create({
          amount,
          currency,
          source_type: 'bank_account',
          destination: stripeAccountId,
        });
      }
    } catch (err) {
      console.error(`${this.PAYOUT_ERROR}: ${err}`);
      return { err };
    }
  }

  getPayout() {}
  getAccountPayouts(
    stripeAccount: string,
    stripePaginationParams: Stripe.PaginationParams,
  ): Stripe.ApiListPromise<Stripe.Payout> {
    return this.stripe.payouts.list(stripePaginationParams, { stripeAccount });
  }
}
