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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const bidSyncBody_dto_1 = require("../dtos/bidSyncBody.dto");
const newStripeAccount_dto_1 = require("../dtos/newStripeAccount.dto");
const newUser_dto_1 = require("../dtos/newUser.dto");
const phoneOtp_dto_1 = require("../dtos/phoneOtp.dto");
const swap_allbrideg_dto_1 = require("../dtos/swap-allbrideg.dto");
const updateEmail_dto_1 = require("../dtos/updateEmail.dto");
const userLogin_dto_1 = require("../dtos/userLogin.dto");
const verifyEmail_dto_1 = require("../dtos/verifyEmail.dto");
const swap_allbrige_1 = require("../services/swap-allbrige");
const users_service_1 = require("../services/users.service");
const validation_pipe_1 = require("../utils/validation.pipe");
const stripe_1 = require("stripe");
let UsersController = class UsersController {
    constructor(UsersService, SwapService) {
        this.UsersService = UsersService;
        this.SwapService = SwapService;
        this.stripe = new stripe_1.Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K', {
            apiVersion: '2020-08-27',
        });
    }
    getAllUsers() {
        return this.UsersService.getAllUsers();
    }
    register(newUser) {
        return this.UsersService.register(newUser);
    }
    async getUserDetails(userId) {
        const user = await this.UsersService.getUserDetails(userId);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.BAD_REQUEST);
        return user;
    }
    userKycApply(userId) {
        return this.UsersService.userKycApply(userId);
    }
    login(credintials) {
        return this.UsersService.login_email(credintials);
    }
    forgot_passcode(credintials) {
        return this.UsersService.forgot_email(credintials);
    }
    verifyLoginOtp(credintials) {
        return this.UsersService.verifyLoginOtp(credintials);
    }
    createStripeAccount(accountBody, userId) {
        return this.UsersService.createStripeAccount(userId, accountBody);
    }
    getStripeAccount(userId) {
        return this.UsersService.getStripeAccount(userId);
    }
    getStripeBalances(userId) {
        return this.UsersService.getStripeBalances(userId);
    }
    verifyUserEmail(userId, emailBody) {
        return this.UsersService.verifyUserEmail(userId, emailBody);
    }
    updateEmail(userId, emailBody) {
        return this.UsersService.updateEmail(userId, emailBody.email);
    }
    getInSynced(fcmRegToken, userId) {
        return this.UsersService.getInSynced(userId, fcmRegToken);
    }
    syncDevice(userId, bidSyncBody) {
        return this.UsersService.syncDevice(userId, bidSyncBody.fcmRegToken);
    }
    getAdminWallet() {
        return this.UsersService.getAdminWallet();
    }
    getTxFeeData(assetName, chainId) {
        return this.UsersService.getTxFeeData(assetName, chainId);
    }
    create(postData) {
        console.log('Received POST request with data:', postData);
        return { message: 'Data received successfully', data: postData };
    }
    async updatePublicKeyByEmail(userId, newPublicKey) {
        try {
            const result = await this.UsersService.findByEmailAndUpdatePublicKey(userId, newPublicKey);
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
    async updatePasscode(email, passcode) {
        try {
            const result = await this.UsersService.findByEmailAndupdataPasscode(email, passcode);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async SendXETH(userId, amount) {
        const result = await this.UsersService.sendXETH(userId, amount);
        return express_1.response.status(200).json(result);
    }
    async xeth_payout(userId, amount, recipient) {
        const result = await this.UsersService.XETH_Payout(userId, amount, recipient);
        return express_1.response.send({ result });
    }
    async handleJson(jsonData) {
        return await this.UsersService.report(jsonData);
    }
    async prepare_swap(body) {
        const { fromAddress, toAddress, amount, sourceToken, destinationToken, walletType } = body;
        return await this.SwapService.swap_prepare(fromAddress, toAddress, amount, sourceToken, destinationToken, walletType);
    }
    async execute_swap(body) {
        const { fromAddress, toAddress, amount, sourceToken, destinationToken, walletType } = body;
        return await this.SwapService.swap_execute(fromAddress, toAddress, amount, sourceToken, destinationToken, walletType);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newUser_dto_1.NewUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('/getUserDetails'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Post)('kyc'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "userKycApply", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phoneOtp_dto_1.phoneOtpDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot_passcode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userLogin_dto_1.UserLoginDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "forgot_passcode", null);
__decorate([
    (0, common_1.Post)('verifyLoginOtp'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phoneOtp_dto_1.phoneOtpDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyLoginOtp", null);
__decorate([
    (0, common_1.Post)('createStripeAccount'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newStripeAccount_dto_1.NewStripeAccountDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createStripeAccount", null);
__decorate([
    (0, common_1.Get)('getStripeAccount'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getStripeAccount", null);
__decorate([
    (0, common_1.Get)('getStripeBalances'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getStripeBalances", null);
__decorate([
    (0, common_1.Post)('verifyUserEmail'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verifyEmail_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyUserEmail", null);
__decorate([
    (0, common_1.Post)('updateEmail'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, updateEmail_dto_1.UpdateEmailDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Get)('getInSynced/:fcmRegToken'),
    __param(0, (0, common_1.Param)('fcmRegToken')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getInSynced", null);
__decorate([
    (0, common_1.Post)('syncDevice'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bidSyncBody_dto_1.BidSyncBodyDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "syncDevice", null);
__decorate([
    (0, common_1.Get)('getAdminWallet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAdminWallet", null);
__decorate([
    (0, common_1.Get)('getTxFeeData/:assetName/:chainId'),
    __param(0, (0, common_1.Param)('assetName')),
    __param(1, (0, common_1.Param)('chainId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getTxFeeData", null);
__decorate([
    (0, common_1.Post)('ACTIVATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('updatePublicKeyByEmail'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)('publicKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePublicKeyByEmail", null);
__decorate([
    (0, common_1.Post)('updatePasscode'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('passcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePasscode", null);
__decorate([
    (0, common_1.Post)('SendXETH'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "SendXETH", null);
__decorate([
    (0, common_1.Post)('xeth_payout'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('recipient')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "xeth_payout", null);
__decorate([
    (0, common_1.Post)('reports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "handleJson", null);
__decorate([
    (0, common_1.Post)('swap_exchange_prepare'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swap_allbrideg_dto_1.swap_allbridge_dto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "prepare_swap", null);
__decorate([
    (0, common_1.Post)('swap_exchange_execute'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swap_allbrideg_dto_1.swap_allbridge_dto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "execute_swap", null);
UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        swap_allbrige_1.SwapService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map