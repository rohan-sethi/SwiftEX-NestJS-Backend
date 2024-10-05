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
exports.TransactionsService = void 0;
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
let TransactionsService = class TransactionsService {
    constructor(offerModel, bidModel, userModel, transactionRepository, web3Services) {
        this.offerModel = offerModel;
        this.bidModel = bidModel;
        this.userModel = userModel;
        this.transactionRepository = transactionRepository;
        this.web3Services = web3Services;
    }
    async getUserTansactions(userId) {
        return this.transactionRepository.findTx({
            $or: [{ customerId: userId }, { assetOwner: userId }],
        });
    }
    async getTxBySessionId(sessionId) {
        const tx = await this.transactionRepository.findOneTx({ sessionId });
        if (!tx)
            throw new common_1.HttpException('Transaction not found', common_1.HttpStatus.NOT_FOUND);
        return tx;
    }
    async completeTx(session) {
        const tx = await this.transactionRepository.findOneTx({
            sessionId: session.id,
        });
        if (!tx)
            throw new common_1.HttpException('Transaction not found', common_1.HttpStatus.NOT_FOUND);
        if (tx.status !== constants_1.TRANSACTION_STATUS_ENUM.PAYMENT_PENDING)
            return { message: 'Transaction Already Processed' };
        const offer = await this.offerModel.findById(tx.offerId);
        const bid = await this.bidModel.findById(tx.bidId);
        const bidder = await this.userModel.findById(bid.bidder);
        const issuer = await this.userModel.findById(offer.issuer);
        return { succes: true };
    }
    async updateFailedPaymentTx(session) {
        const tx = await this.transactionRepository.findOneTx({
            sessionId: session.id,
        });
        const issuer = await this.userModel.findById(tx.assetOwner);
        await this.transactionRepository.updateOneTx({ sessionId: session.id }, { status: constants_1.TRANSACTION_STATUS_ENUM.PAYMENT_FAILED });
        await this.offerModel.findByIdAndUpdate(tx.offerId, {
            status: constants_1.OFFER_STATUS_ENUM.ACTIVE,
        });
        (0, fcmHandler_1.pushNotification)({
            tokens: issuer.fcmRegTokens,
            notification: {
                title: 'Payment Failed',
                body: "Bidder's paymemnt failed for one of your offers",
            },
            data: {
                type: constants_1.NOTIFICATION_TYPES_ENUM.PAYMENT_FAILED,
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
            throw new common_1.HttpException('Account user not found', common_1.HttpStatus.EXPECTATION_FAILED);
        const { charges_enabled, payouts_enabled } = stripeAccount;
        if (payouts_enabled)
            await this.userModel.findOneAndUpdate({ stripeAccountId: stripeAccount.id }, { payoutsEnabled: payouts_enabled });
        if (charges_enabled)
            await this.userModel.findOneAndUpdate({ stripeAccountId: stripeAccount.id }, { chargesEnabled: charges_enabled });
        return { success: true };
    }
};
TransactionsService = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(offer_model_1.Offer.name)),
    __param(1, (0, mongoose_1.InjectModel)(bid_model_1.Bid.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        transaction_repository_1.TransactionRepository,
        web3_service_1.Web3Services])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map