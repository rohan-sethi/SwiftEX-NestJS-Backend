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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../models/user.model");
const mongoose_2 = require("mongoose");
const StellarSdk = __importStar(require("stellar-sdk"));
let StripeWebhookService = class StripeWebhookService {
    constructor(userModel) {
        this.userModel = userModel;
        StellarSdk.Network.useTestNetwork();
        this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        this.senderKeypair = StellarSdk.Keypair.fromSecret('SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ');
    }
    async payment_link(id, amount, XUSD_amount) {
        const stripe = new stripe_1.Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K', {
            apiVersion: '2020-08-27',
        });
        console.log("-------", id, amount);
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "Asset",
                            },
                            unit_amount: amount,
                        },
                        quantity: 1,
                    }
                ],
                mode: "payment",
                success_url: `https://devapi.swiftexwallet.com/stripe-payment/${id}/${XUSD_amount}`,
                cancel_url: `https://devapi.swiftexwallet.com/cancel.html`,
            });
            return { url: session.url };
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async sendPayment(id, amount) {
        const emailExist = await this.userModel.findOne({ email: id });
        if (!emailExist) {
            console.log("user not found");
            throw new common_1.NotFoundException(`${id} is not listed`);
        }
        if (!emailExist.public_key) {
            console.log("Public_key not found");
            throw new common_1.NotFoundException(`Public_key is not listed`);
        }
        console.log(">>: ", emailExist);
        console.log("++++++>", emailExist.public_key);
        console.log("---------------------------------------------------");
        const recipientPublicKey = emailExist.public_key;
        try {
            const account = await this.server.loadAccount(this.senderKeypair.publicKey());
            const XETHAsset = new StellarSdk.Asset('XUSD', 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI');
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(StellarSdk.Operation.payment({
                destination: recipientPublicKey,
                asset: XETHAsset,
                amount: amount,
            }))
                .setTimeout(30)
                .build();
            transaction.sign(this.senderKeypair);
            const transactionResult = await this.server.submitTransaction(transaction);
            console.log('Transaction Successful to: ', recipientPublicKey);
        }
        catch (error) {
            console.error('Error making payment:', error);
            throw new common_1.NotFoundException(`Error making XUSD payment`, error);
        }
    }
    async find_user(amount, email) {
        console.log("-------------------amount---------------", amount);
        console.log('Email:', email);
        console.log("---------------------------------------------------");
        const emailExist = await this.userModel.findOne({ email: email });
        if (emailExist === null) {
            console.log("user not found");
        }
        else {
            console.log(">>: ", emailExist);
            console.log("++++++>", emailExist.public_key);
            console.log("---------------------------------------------------");
        }
    }
};
StripeWebhookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StripeWebhookService);
exports.StripeWebhookService = StripeWebhookService;
//# sourceMappingURL=stripe-webhook.service.js.map