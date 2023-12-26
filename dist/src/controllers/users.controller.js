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
const bidSyncBody_dto_1 = require("../dtos/bidSyncBody.dto");
const newStripeAccount_dto_1 = require("../dtos/newStripeAccount.dto");
const newUser_dto_1 = require("../dtos/newUser.dto");
const phoneOtp_dto_1 = require("../dtos/phoneOtp.dto");
const updateEmail_dto_1 = require("../dtos/updateEmail.dto");
const userLogin_dto_1 = require("../dtos/userLogin.dto");
const verifyEmail_dto_1 = require("../dtos/verifyEmail.dto");
const users_service_1 = require("../services/users.service");
const validation_pipe_1 = require("../utils/validation.pipe");
let UsersController = class UsersController {
    constructor(UsersService) {
        this.UsersService = UsersService;
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
        return this.UsersService.login(credintials);
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
    __metadata("design:paramtypes", [userLogin_dto_1.UserLoginDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "login", null);
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
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map