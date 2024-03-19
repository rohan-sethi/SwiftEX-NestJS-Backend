"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Payout_listion_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payout_listion = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../models/user.model");
const mongoose_2 = require("mongoose");
const Stellar = __importStar(require("stellar-sdk"));
let Payout_listion = Payout_listion_1 = class Payout_listion {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(Payout_listion_1.name);
        Stellar.Network.useTestNetwork();
    }
    onModuleInit() {
        this.listenForTransactions();
        this.listenForTransactionsXETH();
    }
    listenForTransactions() {
        const accountId = "GBCNZEEQXSVQ3O6DWJXAOVGUT3VRI2ZOU2JB4ZQC27SE3UU4BX7OZ5DN";
        const server = new Stellar.Server('https://horizon-testnet.stellar.org');
        const transactionStream = server.transactions()
            .forAccount(accountId)
            .cursor('now')
            .stream({
            onmessage: (transaction) => {
                this.logger.log('Transaction Received XUSD:<>');
                this.logger.log(transaction);
                this.logger.log(transaction.memo);
                this.logger.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                const a = transaction.memo;
                const dataBeforeHyphen = a.split("-")[0];
                const dataAfterHyphen = a.split("-")[1];
                this.check(dataBeforeHyphen, dataAfterHyphen);
            },
            onerror: (error) => {
                this.logger.error('Error in XUSD transaction stream :', error);
            },
        });
        this.logger.log(`Listening for XUSD...`);
    }
    async check(get_email, get_amount) {
        const phoneNumber = get_email;
        const emailExist = await this.userModel.findOne({ email: phoneNumber });
        if (emailExist === null) {
            console.log("user not found");
        }
        else {
            console.log(">>: ", emailExist);
            console.log("++++++>", emailExist.stripeAccountId);
            this.sendMoneyToBank(emailExist.stripeAccountId, get_amount, "inr");
        }
    }
    async sendMoneyToBank(receiverAccountId, amount, currency) {
        const stripe = require('stripe')('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K');
        try {
            const transfer = await stripe.transfers.create({
                amount,
                currency,
                destination: receiverAccountId,
            });
            console.log('Transfer successful:', transfer);
        }
        catch (error) {
            console.error('Error:', error.message);
        }
    }
    listenForTransactionsXETH() {
        const accountId = "GCW6DBA7KLB5HZEJEQ2F5F552SLQ66KZFKEPPIPI3OF7XNLIAGCP6JER";
        const server = new Stellar.Server('https://horizon-testnet.stellar.org');
        const transactionStream = server.transactions()
            .forAccount(accountId)
            .cursor('now')
            .stream({
            onmessage: (transaction) => {
                this.logger.log('Transaction Received for XETH:<>');
                this.logger.log(transaction);
                this.logger.log(transaction.memo);
                this.logger.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                const a = transaction.memo;
                const dataBeforeHyphen = a.split("-")[0];
                const dataAfterHyphen = a.split("-")[1];
                this.check_(dataBeforeHyphen, dataAfterHyphen);
            },
            onerror: (error) => {
                this.logger.error('Error in XETH transaction stream :', error);
            },
        });
        this.logger.log(`Listening for XETH...`);
    }
    async check_(get_email, get_amount) {
        const phoneNumber = get_email;
        const emailExist = await this.userModel.findOne({ email: phoneNumber });
        if (emailExist === null) {
            console.log("user not found");
        }
        else {
            console.log(">>: ", emailExist);
            console.log("++++++>", emailExist.stripeAccountId);
        }
    }
};
Payout_listion = Payout_listion_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], Payout_listion);
exports.Payout_listion = Payout_listion;
//# sourceMappingURL=Payout.service.js.map