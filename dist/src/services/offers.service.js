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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bid_model_1 = require("../models/bid.model");
const offer_model_1 = require("../models/offer.model");
const user_model_1 = require("../models/user.model");
const transaction_repository_1 = require("../repositories/transaction.repository");
const constants_1 = require("../utils/constants");
const fcmHandler_1 = require("../utils/fcmHandler");
const web3_service_1 = require("./web3.service");
const stripe_1 = __importDefault(require("stripe"));
const getAssetPrice_1 = require("../utils/getAssetPrice");
const currencyConvHandler_1 = require("../utils/currencyConvHandler");
let OffersService = class OffersService {
    constructor(userModel, offerModel, bidModel, transactionRepository, web3Services, chainServices) {
        this.userModel = userModel;
        this.offerModel = offerModel;
        this.bidModel = bidModel;
        this.transactionRepository = transactionRepository;
        this.web3Services = web3Services;
        this.chainServices = chainServices;
    }
    getAllOffers() {
        return this.offerModel.find();
    }
    async addNewOffer(newOffer, userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const { signedTx, amount, assetName, chainId, currencyName } = newOffer;
        if (!user.isVerified)
            throw new common_1.HttpException('User has not KYC', common_1.HttpStatus.BAD_REQUEST);
        if (!user.stripeAccountId)
            throw new common_1.HttpException('No bank account added', common_1.HttpStatus.BAD_REQUEST);
        if (!this.chainServices.isChainListed(chainId))
            throw new common_1.HttpException(`${chainId}, chain is not listed`, common_1.HttpStatus.BAD_REQUEST);
        if (!this.chainServices.isAssetListed(assetName))
            throw new common_1.HttpException(`${assetName}, asset is not listed`, common_1.HttpStatus.BAD_REQUEST);
        const { coingechoId } = this.chainServices.getAsset(chainId, assetName);
        const offerPricePerUnitInUsd = await (0, getAssetPrice_1.getAssetToUsd)(coingechoId);
        const pricePerUnit = currencyName.toUpperCase() === 'USD'
            ? offerPricePerUnitInUsd
            : await (0, currencyConvHandler_1.convertCurrencies)('usd', currencyName, offerPricePerUnitInUsd);
        const total = newOffer.amount * pricePerUnit;
        const totalPrice = total + total * constants_1.APP_FEE_PERCENTAGE;
        const appFee = constants_1.APP_FEE_PERCENTAGE * total;
        const status = constants_1.OFFER_STATUS_ENUM.ACTIVE;
        const issuer = userId;
    }
    async updateOffer(userId, offerId, update) {
        const offer = await this.offerModel.findById(offerId);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.NOT_FOUND);
        if (userId !== offer.issuer)
            throw new common_1.HttpException('Not authorized', common_1.HttpStatus.FORBIDDEN);
        if (offer.status !== constants_1.OFFER_STATUS_ENUM.ACTIVE)
            throw new common_1.HttpException(`Cannot update a ${offer.status.toLowerCase()} offer`, common_1.HttpStatus.BAD_REQUEST);
        const newTotal = +update.pricePerUnit * offer.amount;
        const totalPrice = newTotal + newTotal * constants_1.APP_FEE_PERCENTAGE;
        const appFee = newTotal * constants_1.APP_FEE_PERCENTAGE;
        return this.offerModel.findByIdAndUpdate(offerId, Object.assign(Object.assign({}, update), { totalPrice,
            appFee }));
    }
    async cancelOffer(userId, offerId) {
    }
    async getOfferDetails(offerId, userId) {
        const offer = await this.offerModel.findById(offerId);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.NOT_FOUND);
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
        return Object.assign(Object.assign({}, offer.toObject()), { offerBids });
    }
    async acceptABid(userId, bidId, offerId) {
        const offer = await this.offerModel.findById(offerId);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.NOT_FOUND);
        if (offer.status !== constants_1.OFFER_STATUS_ENUM.ACTIVE)
            throw new common_1.HttpException(`Cannot proceed with a ${offer.status.toLowerCase()} offer`, common_1.HttpStatus.BAD_REQUEST);
        if (!offer.bids.some((element) => element.toString() === bidId.toString()))
            throw new common_1.HttpException('Bid does not belong to this offer', common_1.HttpStatus.BAD_REQUEST);
        if (userId !== offer.issuer)
            throw new common_1.HttpException('Not authorized', common_1.HttpStatus.FORBIDDEN);
        const bid = await this.bidModel.findById(bidId);
        if (!bid)
            throw new common_1.HttpException('Bid not found', common_1.HttpStatus.NOT_FOUND);
        if (bid.status !== constants_1.OFFER_STATUS_ENUM.ACTIVE)
            throw new common_1.HttpException(`Cannot accept a ${bid.status.toLowerCase()} bid`, common_1.HttpStatus.BAD_REQUEST);
        const bidder = await this.userModel.findById(bid.bidder);
        if (!bidder)
            throw new common_1.HttpException('Bidder not found', common_1.HttpStatus.NOT_FOUND);
        let response = {};
        const newTx = await this.transactionRepository.createTx(offer, bid, bidder);
        response = Object.assign(Object.assign({}, response), { paymentUrl: newTx.sessionUrl });
        await this.offerModel.findByIdAndUpdate(offer._id, {
            status: constants_1.OFFER_STATUS_ENUM.MATCHED,
            winnerBid: bid._id,
        });
        await this.bidModel.findByIdAndUpdate(bid._id, {
            acceptanceTx: newTx._id,
            status: constants_1.BID_STATUS_ENUM.MATCHED,
        });
        const notification = {
            tokens: bidder.fcmRegTokens,
            notification: {
                title: 'Bid is Accepted',
                body: 'Please proceed with the payment.',
            },
            data: {
                type: constants_1.NOTIFICATION_TYPES_ENUM.BID_ACCEPTED,
                targetUser: bidder._id.toString(),
                isActionRequired: 'yes',
                link: newTx.sessionUrl,
                message: `Your bid for ${offer.amount} ${offer.assetName} at
        ${offer.pricePerUnit} price per unit is accepted.`,
            },
        };
        await (0, fcmHandler_1.pushNotification)(notification);
        return Object.assign(Object.assign({}, response), { success: true });
    }
    async cancelMatchedBid(userId, offerId) {
        const offer = await this.offerModel.findById(offerId);
        if (!offer)
            throw new common_1.HttpException('Offer not found', common_1.HttpStatus.NOT_FOUND);
        if (offer.status !== constants_1.OFFER_STATUS_ENUM.MATCHED)
            throw new common_1.HttpException(`Only matched offers can be cancelled`, common_1.HttpStatus.BAD_REQUEST);
        if (userId !== offer.issuer)
            throw new common_1.HttpException('Not authorized', common_1.HttpStatus.FORBIDDEN);
        if (!offer.winnerBid)
            throw new common_1.HttpException('No matched bid found', common_1.HttpStatus.AMBIGUOUS);
        const transaction = await this.transactionRepository.findOneTx({
            offerId: new mongoose_2.Types.ObjectId(offerId.toString()),
            bidId: new mongoose_2.Types.ObjectId(offer.winnerBid.toString()),
            $or: [
                { status: constants_1.TRANSACTION_STATUS_ENUM.PAYMENT_FAILED },
                { status: constants_1.TRANSACTION_STATUS_ENUM.PAYMENT_PENDING },
            ],
        });
        if (!transaction)
            throw new common_1.HttpException('No eligible transactions found related to the offer & matched bid', common_1.HttpStatus.CONFLICT);
        const timePassed = new Date().getTime() - transaction.updatedAt;
        if (timePassed <= constants_1.OFFER_CANCELLATION_LIMIT_TIME)
            throw new common_1.HttpException(`Cannot cancel an offer in ${Math.floor((constants_1.OFFER_CANCELLATION_LIMIT_TIME - timePassed) / 1000)} seconds`, common_1.HttpStatus.BAD_REQUEST);
        const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
            apiVersion: '2022-11-15',
        });
        const checkoutSession = await stripe.checkout.sessions.retrieve(transaction.sessionId);
        if (checkoutSession.status === 'open')
            await stripe.checkout.sessions.expire(transaction.sessionId);
        await transaction.updateOne({
            status: constants_1.TRANSACTION_STATUS_ENUM.OFFER_CANCELLED,
        });
        await this.bidModel.findByIdAndUpdate(offer.winnerBid, {
            status: constants_1.BID_STATUS_ENUM.ACTIVE,
            acceptanceTx: null,
        });
        await offer.updateOne({
            status: constants_1.OFFER_STATUS_ENUM.ACTIVE,
            winnerBid: null,
        });
    }
};
OffersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(offer_model_1.Offer.name)),
    __param(2, (0, mongoose_1.InjectModel)(bid_model_1.Bid.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        transaction_repository_1.TransactionRepository,
        web3_service_1.Web3Services,
        web3_service_1.ChainServices])
], OffersService);
exports.OffersService = OffersService;
//# sourceMappingURL=offers.service.js.map