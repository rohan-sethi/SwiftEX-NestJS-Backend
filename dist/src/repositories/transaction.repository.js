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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_model_1 = require("../models/transaction.model");
const user_model_1 = require("../models/user.model");
const constants_1 = require("../utils/constants");
const currencyConvHandler_1 = require("../utils/currencyConvHandler");
const stripe_1 = require("stripe");
const txFees_repository_1 = require("./txFees.repository");
const web3_service_1 = require("../services/web3.service");
let TransactionRepository = class TransactionRepository {
    constructor(transactionModel, userModel, txFeeRepository, chainServices) {
        this.transactionModel = transactionModel;
        this.userModel = userModel;
        this.txFeeRepository = txFeeRepository;
        this.chainServices = chainServices;
    }
    async createTx(offer, bid, bidder) {
        const offerIssuer = await this.userModel.findById(offer.issuer);
        const { gasPriceInUsd } = await this.txFeeRepository.getTxFeePrice(this.chainServices.getAssetsTxName(offer.assetName), Number(offer.chainId));
        const transactionFee = await (0, currencyConvHandler_1.convertCurrencies)('usd', bid.currencyName, Number(gasPriceInUsd));
        const { totalPrice, appFee } = this.calculatePrice(bid.pricePerUnit * offer.amount);
        const stripe = new stripe_1.Stripe(process.env.STRIPE_API_SK, {
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
        const newTx = {
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
        const savedTx = await this.transactionModel.create(newTx);
        return savedTx;
    }
    async findTx(query) {
        return await this.transactionModel.find(query);
    }
    async findOneTx(query) {
        return await this.transactionModel.findOne(query);
    }
    async updateOneTx(query, update) {
        await this.transactionModel.updateOne(query, update);
        return await this.transactionModel.findOne(query);
    }
    calculatePrice(subTotal) {
        const totalPrice = subTotal + subTotal * constants_1.APP_FEE_PERCENTAGE;
        const appFee = subTotal * constants_1.APP_FEE_PERCENTAGE;
        return { totalPrice, appFee };
    }
};
TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_model_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        txFees_repository_1.TxFeeRepository,
        web3_service_1.ChainServices])
], TransactionRepository);
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map