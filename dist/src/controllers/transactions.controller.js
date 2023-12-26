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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const transactions_service_1 = require("../services/transactions.service");
const validation_pipe_1 = require("../utils/validation.pipe");
const payout_services_1 = require("../services/payout.services");
const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
    apiVersion: '2022-11-15',
});
let TransactionsController = class TransactionsController {
    constructor(transactionsService, payoutServices) {
        this.transactionsService = transactionsService;
        this.payoutServices = payoutServices;
    }
    async transactionDetails(sessionId) {
        const tx = await this.transactionsService.getTxBySessionId(sessionId);
        return tx;
    }
    async webhook(sig, request, response) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_ENDPOINT_SEC);
        }
        catch (err) {
            console.log(err);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await this.transactionsService.completeTx(session);
        }
        if (event.type === 'checkout.session.async_payment_succeeded') {
            const session = event.data.object;
            await this.transactionsService.completeTx(session);
        }
        if (event.type === 'checkout.session.async_payment_failed') {
            const session = event.data.object;
            await this.transactionsService.updateFailedPaymentTx(session);
        }
        return response.status(200).send('ok');
    }
    async connectWebhook(sig, request, response) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_ENDPOINT_CONNECT_SEC);
        }
        catch (err) {
            console.log(err);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        if (event.type === 'account.updated') {
            const account = event.data.object;
            await this.transactionsService.updateUserAccount(account);
        }
        if (event.type === 'payout.failed') {
            const payout = event.data.object;
            await this.payoutServices.handlePayoutFailureEvent(payout, event.account);
        }
        if (event.type === 'payout.paid') {
            const payout = event.data.object;
            await this.payoutServices.handlePayoutFailureEvent(payout, event.account);
        }
        return response.status(200).send('ok');
    }
    getUserTansactions(userId) {
        return this.transactionsService.getUserTansactions(userId);
    }
};
__decorate([
    (0, common_1.Get)('transactionDetails/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "transactionDetails", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "webhook", null);
__decorate([
    (0, common_1.Post)('webhook/connect'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "connectWebhook", null);
__decorate([
    (0, common_1.Get)('getUserTansactions'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getUserTansactions", null);
TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        payout_services_1.PayoutServices])
], TransactionsController);
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map