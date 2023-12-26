import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from 'src/models/bid.model';
import { Offer } from 'src/models/offer.model';
import { Transaction, TransactionDocument } from 'src/models/transaction.model';
import { User, UserDocument } from 'src/models/user.model';
import { APP_FEE_PERCENTAGE } from 'src/utils/constants';
import { convertCurrencies } from 'src/utils/currencyConvHandler';
import { Stripe } from 'stripe';
import { TxFeeRepository } from './txFees.repository';
import { ChainServices } from 'src/services/web3.service';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly txFeeRepository: TxFeeRepository,
    private readonly chainServices: ChainServices,
  ) {}

  // Create transaction
  async createTx(offer: Offer, bid: Bid, bidder: User) {
    const offerIssuer: User = await this.userModel.findById(offer.issuer);

    const { gasPriceInUsd } = await this.txFeeRepository.getTxFeePrice(
      this.chainServices.getAssetsTxName(offer.assetName),
      Number(offer.chainId),
    );
    const transactionFee = await convertCurrencies(
      'usd',
      bid.currencyName,
      Number(gasPriceInUsd),
    );
    const { totalPrice, appFee } = this.calculatePrice(
      bid.pricePerUnit * offer.amount,
    );

    // create session
    const stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });

    const paymentSession = await stripe.checkout.sessions.create({
      cancel_url: process.env.STRIPE_PAYMENT_CANCEL_URL,
      mode: 'payment',
      success_url: process.env.STRIPE_PAYMENT_SUCCESS_URL,
      customer_email: bidder.email,
      line_items: [
        {
          price_data: {
            currency: bid.currencyName,
            product_data: {
              name: offer.assetName,
            },
            unit_amount: Math.floor((totalPrice + transactionFee / 2) * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.floor((appFee + transactionFee) * 100),
        on_behalf_of: offerIssuer.stripeAccountId,
        transfer_data: {
          destination: offerIssuer.stripeAccountId,
        },
      },
    });

    const { assetName, amount } = offer;
    const { pricePerUnit } = bid;
    const newTx: Transaction = {
      sessionId: paymentSession.id,
      sessionUrl: paymentSession.url,
      customerId: bid.bidder,
      offerId: offer._id,
      bidId: bid._id,
      assetName,
      pricePerUnit,
      amount,
      assetOwner: offer.issuer,
      totalPrice: totalPrice + transactionFee / 2,
      appFee,
      transactionFee,
      currency: bid.currencyName,
      chainId: offer.chainId,
    };

    // Create transaction
    const savedTx = await this.transactionModel.create(newTx);

    return savedTx;
  }

  // Find transaction
  async findTx(query) {
    return await this.transactionModel.find(query);
  }

  // Find one transaction
  async findOneTx(query) {
    return await this.transactionModel.findOne(query);
  }

  // Update one transaction
  async updateOneTx(query, update) {
    await this.transactionModel.updateOne(query, update);
    return await this.transactionModel.findOne(query);
  }

  private calculatePrice(subTotal: number) {
    const totalPrice = subTotal + subTotal * APP_FEE_PERCENTAGE;
    const appFee = subTotal * APP_FEE_PERCENTAGE;
    return { totalPrice, appFee };
  }
}
