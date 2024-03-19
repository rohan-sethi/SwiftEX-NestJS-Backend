"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bid_model_1 = require("../models/bid.model");
const offer_model_1 = require("../models/offer.model");
const user_model_1 = require("../models/user.model");
const transaction_repository_1 = require("../repositories/transaction.repository");
const constants_1 = require("../utils/constants");
const currencyConvHandler_1 = require("../utils/currencyConvHandler");
const fcmHandler_1 = require("../utils/fcmHandler");
let BidsService = class BidsService {
    constructor(userModel, bidModel, offerModel, transactionRepository) {
        this.userModel = userModel;
        this.bidModel = bidModel;
        this.offerModel = offerModel;
        this.transactionRepository = transactionRepository;
    }
    getAllBids(userId) {
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
    async addNewBid(newBid, userId) {
        const bidder = await this.userModel.findOne({ _id: userId });
        const offer = await this.offerModel.findById(newBid.offer);
        if (!bidder)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.BAD_REQUEST);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.BAD_REQUEST);
        if (offer.issuer === userId)
            throw new common_1.HttpException('Cannot bid on your own offer', common_1.HttpStatus.BAD_REQUEST);
        if (offer.status !== constants_1.OFFER_STATUS_ENUM.ACTIVE)
            throw new common_1.HttpException(`Cannot bid on a ${offer.status.toLowerCase()} offer`, common_1.HttpStatus.BAD_REQUEST);
        const issuer = await this.userModel.findById(offer.issuer);
        let response = {};
        let notificationData = {
            type: constants_1.NOTIFICATION_TYPES_ENUM.BID_ADDED,
            targetUser: offer.issuer.toString(),
            isActionRequired: '',
            message: `New bid of ${newBid.pricePerUnit} is added to your offer for 
      ${offer.amount} ${offer.assetName} at ${offer.pricePerUnit} unit price`,
        };
        const addedBid = await this.bidModel.create(Object.assign(Object.assign({}, newBid), { bidder: userId }));
        await this.offerModel.findByIdAndUpdate(newBid.offer, {
            $push: { bids: addedBid._id },
        });
        const converted = await (0, currencyConvHandler_1.convertCurrencies)(newBid.currencyName, offer.currencyName, newBid.pricePerUnit);
        if (+offer.pricePerUnit <= converted) {
            const newTx = await this.transactionRepository.createTx(offer, addedBid, bidder);
            response = Object.assign(Object.assign({}, response), { paymentUrl: newTx.sessionUrl });
            await this.offerModel.findByIdAndUpdate(offer._id, {
                winnerBid: addedBid._id,
                status: constants_1.OFFER_STATUS_ENUM.MATCHED,
            });
            await addedBid.update({
                status: constants_1.BID_STATUS_ENUM.MATCHED,
                acceptanceTx: newTx._id,
            });
            notificationData.message = `New bid of perfect match is added to your offer for 
      ${offer.amount} ${offer.assetName} at ${offer.pricePerUnit} unit price`;
        }
        await (0, fcmHandler_1.pushNotification)({
            tokens: issuer.fcmRegTokens,
            notification: {
                title: 'New Bid',
                body: 'New bid added',
            },
            data: notificationData,
        });
        return Object.assign(Object.assign({}, response), { success: true });
    }
    async updateBidPrice(userId, bidId, update) {
        const bid = await this.bidModel.findById(bidId);
        if (!bid)
            throw new common_1.HttpException('Bid not found', common_1.HttpStatus.BAD_REQUEST);
        if (bid.bidder != userId)
            throw new common_1.HttpException('User not authorized', common_1.HttpStatus.FORBIDDEN);
        const bidder = await this.userModel.findOne({ _id: bid.bidder });
        if (!bidder)
            throw new common_1.HttpException('Bidder not found', common_1.HttpStatus.BAD_REQUEST);
        const offer = await this.offerModel.findById(bid.offer);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.BAD_REQUEST);
        if (offer.status !== constants_1.OFFER_STATUS_ENUM.ACTIVE)
            throw new common_1.HttpException(`Oops offer is already ${offer.status.toLocaleLowerCase()}`, common_1.HttpStatus.CONFLICT);
        await bid.updateOne(update);
        const converted = await (0, currencyConvHandler_1.convertCurrencies)(bid.currencyName, offer.currencyName, update.pricePerUnit);
        let response = {};
        if (+offer.pricePerUnit <= converted) {
            const newTx = await this.transactionRepository.createTx(offer, bid, bidder);
            response = Object.assign(Object.assign({}, response), { paymentUrl: newTx.sessionUrl });
            await bid.updateOne({
                status: constants_1.BID_STATUS_ENUM.MATCHED,
                acceptanceTx: newTx._id,
            });
            await this.offerModel.findByIdAndUpdate(offer._id, {
                winnerBid: bid._id,
                status: constants_1.OFFER_STATUS_ENUM.MATCHED,
            });
        }
        return Object.assign(Object.assign({}, response), { success: true });
    }
    async cancelBid(userId, bidId) {
        const bid = await this.bidModel.findByIdAndUpdate(bidId);
        if (!bid)
            throw new common_1.HttpException('Bid not found', common_1.HttpStatus.BAD_REQUEST);
        if (bid.bidder != userId)
            throw new common_1.HttpException('User not authorized', common_1.HttpStatus.FORBIDDEN);
        if (bid.status !== constants_1.BID_STATUS_ENUM.ACTIVE &&
            bid.status !== constants_1.BID_STATUS_ENUM.CANCELED)
            throw new common_1.HttpException(`Cannot cancel/reactivate a ${bid.status.toLowerCase()} bid`, common_1.HttpStatus.BAD_REQUEST);
        const status = bid.status === constants_1.BID_STATUS_ENUM.ACTIVE
            ? constants_1.BID_STATUS_ENUM.CANCELED
            : constants_1.BID_STATUS_ENUM.ACTIVE;
        await this.bidModel.findByIdAndUpdate(bidId, {
            status,
            acceptanceTx: null,
        });
        return 'success';
    }
    async getBidDetails(bidId, userId) {
        const bid = await this.bidModel.findById(bidId);
        if (!bid)
            throw new common_1.HttpException('Bid not found', common_1.HttpStatus.BAD_REQUEST);
        if (bid.bidder !== userId)
            throw new common_1.HttpException('Not authorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.bidModel.find(bidId);
    }
    async getInSyncedBids(userId, fcmRegToken) {
        const inSyncedBids = await this.bidModel.find({
            bidder: userId,
            fcmRegTokens: { $ne: fcmRegToken },
        });
        return inSyncedBids;
    }
    async syncDevice(userId, fcmRegToken) {
        const SyncedBids = await this.bidModel.updateMany({
            bidder: userId,
            fcmRegTokens: { $ne: fcmRegToken },
        }, {
            $push: { fcmRegTokens: fcmRegToken },
        });
        return Object.assign(Object.assign({}, SyncedBids), { success: true });
    }
};
BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(bid_model_1.Bid.name)),
    __param(2, (0, mongoose_1.InjectModel)(offer_model_1.Offer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        transaction_repository_1.TransactionRepository])
], BidsService);
exports.BidsService = BidsService;
//# sourceMappingURL=bids.service.js.map