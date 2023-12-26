import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NewBidDto } from 'src/dtos/newBid.dto';
import { UpdateBidDto } from 'src/dtos/updateBid.dto';
import { Bid, BidDocument } from 'src/models/bid.model';
import { Offer, OfferDocument } from 'src/models/offer.model';
import { User, UserDocument } from 'src/models/user.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import {
  BID_STATUS_ENUM,
  NOTIFICATION_TYPES_ENUM,
  OFFER_STATUS_ENUM,
} from 'src/utils/constants';
import { convertCurrencies } from 'src/utils/currencyConvHandler';
import { pushNotification } from 'src/utils/fcmHandler';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  getAllBids(userId: ObjectId) {
    const bids = this.bidModel.aggregate([
      { $match: { bidder: userId } },
      {
        $lookup: {
          from: 'offers',
          as: 'offer',
          let: { offerId: { $toObjectId: '$offer' } },
          pipeline: [{ $match: { $expr: { $eq: ['$$offerId', '$_id'] } } }],
        },
      },
      { $unwind: '$offer' },
      {
        $lookup: {
          from: 'users',
          as: 'offerIssuer',
          let: { issuer: { $toObjectId: '$offer.issuer' } },
          pipeline: [{ $match: { $expr: { $eq: ['$$issuer', '$_id'] } } }],
        },
      },
      { $unwind: '$offerIssuer' },
      {
        $set: {
          issuerName: {
            $concat: ['$offerIssuer.firstName', ' ', '$offerIssuer.lastName'],
          },
        },
      },
      { $project: { offerIssuer: 0, fcmRegTokens: 0 } },
    ]);

    return bids;
  }

  // Add new bid
  async addNewBid(newBid: NewBidDto, userId: ObjectId) {
    const bidder: User = await this.userModel.findOne({ _id: userId });
    const offer = await this.offerModel.findById(newBid.offer);

    if (!bidder)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.BAD_REQUEST);

    if (offer.issuer === userId)
      throw new HttpException(
        'Cannot bid on your own offer',
        HttpStatus.BAD_REQUEST,
      );

    if (offer.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Cannot bid on a ${offer.status.toLowerCase()} offer`,
        HttpStatus.BAD_REQUEST,
      );

    const issuer = await this.userModel.findById(offer.issuer);

    let response = {};
    let notificationData = {
      type: NOTIFICATION_TYPES_ENUM.BID_ADDED,
      targetUser: offer.issuer.toString(),
      isActionRequired: '',
      message: `New bid of ${newBid.pricePerUnit} is added to your offer for 
      ${offer.amount} ${offer.assetName} at ${offer.pricePerUnit} unit price`,
    };

    const addedBid = await this.bidModel.create({
      ...newBid,
      bidder: userId,
      // fcmRegTokens: [newBid.fcmRegTokens],
    });
    await this.offerModel.findByIdAndUpdate(newBid.offer, {
      $push: { bids: addedBid._id },
    });

    // Convert the currencies
    const converted = await convertCurrencies(
      newBid.currencyName,
      offer.currencyName,
      newBid.pricePerUnit,
    );

    // Check if bid is perfect match
    if (+offer.pricePerUnit <= converted) {
      const newTx = await this.transactionRepository.createTx(
        offer,
        addedBid,
        bidder,
      );
      response = { ...response, paymentUrl: newTx.sessionUrl };

      await this.offerModel.findByIdAndUpdate(offer._id, {
        winnerBid: addedBid._id,
        status: OFFER_STATUS_ENUM.MATCHED,
      });
      await addedBid.update({
        status: BID_STATUS_ENUM.MATCHED,
        acceptanceTx: newTx._id,
      });

      notificationData.message = `New bid of perfect match is added to your offer for 
      ${offer.amount} ${offer.assetName} at ${offer.pricePerUnit} unit price`;
    }

    // Send notification to seller
    await pushNotification({
      tokens: issuer.fcmRegTokens,
      notification: {
        title: 'New Bid',
        body: 'New bid added',
      },
      data: notificationData,
    });

    return { ...response, success: true };
  }

  // Update bid price
  async updateBidPrice(
    userId: ObjectId,
    bidId: ObjectId,
    update: UpdateBidDto,
  ) {
    const bid = await this.bidModel.findById(bidId);
    if (!bid) throw new HttpException('Bid not found', HttpStatus.BAD_REQUEST);

    if (bid.bidder != userId)
      throw new HttpException('User not authorized', HttpStatus.FORBIDDEN);

    const bidder = await this.userModel.findOne({ _id: bid.bidder });
    if (!bidder)
      throw new HttpException('Bidder not found', HttpStatus.BAD_REQUEST);

    const offer = await this.offerModel.findById(bid.offer);

    if (!offer)
      throw new HttpException('Offer not found', HttpStatus.BAD_REQUEST);

    if (offer.status !== OFFER_STATUS_ENUM.ACTIVE)
      throw new HttpException(
        `Oops offer is already ${offer.status.toLocaleLowerCase()}`,
        HttpStatus.CONFLICT,
      );

    await bid.updateOne(update);
    // Convert the currencies
    const converted = await convertCurrencies(
      bid.currencyName,
      offer.currencyName,
      update.pricePerUnit,
    );
    let response = {};

    // Check if bid is perfect match
    if (+offer.pricePerUnit <= converted) {
      const newTx = await this.transactionRepository.createTx(
        offer,
        bid,
        bidder,
      );
      response = { ...response, paymentUrl: newTx.sessionUrl };

      await bid.updateOne({
        status: BID_STATUS_ENUM.MATCHED,
        acceptanceTx: newTx._id,
      });
      await this.offerModel.findByIdAndUpdate(offer._id, {
        winnerBid: bid._id,
        status: OFFER_STATUS_ENUM.MATCHED,
      });
    }

    return { ...response, success: true };
  }

  // Cancel a bid
  async cancelBid(userId: ObjectId, bidId: ObjectId) {
    const bid = await this.bidModel.findByIdAndUpdate(bidId);
    if (!bid) throw new HttpException('Bid not found', HttpStatus.BAD_REQUEST);

    if (bid.bidder != userId)
      throw new HttpException('User not authorized', HttpStatus.FORBIDDEN);

    if (
      bid.status !== BID_STATUS_ENUM.ACTIVE &&
      bid.status !== BID_STATUS_ENUM.CANCELED
    )
      throw new HttpException(
        `Cannot cancel/reactivate a ${bid.status.toLowerCase()} bid`,
        HttpStatus.BAD_REQUEST,
      );

    const status =
      bid.status === BID_STATUS_ENUM.ACTIVE
        ? BID_STATUS_ENUM.CANCELED
        : BID_STATUS_ENUM.ACTIVE;

    await this.bidModel.findByIdAndUpdate(bidId, {
      status,
      acceptanceTx: null,
    });
    return 'success';
  }

  // Get bid details
  async getBidDetails(bidId: ObjectId, userId: ObjectId) {
    const bid = await this.bidModel.findById(bidId);
    if (!bid) throw new HttpException('Bid not found', HttpStatus.BAD_REQUEST);
    if (bid.bidder !== userId)
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

    return this.bidModel.find(bidId);
  }

  // Bid Syncing
  async getInSyncedBids(userId: ObjectId, fcmRegToken: string) {
    const inSyncedBids = await this.bidModel.find({
      bidder: userId,
      fcmRegTokens: { $ne: fcmRegToken },
    });

    return inSyncedBids;
  }

  async syncDevice(userId: ObjectId, fcmRegToken: string) {
    const SyncedBids = await this.bidModel.updateMany(
      {
        bidder: userId,
        fcmRegTokens: { $ne: fcmRegToken },
      },
      {
        $push: { fcmRegTokens: fcmRegToken },
      },
    );

    return { ...SyncedBids, success: true };
  }
}
