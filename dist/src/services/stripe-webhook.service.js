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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeWebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookService = void 0;
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const stripe_1 = require("stripe");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../models/user.model");
const mongoose_2 = require("mongoose");
const StellarSdk = __importStar(require("stellar-sdk"));
let StripeWebhookService = StripeWebhookService_1 = class StripeWebhookService {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(StripeWebhookService_1.name);
        this.setupWebhook();
        StellarSdk.Network.useTestNetwork();
        this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        this.senderKeypair = StellarSdk.Keypair.fromSecret('SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ');
    }
    setupWebhook() {
        const stripe = new stripe_1.Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K', {
            apiVersion: '2020-08-27',
        });
        const app = (0, express_1.default)();
        const endpointSecret = 'whsec_75b73d751f3eef37cf2e8a4f01a74e2d2fbb70a6828ed949d4d382a46858d3cf';
        app.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (request, response) => {
            const sig = request.headers['stripe-signature'];
            let event;
            try {
                event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
                console.log("----------event----------,", event);
                console.log("-------------event---------", event);
            }
            catch (err) {
                this.logger.error(`Webhook Error: ${err.message}`);
                response.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
            switch (event.type) {
                case 'charge.succeeded':
                    console.log("-------------------event.type---------------", event.type);
                    const amount = event.data.object.amount_captured;
                    console.log("-------------------amount---------------", amount);
                    const formattedNumber = `${amount
                        .toString()
                        .slice(0, -2)}.${amount.toString().slice(-2)}`;
                    this.logger.log('Amount:', formattedNumber);
                    const currency = event.data.object.currency;
                    this.logger.log('Amount type:', currency);
                    const email = event.data.object.billing_details.email;
                    this.logger.log('Email:', email);
                    const emailExist = await this.userModel.findOne({ email: email });
                    if (emailExist === null) {
                        console.log("user not found");
                    }
                    else {
                        console.log(">>: ", emailExist);
                        console.log("++++++>", emailExist.public_key);
                        console.log("---------------------------------------------------");
                        this.sendPayment(emailExist.public_key);
                    }
                    break;
            }
            console.log("----------------response-----------------");
            response.send();
        });
        const port = 4242;
        app.listen(port, () => {
            this.logger.log(`Stripe Webhook is running on port ${port}`);
        });
    }
    async sendPayment(recipientPublicKey) {
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
                amount: '1',
            }))
                .setTimeout(30)
                .build();
            transaction.sign(this.senderKeypair);
            const transactionResult = await this.server.submitTransaction(transaction);
            console.log('Transaction Successful to: ', recipientPublicKey);
        }
        catch (error) {
            console.error('Error making payment:', error);
        }
    }
};
StripeWebhookService = StripeWebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StripeWebhookService);
exports.StripeWebhookService = StripeWebhookService;
//# sourceMappingURL=stripe-webhook.service.js.map