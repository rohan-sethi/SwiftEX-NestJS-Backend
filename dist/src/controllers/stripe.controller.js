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
exports.stripe_controller = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../models/user.model");
const stripe_webhook_service_1 = require("../services/stripe-webhook.service");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
    apiVersion: '2022-11-15',
});
let stripe_controller = class stripe_controller {
    constructor(userModel, StripeWebhookService) {
        this.userModel = userModel;
        this.StripeWebhookService = StripeWebhookService;
    }
    async webhook(sig, request, response) {
        console.log("-----------------called");
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_ENDPOINT_SEC);
        }
        catch (err) {
            console.log(err);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        if (event.type === 'charge.succeeded') {
            const session = event.data.object;
            console.log("-------------------event.type---------------", event.type);
            const amount = event.data.object.amount_captured;
            console.log("-------------------amount---------------", amount);
            const formattedNumber = `${amount
                .toString()
                .slice(0, -2)}.${amount.toString().slice(-2)}`;
            console.log('Amount:', formattedNumber);
            const currency = event.data.object.currency;
            console.log('Amount type:', currency);
            const email = event.data.object.billing_details.email;
            console.log('Email:', email);
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
        return response.status(200).send('ok');
    }
};
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], stripe_controller.prototype, "webhook", null);
stripe_controller = __decorate([
    (0, common_1.Controller)('stripe-webhook'),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        stripe_webhook_service_1.StripeWebhookService])
], stripe_controller);
exports.stripe_controller = stripe_controller;
//# sourceMappingURL=stripe.controller.js.map