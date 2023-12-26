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
exports.PayoutServices = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../models/user.model");
const payout_repository_1 = require("../repositories/payout.repository");
const constants_1 = require("../utils/constants");
const fcmHandler_1 = require("../utils/fcmHandler");
let PayoutServices = class PayoutServices {
    constructor(userModel, payoutRepository) {
        this.userModel = userModel;
        this.payoutRepository = payoutRepository;
    }
    createPayout(userId) { }
    getPayout(payoutId) { }
    async getAccoutnPayouts(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const { data } = await this.payoutRepository.getAccountPayouts(user.stripeAccountId, { limit: 10 });
        return data;
    }
    async handlePayoutFailureEvent(payoutObject, stripeAccountId) {
        const user = await this.userModel.findOne({ stripeAccountId });
        if (!user)
            return;
        const notificationData = {
            type: constants_1.NOTIFICATION_TYPES_ENUM.PAYOUT_FAILED,
            targetUser: user._id.toString(),
            isActionRequired: '',
            message: `Your payout with the amount of ${payoutObject.amount} ${payoutObject.currency.toUpperCase()} amount has failed`,
        };
        await (0, fcmHandler_1.pushNotification)({
            tokens: user.fcmRegTokens,
            notification: {
                title: 'Payout Failed',
                body: 'One of your payouts is failed',
            },
            data: notificationData,
        });
    }
    async handlePayoutPaidEvent(payoutObject, stripeAccountId) {
        const user = await this.userModel.findOne({ stripeAccountId });
        if (!user)
            return;
        const notificationData = {
            type: constants_1.NOTIFICATION_TYPES_ENUM.PAYOUT_SUCCEEDED,
            targetUser: user._id.toString(),
            isActionRequired: '',
            message: `Your payout with the amount of ${payoutObject.amount} ${payoutObject.currency.toUpperCase()} amount is paid and expected to arrive soon`,
        };
        await (0, fcmHandler_1.pushNotification)({
            tokens: user.fcmRegTokens,
            notification: {
                title: 'Payout Succeeded',
                body: 'One of your payouts is paid and expected to arrive soon',
            },
            data: notificationData,
        });
    }
};
PayoutServices = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        payout_repository_1.PayoutRepository])
], PayoutServices);
exports.PayoutServices = PayoutServices;
//# sourceMappingURL=payout.services.js.map