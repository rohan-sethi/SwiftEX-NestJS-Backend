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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../service/user.service");
const create_user_dto_1 = require("../dto/create-user.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const auth_credentials_dto_1 = require("../../auth/dto/auth-credentials.dto");
const swapAllbridgeDto_1 = require("../../bridge/dto/swapAllbridgeDto");
const bridge_service_1 = require("../../bridge/services/bridge.service");
const bridge_utils_1 = require("../../bridge/utils/bridge.utils");
const bridgeUtilsDto_1 = require("../../bridge/dto/bridgeUtilsDto");
const alchemy_dto_1 = require("../../alchemyPay/dto/alchemy.dto");
let UserController = class UserController {
    constructor(userService, swapService, bridgeUtils) {
        this.userService = userService;
        this.swapService = swapService;
        this.bridgeUtils = bridgeUtils;
    }
    async register(newUser) {
        return this.userService.register(newUser);
    }
    async guestRegister(newUser) {
        return this.userService.guestRegister(newUser);
    }
    forgot_passcode(credintials) {
        return this.userService.forgotEmail(credintials);
    }
    verifyLoginOtp(req, credintials) {
        return this.userService.verifyLoginOtp(req.user._id, credintials);
    }
    async getUserDetails(req) {
        const user = await this.userService.findOneById(req.user.sub);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async updatePublicKeyByEmail(req, publicKey) {
        try {
            const result = await this.userService.findAndUpdatePublicKey(req.user.sub, publicKey.publicKey, publicKey.wallletPublicKey);
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
    async updatePublicKey(req, publicKey) {
        try {
            const result = await this.userService.UpdatePublicKey(req.user.sub, publicKey.publicKey, publicKey.wallletPublicKey);
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
    verifyUserEmail(req, emailBody) {
        return this.userService.verifyUserEmail(req.user.sub, emailBody);
    }
    getInSynced(fcmRegToken, req) {
        return this.userService.getInSynced(req.user.sub, fcmRegToken);
    }
    syncDevice(req, FcmTokenbody) {
        return this.userService.syncDevice(req.user.sub, FcmTokenbody.fcmRegToken, FcmTokenbody.deviceInfo);
    }
    async updatePasscode(req, { passcode }) {
        try {
            const result = await this.userService.findByEmailAndupdataPasscode(req.user._id, passcode);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    userKycApply(req) {
        return this.userService.userKycApply(req.user.sub);
    }
    handleStripeAccount(req) {
        return this.userService.getStripeAccount(req.user._id);
    }
    async handleJson(jsonData) {
        return await this.userService.report(jsonData);
    }
    async prepare_swap(body) {
        const { fromAddress, toAddress, amount, sourceToken, destinationToken, walletType } = body;
        const res = await this.swapService.swap_prepare(fromAddress, toAddress, amount, sourceToken, destinationToken, walletType);
        console.log(res);
        return res;
    }
    async execute_swap(body) {
        const { fromAddress, toAddress, amount, sourceToken, destinationToken, walletType } = body;
        return await this.swapService.swap_execute(fromAddress, toAddress, amount, sourceToken, destinationToken, walletType);
    }
    async getSwapDetails(query) {
        return this.bridgeUtils.getSwapDetails(query.amount, query.chainType);
    }
    async getAlchemyQuotes(query, req) {
        return this.userService.fetchAlchemyQuotes(req.user.sub, query);
    }
    async alchemyUserRegister(query, req) {
        return this.userService.userRegisterForAlchemy(req.user.sub, query.businessSubType);
    }
    async alchemyKycStatus(req) {
        return this.userService.userKycStatus(req.user.sub);
    }
    async orderCreate(query, req) {
        return this.userService.alchemyOrder(req.user.sub, query);
    }
    async sellOrder(query, req) {
        return this.userService.alchemySellOrderCreate(req.user.sub, query);
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/guestRegister'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateGuestUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "guestRegister", null);
__decorate([
    (0, common_1.Post)('/forgotPasscode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.UserForgetDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "forgot_passcode", null);
__decorate([
    (0, common_1.Post)('/verifyLoginOtp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.OtpDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyLoginOtp", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Post)('/updatePublicKeyByEmail'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdatePublicKey]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePublicKeyByEmail", null);
__decorate([
    (0, common_1.Post)('/updatePublicKey'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdatePublicKeyNew]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePublicKey", null);
__decorate([
    (0, common_1.Post)('/verifyUserEmail'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyUserEmail", null);
__decorate([
    (0, common_1.Get)('/getInSynced/:fcmRegToken'),
    __param(0, (0, common_1.Param)('fcmRegToken')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getInSynced", null);
__decorate([
    (0, common_1.Post)('/syncDevice'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.FcmTokenDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "syncDevice", null);
__decorate([
    (0, common_1.Post)('/updatePasscode'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.PasscodeDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePasscode", null);
__decorate([
    (0, common_1.Post)('/kyc'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "userKycApply", null);
__decorate([
    (0, common_1.Get)('/getStripeAccount'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "handleStripeAccount", null);
__decorate([
    (0, common_1.Post)('/reports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleJson", null);
__decorate([
    (0, common_1.Post)('swap_exchange_prepare'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swapAllbridgeDto_1.swapAllbridgeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "prepare_swap", null);
__decorate([
    (0, common_1.Post)('swap_exchange_execute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swapAllbridgeDto_1.swapAllbridgeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "execute_swap", null);
__decorate([
    (0, common_1.Post)('/swapInfo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bridgeUtilsDto_1.bridgeUtilsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSwapDetails", null);
__decorate([
    (0, common_1.Post)('/alchemyQuotes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alchemy_dto_1.conversionQuote, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAlchemyQuotes", null);
__decorate([
    (0, common_1.Post)('/alchemyUserRegister'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alchemy_dto_1.alchemyUserKyc, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "alchemyUserRegister", null);
__decorate([
    (0, common_1.Post)('/alchemyKycStatus'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "alchemyKycStatus", null);
__decorate([
    (0, common_1.Post)('/alchemyCreateOrder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alchemy_dto_1.alchemyCreateOrder, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "orderCreate", null);
__decorate([
    (0, common_1.Post)('/alchemySellOrderCreate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alchemy_dto_1.alchemySellOrderDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sellOrder", null);
UserController = __decorate([
    (0, common_1.Controller)('/users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        bridge_service_1.SwapService,
        bridge_utils_1.BridgeUtils])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map