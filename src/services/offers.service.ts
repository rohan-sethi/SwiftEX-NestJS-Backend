import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { NewOfferDto } from 'src/dtos/newOffer.dto';
import { OfferUpdateDto } from 'src/dtos/offerUpdate.dto';
import { Bid, BidDocument } from 'src/models/bid.model';
import { Offer, OfferDocument } from 'src/models/offer.model';
import { User, UserDocument } from 'src/models/user.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import {
  APP_FEE_PERCENTAGE,
  BID_STATUS_ENUM,
  NOTIFICATION_TYPES_ENUM,
  OFFER_CANCELLATION_LIMIT_TIME,
  OFFER_STATUS_ENUM,
  TRANSACTION_STATUS_ENUM,
} from 'src/utils/constants';
import { pushNotification } from 'src/utils/fcmHandler';
import { ChainServices, Web3Services } from './web3.service';
import Stripe from 'stripe';
import { getAssetToUsd } from 'src/utils/getAssetPrice';
import { convertCurrencies } from 'src/utils/currencyConvHandler';
// import { submitSignedTx, transfer, verifyTransfer } from 'src/utils/web3';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    private readonly transactionRepository: TransactionRepository,
    private readonly web3Services: Web3Services,
    private readonly chainServices: ChainServices,
  ) {}

  getAllOffers() {
    return this.offerModel.find();
  }

  // Add offer
  async addNewOffer(newOffer: NewOfferDto, userId: ObjectId) {
    // Validate Incoming data
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { signedTx, amount, assetName, chainId, currencyName } = newOffer;

    if (!user.isVerified)
      throw new HttpException('User has not KYC', HttpStatus.BAD_REQUEST);

    if (!user.stripeAccountId)
      throw new HttpException('No bank account added', HttpStatus.BAD_REQUEST);

    if (!this.chainServices.isChainListed(chainId))
      throw new HttpException(
        `${chainId}, chain is not listed`,
        HttpStatus.BAD_REQUEST,
      );

    if (!this.chainServices.isAssetListed(assetName))
      throw new HttpException(
        `${assetName}, asset is not listed`,
        HttpStatus.BAD_REQUEST,
      );

    // Construct offer data
    const { coingechoId } = this.chainServices.getAsset(chainId, assetName);
    const offerPricePerUnitInUsd = await getAssetToUsd(coingechoId);
    const pricePerUnit =
      currencyName.toUpperCase() === 'USD'
        ? offerPricePerUnitInUsd
        : await convertCurrencies('usd', currencyName, offerPricePerUnitInUsd);

    const total = newOffer.amount * pricePerUnit;
    const totalPrice = total + total * APP_FEE_PERCENTAGE;
    const appFee = APP_FEE_PERCENTAGE * total;
    const status = OFFER_STATUS_ENUM.ACTIVE;
    const issuer = userId;

    // Process blockchain transaction
    const isVerified = await this.web3Services.verifyTransfer(
      chainId,
      signedTx,
      assetName,
      amount,
    );
    if (!isVerified)
      throw new HttpException('Invalid transaction', HttpStatus.BAD_REQUEST);

    const { err, sentTx } = await this.web3Services.submitSignedTx(
      chainId,
      signedTx,
    );
    if (err) throw new HttpException(err.message, HttpStatus.NOT_IMPLEMENTED);

    delete newOffer.signedTx;
    const chainName = this.chainServices.getNetwork(chainId).name;

    // Add offer
    return this.offerModel.create({
      ...newOffer,
      totalPrice,
      status,
      issuer,
      appFee,
      blockchainTxHash: sentTx.transactionHash,
      chainName,
      pricePerUnit,
    });
  }

  // Update offer
  async updateOffer(
    userId: ObjectId,
    offerId: ObjectId,
    update: OfferUpdateDto,
  ) {
    const offer = await this.offerModel.findById(offerId);
    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);

    if (userId !== offer.issuer)
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);

    if (offer.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Cannot update a ${offer.status.toLowerCase()} offer`,
        HttpStatus.BAD_REQUEST,
      );

    const newTotal = +update.pricePerUnit * offer.amount;
    const totalPrice = newTotal + newTotal * APP_FEE_PERCENTAGE;
    const appFee = newTotal * APP_FEE_PERCENTAGE;

    //Todo: find exact matching bids

    return this.offerModel.findByIdAndUpdate(offerId, {
      ...update,
      totalPrice,
      appFee,
    });
  }

  // Cancel an offer
  async cancelOffer(userId: ObjectId, offerId: ObjectId) {
    const offer = await this.offerModel.findById(offerId);
    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);

    if (userId !== offer.issuer)
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);

    if (offer.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Cannot cancel a ${offer.status.toLowerCase()} offer`,
        HttpStatus.BAD_REQUEST,
      );

    const issuer: User = await this.userModel.findOne({ _id: offer.issuer });
    if (!issuer)
      throw new HttpException('Issuer not found', HttpStatus.NOT_FOUND);

    this.offerModel.findByIdAndUpdate(offerId, {
      status: OFFER_STATUS_ENUM.CANCELED,
    });

    // Add blockchain transaction here
    const { err, sentTx } = await this.web3Services.transfer(
      Number(offer.chainId),
      offer.assetName,
      issuer.walletAddress,
      offer.amount,
    );

    if (err)
      throw new HttpException(err.message, HttpStatus.NOT_IMPLEMENTED);

    return { sentTx };
  }

  // Get offer details
  async getOfferDetails(offerId: ObjectId, userId: ObjectId) {
    const offer = await this.offerModel.findById(offerId);
    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);

    // const offerBids = await this.bidModel.find({ offer: offer._id.toString() });

    const offerBids = await this.bidModel.aggregate([
      { $match: { offer: offer._id.toString() } },
      {
        $lookup: {
          from: 'users',
          as: 'user',
          let: { bidder: { $toObjectId: '$bidder' } },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$$bidder', '$_id'] } },
            },
          ],
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          pricePerUnit: 1,
          status: 1,
          bidder: 1,
          'user.firstName': 1,
          'user.lastName': 1,
        },
      },
    ]);

    return { ...offer.toObject(), offerBids };
  }

  // Accept a bid
  async acceptABid(userId: ObjectId, bidId: ObjectId, offerId: ObjectId) {
    const offer: Offer = await this.offerModel.findById(offerId);
    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);

    if (offer.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Cannot proceed with a ${offer.status.toLowerCase()} offer`,
        HttpStatus.BAD_REQUEST,
      );

    if (!offer.bids.some((element) => element.toString() === bidId.toString()))
      throw new HttpException(
        'Bid does not belong to this offer',
        HttpStatus.BAD_REQUEST,
      );

    if (userId !== offer.issuer)
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);

    const bid: Bid = await this.bidModel.findById(bidId);
    if (!bid) throw new HttpException('Bid not found', HttpStatus.NOT_FOUND);

    if (bid.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Cannot accept a ${bid.status.toLowerCase()} bid`,
        HttpStatus.BAD_REQUEST,
      );

    // Automated blockchain transaction
    const bidder: User = await this.userModel.findById(bid.bidder);
    if (!bidder)
      throw new HttpException('Bidder not found', HttpStatus.NOT_FOUND);

    let response = {};

    const newTx = await this.transactionRepository.createTx(offer, bid, bidder);
    response = { ...response, paymentUrl: newTx.sessionUrl };

    await this.offerModel.findByIdAndUpdate(offer._id, {
      status: OFFER_STATUS_ENUM.MATCHED,
      winnerBid: bid._id,
    });

    await this.bidModel.findByIdAndUpdate(bid._id, {
      acceptanceTx: newTx._id,
      status: BID_STATUS_ENUM.MATCHED,
    });

    // Push Notification
    const notification = {
      tokens: bidder.fcmRegTokens,
      notification: {
        title: 'Bid is Accepted',
        body: 'Please proceed with the payment.',
      },
      data: {
        type: NOTIFICATION_TYPES_ENUM.BID_ACCEPTED,
        targetUser: bidder._id.toString(),
        isActionRequired: 'yes',
        link: newTx.sessionUrl,
        message: `Your bid for ${offer.amount} ${offer.assetName} at
        ${offer.pricePerUnit} price per unit is accepted.`,
      },
    };
    await pushNotification(notification);

    return { ...response, success: true };
  }

  //
  async cancelMatchedBid(userId: ObjectId, offerId: ObjectId) {
    const offer: OfferDocument = await this.offerModel.findById(offerId);
    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);

    if (offer.status !== OFFER_STATUS_ENUM.MATCHED)
      throw new HttpException(
        `Only matched offers can be cancelled`,
        HttpStatus.BAD_REQUEST,
      );

    if (userId !== offer.issuer)
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);

    if (!offer.winnerBid)
      throw new HttpException('No matched bid found', HttpStatus.AMBIGUOUS);

    // Get the related transaction
    const transaction = await this.transactionRepository.findOneTx({
      offerId: new Types.ObjectId(offerId.toString()),
      bidId: new Types.ObjectId(offer.winnerBid.toString()),
      $or: [
        { status: TRANSACTION_STATUS_ENUM.PAYMENT_FAILED },
        { status: TRANSACTION_STATUS_ENUM.PAYMENT_PENDING },
      ],
    });
    if (!transaction)
      throw new HttpException(
        'No eligible transactions found related to the offer & matched bid',
        HttpStatus.CONFLICT,
      );

    const timePassed = new Date().getTime() - transaction.updatedAt;

    if (timePassed <= OFFER_CANCELLATION_LIMIT_TIME)
      throw new HttpException(
        `Cannot cancel an offer in ${Math.floor(
          (OFFER_CANCELLATION_LIMIT_TIME - timePassed) / 1000,
        )} seconds`,
        HttpStatus.BAD_REQUEST,
      );

    const stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      transaction.sessionId,
    );

    if (checkoutSession.status === 'open')
      await stripe.checkout.sessions.expire(transaction.sessionId);

    await transaction.updateOne({
      status: TRANSACTION_STATUS_ENUM.OFFER_CANCELLED,
    });

    await this.bidModel.findByIdAndUpdate(offer.winnerBid, {
      status: BID_STATUS_ENUM.ACTIVE,
      acceptanceTx: null,
    });

    await offer.updateOne({
      status: OFFER_STATUS_ENUM.ACTIVE,
      winnerBid: null,
    });
  }
}
