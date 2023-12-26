import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Bid } from 'src/models/bid.model';
import { Offer, OfferDocument } from 'src/models/offer.model';
import { Transaction } from 'src/models/transaction.model';
import { User } from 'src/models/user.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import {
  BID_STATUS_ENUM,
  NOTIFICATION_TYPES_ENUM,
  OFFER_STATUS_ENUM,
  TRANSACTION_STATUS_ENUM,
} from 'src/utils/constants';
import { pushNotification } from 'src/utils/fcmHandler';
import { Web3Services } from './web3.service';
import Stripe from 'stripe';

export class TransactionsService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(Bid.name) private bidModel: Model<OfferDocument>,
    @InjectModel(User.name) private userModel: Model<OfferDocument>,
    private readonly transactionRepository: TransactionRepository,
    private readonly web3Services: Web3Services,
  ) {}

  async getUserTansactions(userId: ObjectId) {
    return this.transactionRepository.findTx({
      $or: [{ customerId: userId }, { assetOwner: userId }],
    });
  }

  async getTxBySessionId(sessionId) {
    const tx = await this.transactionRepository.findOneTx({ sessionId });
    if (!tx)
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);

    return tx;
  }

  async completeTx(session: Stripe.Checkout.Session) {
    const tx: Transaction = await this.transactionRepository.findOneTx({
      sessionId: session.id,
    });
    if (!tx)
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);

    // Avoid multiple webhook expendature
    if (tx.status !== TRANSACTION_STATUS_ENUM.PAYMENT_PENDING)
      return { message: 'Transaction Already Processed' };

    const offer: OfferDocument = await this.offerModel.findById(tx.offerId);
    const bid: Bid = await this.bidModel.findById(tx.bidId);
    const bidder: User = await this.userModel.findById(bid.bidder);
    const issuer: User = await this.userModel.findById(offer.issuer);

    this.web3Services
      .transfer(
        Number(offer.chainId),
        offer.assetName,
        bidder.walletAddress,
        offer.amount,
      )
      .then(async ({ err, sentTx }) => {
        // Transaction update
        if (err) {
          await offer.updateOne({ status: OFFER_STATUS_ENUM.TRANSFER_FAILED });
          await this.transactionRepository.updateOneTx(
            { sessionId: session.id },
            { status: TRANSACTION_STATUS_ENUM.TRANSFER_FAILED },
          );

          // Send notification to seller & buyer
          const notification = {
            title: 'Transfer Failed',
            body: 'Blockchain transaction failed',
          };

          pushNotification({
            tokens: bidder.fcmRegTokens,
            notification,
            data: {
              type: NOTIFICATION_TYPES_ENUM.TRANSFER_FAILED,
              targetUser: bidder._id.toString(),
              isActionRequired: 'yes',
              message: `Blockchain transaction execution failed with the following message:\n ${err}`,
              transactionHash: err.transactionHash || err.hash || '',
            },
          });

          pushNotification({
            tokens: issuer.fcmRegTokens,
            notification,
            data: {
              type: NOTIFICATION_TYPES_ENUM.TRANSFER_FAILED,
              targetUser: issuer._id.toString(),
              isActionRequired: 'yes',
              message: `Blockchain transaction execution failed with the following message:\n ${err}`,
              transactionHash: err.transactionHash || err.hash || '',
            },
          });

          return { message: 'Blockchain Transaction Failure' };
        }

        await this.transactionRepository.updateOneTx(
          { sessionId: session.id },
          {
            status: TRANSACTION_STATUS_ENUM.SUCCEEDED,
            cryptoTxHash: sentTx.hash,
          },
        );

        // Offer & Bid update
        await this.offerModel.findByIdAndUpdate(offer._id, {
          status: OFFER_STATUS_ENUM.FINALIZIED,
          winnerBid: bid._id,
        });

        await this.bidModel.findByIdAndUpdate(bid._id, {
          status: BID_STATUS_ENUM.FINALIZIED,
        });

        // Send notification to seller (offer issuer)
        const notificationData = {
          type: NOTIFICATION_TYPES_ENUM.OFFER_FINALIZED,
          targetUser: offer.issuer.toString(),
          message: `Congrates on making a sale on ${offer.amount} 
          ${offer.assetName} for ${bid.pricePerUnit} unit price!`,
          isActionRequired: '',
        };
        await pushNotification({
          tokens: issuer.fcmRegTokens,
          notification: {
            title: 'Offer Finalised',
            body: 'One of your offers is finalized',
          },
          data: notificationData,
        });
      });

    return { succes: true };
  }

  async updateFailedPaymentTx(session) {
    const tx: Transaction = await this.transactionRepository.findOneTx({
      sessionId: session.id,
    });
    const issuer: User = await this.userModel.findById(tx.assetOwner);

    // Update tx
    await this.transactionRepository.updateOneTx(
      { sessionId: session.id },
      { status: TRANSACTION_STATUS_ENUM.PAYMENT_FAILED },
    );

    // Update Offer
    await this.offerModel.findByIdAndUpdate(tx.offerId, {
      status: OFFER_STATUS_ENUM.ACTIVE,
    });

    pushNotification({
      tokens: issuer.fcmRegTokens,
      notification: {
        title: 'Payment Failed',
        body: "Bidder's paymemnt failed for one of your offers",
      },
      data: {
        type: NOTIFICATION_TYPES_ENUM.PAYMENT_FAILED,
        targetUser: issuer._id.toString(),
        isActionRequired: '',
        message: `Bidder's paymemnt failed for the offer of ${tx.amount} ${tx.assetName}. Your offer is now open for other incoming bids`,
        transactionHash: tx.cryptoTxHash,
      },
    });
  }

  async updateUserAccount(stripeAccount) {
    const user = await this.userModel.findOne({
      stripeAccountId: stripeAccount.id,
    });
    if (!user)
      throw new HttpException(
        'Account user not found',
        HttpStatus.EXPECTATION_FAILED,
      );

    const { charges_enabled, payouts_enabled } = stripeAccount;
    if (payouts_enabled)
      await this.userModel.findOneAndUpdate(
        { stripeAccountId: stripeAccount.id },
        { payoutsEnabled: payouts_enabled },
      );

    if (charges_enabled)
      await this.userModel.findOneAndUpdate(
        { stripeAccountId: stripeAccount.id },
        { chargesEnabled: charges_enabled },
      );

    return { success: true };
  }
}
