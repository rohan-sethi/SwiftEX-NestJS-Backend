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
    async payment_link(id, amount, XUSD_amount) {
        try {
            const result = await this.StripeWebhookService.payment_link(id, amount, XUSD_amount);
            console.log(">>>>", result);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return { success: false, message: 'User not found' };
            }
            throw error;
        }
    }
    async processPayment(mail, amount) {
        return this.StripeWebhookService.sendPayment(mail, amount);
    }
};
__decorate([
    (0, common_1.Post)('payment_link'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('XUSD_amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], stripe_controller.prototype, "payment_link", null);
__decorate([
    (0, common_1.Get)(':mail/:amount'),
    __param(0, (0, common_1.Param)('mail')),
    __param(1, (0, common_1.Param)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], stripe_controller.prototype, "processPayment", null);
stripe_controller = __decorate([
    (0, common_1.Controller)('api/stripe-payment'),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        stripe_webhook_service_1.StripeWebhookService])
], stripe_controller);
exports.stripe_controller = stripe_controller;
//# sourceMappingURL=stripe.controller.js.map