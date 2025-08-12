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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schema/user.schema");
const email_service_1 = require("../../utils/email.service");
const jwt_utils_1 = require("../../auth/jwt.utils");
const bcrypt = __importStar(require("bcrypt"));
const Stellar = __importStar(require("stellar-sdk"));
const mailer_1 = require("@nestjs-modules/mailer");
const notification_service_1 = require("../../notification/service/notification.service");
const alchemy_service_1 = require("../../alchemyPay/service/alchemy.service");
const walletNotification_service_1 = require("../../notification/service/walletNotification.service");
const sorobanHooksURL_1 = require("../../notification/utils/sorobanHooksURL");
const user_wallet_service_1 = require("./user.wallet.service");
const user_orders_schema_1 = require("../schema/user.orders.schema");
const alchemyOrders_enum_1 = require("../../comman/alchemyOrders.enum");
let UserService = UserService_1 = class UserService {
    constructor(userModel, userOrder, emailService, mailerService, notificationService, alchemyService, walletNotificationService, userWalletService) {
        this.userModel = userModel;
        this.userOrder = userOrder;
        this.emailService = emailService;
        this.mailerService = mailerService;
        this.notificationService = notificationService;
        this.alchemyService = alchemyService;
        this.walletNotificationService = walletNotificationService;
        this.userWalletService = userWalletService;
        this.logger = new common_1.Logger(UserService_1.name);
        Stellar.Network.useTestNetwork();
    }
    async guestRegister(CreateGuestUserDto) {
        try {
            const userExist = await this.userModel.findOne({ email: CreateGuestUserDto.deviceUniqueID });
            if (userExist) {
                const payload = { email: userExist.email, sub: userExist._id };
                const token = (0, jwt_utils_1.LoginJwtToken)(payload);
                return { success: true, message: "Guest user alredy exist", status: 200, token };
            }
            const gusetUserInfo = {
                firstName: "Guest",
                lastName: "guest",
                phoneNumber: CreateGuestUserDto === null || CreateGuestUserDto === void 0 ? void 0 : CreateGuestUserDto.deviceUniqueID,
                email: CreateGuestUserDto === null || CreateGuestUserDto === void 0 ? void 0 : CreateGuestUserDto.deviceUniqueID,
                accountAddress: CreateGuestUserDto === null || CreateGuestUserDto === void 0 ? void 0 : CreateGuestUserDto.deviceUniqueID,
                walletAddress: CreateGuestUserDto === null || CreateGuestUserDto === void 0 ? void 0 : CreateGuestUserDto.deviceUniqueID,
                password: "null",
                loginOtp: "null",
                DeviceInfo: CreateGuestUserDto
            };
            const guestUser = await this.userModel.create(gusetUserInfo);
            if (!guestUser) {
                return { success: false, message: "somthig went wrong", status: 400, error: "null" };
            }
            const payload = { email: guestUser.email, sub: guestUser._id };
            const token = (0, jwt_utils_1.LoginJwtToken)(payload);
            return { success: true, message: "Guest user created", status: 200, token };
        }
        catch (error) {
            return { success: false, message: "Internal server error", status: 500, error: error.message };
        }
    }
    async register(CreateUserDto) {
        const userExist = await this.userModel.findOne({ phoneNumber: CreateUserDto.phoneNumber });
        if (userExist)
            throw new common_1.HttpException('Phone number already registered', common_1.HttpStatus.BAD_REQUEST);
        const walletExist = await this.userModel.findOne({ walletAddress: CreateUserDto.walletAddress });
        if (CreateUserDto.email) {
            const emailExist = await this.userModel.findOne({ email: CreateUserDto.email });
            if (emailExist)
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.BAD_REQUEST);
        }
        const otp = this._generateOtp();
        const loginOtp = bcrypt.hashSync(otp, 10);
        const { errorCode, errorMessage } = await this.emailService.sendEmail(CreateUserDto.email, CreateUserDto.firstName, otp);
        if (errorCode === 500) {
            throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
        }
        const addedUser = await this.userModel.create(Object.assign(Object.assign({}, CreateUserDto), { loginOtp }));
        if (!addedUser) {
            throw new common_1.HttpException('User creation failed', common_1.HttpStatus.BAD_REQUEST);
        }
        const token = (0, jwt_utils_1.signJwtToken)({
            phoneNumber: addedUser.phoneNumber,
            _id: addedUser._id,
        });
        return { token, message: 'OTP sent successfully' };
    }
    _generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async forgotEmail(credintails) {
        const { email } = credintails;
        const user = await this.userModel.findOne({ email: email.toLocaleLowerCase() });
        if (!user) {
            throw new common_1.HttpException({ errorMessage: 'User not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const { loginOtpUpdatedAt } = user;
        const otpLockTime = 30000 - (new Date().getTime() - loginOtpUpdatedAt);
        if (otpLockTime >= 0)
            throw new common_1.HttpException(`Cannot generate login OTP in next ${Math.floor(otpLockTime / 1000)} sec.`, common_1.HttpStatus.BAD_REQUEST);
        const otp = this._generateOtp();
        const { errorCode, errorMessage } = await this.emailService.sendEmail(email, user.firstName, otp);
        const loginOtp = bcrypt.hashSync(otp, 10);
        await this.userModel.findOneAndUpdate({ _id: user._id }, {
            loginOtp: loginOtp,
            loginOtpUpdatedAt: new Date().getTime(),
            isLoginOtpUsed: false,
        });
        if (errorCode === 500) {
            throw new common_1.HttpException(errorMessage, errorCode);
        }
        if (errorCode === 200) {
            const token = (0, jwt_utils_1.signJwtToken)({
                phoneNumber: user.phoneNumber,
                _id: user._id,
            });
            const data = {
                errorCode,
                errorMessage,
                token
            };
            throw new common_1.HttpException(data, errorCode);
        }
        return user;
    }
    async verifyLoginOtp(userId, phoneOtp) {
        const { otp } = phoneOtp;
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new common_1.HttpException('Invalid credintials', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.isLoginOtpUsed) {
            throw new common_1.HttpException('New OTP generation required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!bcrypt.compareSync(otp, user.loginOtp)) {
            throw new common_1.HttpException('Wrong OTP', common_1.HttpStatus.BAD_REQUEST);
        }
        const token = (0, jwt_utils_1.signJwtToken)({
            phoneNumber: user.phoneNumber,
            _id: user._id,
        });
        await this.userModel.findOneAndUpdate({ _id: userId }, {
            isLoginOtpUsed: true,
            loginOtp: ""
        });
        return { token };
    }
    async verifyUserEmail(userId, emailBody) {
        const { email, otp } = emailBody;
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (user.email !== email)
            throw new common_1.HttpException('Not your rigistered email', common_1.HttpStatus.UNAUTHORIZED);
        if (user.isEmailVerified)
            throw new common_1.HttpException('Email already verified', common_1.HttpStatus.BAD_REQUEST);
        const newOtp = this._generateOtp();
        await this.emailService.sendEmail(email, user.firstName, newOtp);
        return { otpSent: true };
    }
    async getInSynced(userId, fcmRegToken) {
        const inSyncedUser = await this.userModel.findOne({
            _id: userId,
            fcmRegTokens: { $ne: fcmRegToken },
        });
        return inSyncedUser ? { isInSynced: true } : { isInSynced: false };
    }
    async findOneByEmail(email) {
        return await this.userModel.findOne({ email }).exec();
    }
    async findOneById(id) {
        return await this.userModel.findById(id).select('-passcode');
    }
    async findAndUpdatePublicKey(id, newPublicKey, newWalletPublicKey) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.userModel.findByIdAndUpdate(user._id, {
                public_key: newPublicKey,
                walletAddress: newWalletPublicKey
            });
            const server = new Stellar.Server(process.env.RPC_STELLAR);
            const sourceSecretKey = process.env.ACTIVATE_STELLAR_ADDRESS;
            const sourceKeypair = Stellar.Keypair.fromSecret(sourceSecretKey);
            const destinationPublicKey = newPublicKey;
            const asset = new Stellar.Asset("USDC", process.env.STELLAR_ONETAP_ISSUER);
            const account = await server.loadAccount(sourceKeypair.publicKey());
            const transaction = new Stellar.TransactionBuilder(account, {
                fee: Stellar.BASE_FEE,
                networkPassphrase: Stellar.Networks.TESTNET
            })
                .addOperation(Stellar.Operation.createAccount({
                destination: destinationPublicKey,
                startingBalance: '5'
            }))
                .addOperation(Stellar.Operation.changeTrust({
                asset: asset,
                limit: "1000",
                source: destinationPublicKey,
            }))
                .setTimeout(180)
                .build();
            transaction.sign(sourceKeypair);
            const xdr = transaction.toEnvelope().toXDR("base64");
            await this.notificationService.sendNotification(user.fcmRegTokens[0], 'Activate', 'Congratulations! 5 XLM has been successfully added to your wallet.');
            this.logger.log('Success! Result:');
            const sorobanRes = await this.walletNotificationService.addWalletWatcher(sorobanHooksURL_1.ADDWALLETWATCH, newPublicKey, user);
            console.log('SorobanHook: ', sorobanRes);
            if (newWalletPublicKey) {
                const moralisRes = await this.walletNotificationService.addWalletToMoralis(newWalletPublicKey, user);
                console.log('MoralisRes: ', moralisRes);
            }
            await this.userWalletService.updateAddressWithUser(user._id, { multichainAddress: newWalletPublicKey, stellarAddress: newPublicKey });
            return { success: true, message: "Funded successfully", resXdr: xdr, status_code: common_1.HttpStatus.ACCEPTED };
        }
        catch (error) {
            this.logger.log('Error funding account:', error);
            return { success: false, message: "Error funding account", status_code: common_1.HttpStatus.EXPECTATION_FAILED };
        }
    }
    async UpdatePublicKey(id, newPublicKey, newWalletPublicKey) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const res = await this.userModel.findByIdAndUpdate(user._id, {
            public_key: newPublicKey,
            walletAddress: newWalletPublicKey
        });
        if (!res) {
            return { success: false, message: "keys updates faild", status_code: common_1.HttpStatus.BAD_REQUEST };
        }
        const sorobanRes = await this.walletNotificationService.addWalletWatcher(sorobanHooksURL_1.ADDWALLETWATCH, newPublicKey, user);
        console.log('SorobanHook: ', sorobanRes);
        if (newWalletPublicKey) {
            const moralisRes = await this.walletNotificationService.addWalletToMoralis(newWalletPublicKey, user);
            console.log('MoralisRes: ', moralisRes);
        }
        await this.userWalletService.updateAddressWithUser(user._id, { multichainAddress: newWalletPublicKey, stellarAddress: newPublicKey });
        return { success: true, message: "keys updates successfully", status_code: common_1.HttpStatus.ACCEPTED };
    }
    async findByEmailAndupdataPasscode(userId, passcode) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            if (!user) {
                return { success: false, message: "User not found", status: 404 };
            }
            const hashedPasscode = bcrypt.hashSync(passcode, 10);
            const updateResult = await this.userModel.findByIdAndUpdate(user._id, {
                passcode: hashedPasscode,
                isEmailVerified: true,
            });
            if (!updateResult) {
                return { success: false, message: "Failed to update passcode", status: 500 };
            }
            const payload = { email: user.email, sub: user._id };
            const token = (0, jwt_utils_1.LoginJwtToken)(payload);
            return { success: true, message: "Passcode updated successfully", status: 200, token };
        }
        catch (error) {
            return { success: false, message: "Internal server error", status: 500, error: error.message };
        }
    }
    async report(data) {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new common_1.HttpException('Received JSON is empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const res = await this.sendEmail(process.env.EMAIL_ADD_REPORT, 'SwiftEx', JSON.stringify(data));
            return res;
        }
        catch (error) {
            console.error('Report send faild:', error);
            throw new common_1.HttpException(error, 400);
        }
    }
    async sendEmail(to, subject, text) {
        try {
            await this.mailerService.sendMail({
                to,
                from: process.env.EMAIL_ADD,
                subject,
                text,
            });
            return { statuscode: 200, message: 'Send successfully', status: "200" };
        }
        catch (err) {
            return { errorCode: 500, errorMessage: 'Otp not Send.' };
        }
    }
    async getStripeAccount(userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        return null;
    }
    async syncDevice(userId, fcmRegToken, deviceInfo) {
        const synced = await this.userModel.updateOne({
            _id: userId,
        }, {
            $set: { fcmRegTokens: [fcmRegToken], DeviceInfo: deviceInfo },
        });
        return Object.assign(Object.assign({}, synced), { success: true });
    }
    async userKycApply(userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.userModel.updateOne({ _id: userId }, { isVerified: true });
        return 'success';
    }
    async fetchAlchemyQuotes(userId, payload) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const resPayloadGen = await this.alchemyService.fetchQuotes(payload);
        throw new common_1.HttpException(resPayloadGen, common_1.HttpStatus.OK);
    }
    async userRegisterForAlchemy(userId, businessSubType) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user || !user.isEmailVerified) {
            throw new common_1.HttpException(!user ? 'user not found' : "user need login or create account", !user ? common_1.HttpStatus.NOT_FOUND : common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const payload = {
            "merchantNo": process.env.ALCHEMY_PAY_MERCHANT_NO,
            "businessSubcategories": businessSubType,
            "email": user.email,
            "kycType": "1",
            "kycPlatform": "sumsub",
            "redirectUrl": "",
            "callbackUrl": "",
            "remark": "9999"
        };
        const resPayloadGen = await this.alchemyService.userRegister(payload);
        throw new common_1.HttpException(resPayloadGen, common_1.HttpStatus.OK);
    }
    async userKycStatus(userId) {
        var _a;
        const user = await this.userModel.findOne({ _id: userId });
        if (!user || !user.isEmailVerified) {
            throw new common_1.HttpException(!user ? 'user not found' : "user need login or create account", !user ? common_1.HttpStatus.NOT_FOUND : common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const payload = {
            "email": user.email,
            "kycPlatform": "sumsub",
            "kycType": "1"
        };
        const resPayloadGen = await this.alchemyService.userStatus(payload);
        if (!resPayloadGen.status) {
            throw new common_1.HttpException(((_a = resPayloadGen.res) === null || _a === void 0 ? void 0 : _a.msg) || "Error", common_1.HttpStatus.OK);
        }
        throw new common_1.HttpException(resPayloadGen, common_1.HttpStatus.OK);
    }
    async alchemyOrder(userId, requestPayload) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user || !user.isEmailVerified) {
            throw new common_1.HttpException(!user ? 'user not found' : "user need login or create account", !user ? common_1.HttpStatus.NOT_FOUND : common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const payload = {
            "side": requestPayload.side,
            "merchantOrderNo": Math.floor(1000000000 + Math.random() * 9000000000),
            "amount": requestPayload.amount,
            "fiatCurrency": requestPayload.fiat,
            "cryptoCurrency": requestPayload.crypto,
            "depositType": 2,
            "address": requestPayload.address,
            "network": requestPayload.network,
            "alpha2": requestPayload.alpha2,
            "orderType": requestPayload.orderType,
            "payWayCode": requestPayload.payWayCode,
            "userAccountId": "111110",
            "redirectUrl": process.env.ALCHEMY_PAY_REDIRECT_URL,
            "callbackUrl": process.env.ALCHEMY_PAY_WEBHOOK_URL,
            "memo": requestPayload.memo
        };
        const resPayloadGen = await this.alchemyService.orderCreate(payload, user.email);
        const parsResponse = JSON.parse(resPayloadGen.res);
        const createdBuyOrder = await this.userOrder.create({
            userId: user._id,
            email: user.email,
            deviceInfo: user.DeviceInfo,
            orderId: parsResponse.data.orderNo,
            requsetdPayload: payload,
            url: parsResponse.data.payUrl,
            deviceFCM: user.fcmRegTokens[0],
            orderType: alchemyOrders_enum_1.AlchemyOrder.ORDERBUY
        });
        this.logger.log("Created Buy Order.");
        throw new common_1.HttpException(resPayloadGen, common_1.HttpStatus.OK);
    }
    async alchemySellOrderCreate(userId, requestPayload) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user || !user.isEmailVerified) {
            throw new common_1.HttpException(!user ? 'user not found' : "user need login or create account", !user ? common_1.HttpStatus.NOT_FOUND : common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const resPayloadGen = await this.alchemyService.sellOrderCreate(requestPayload, user.email);
        const _a = resPayloadGen.servicePayload, { appId } = _a, finalpayload = __rest(_a, ["appId"]);
        const createdSellOrder = await this.userOrder.create({
            userId: user._id,
            email: user.email,
            deviceInfo: user.DeviceInfo,
            orderId: finalpayload.merchantOrderNo,
            requsetdPayload: finalpayload,
            url: resPayloadGen.res,
            deviceFCM: user.fcmRegTokens[0],
            orderType: alchemyOrders_enum_1.AlchemyOrder.ORDERSELL
        });
        this.logger.log("Created Sell Order.");
        const userResponse = {
            "status": resPayloadGen.status,
            "res": resPayloadGen.res
        };
        throw new common_1.HttpException(userResponse, common_1.HttpStatus.OK);
    }
    async getCreatedAlchemyOrders(userId) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            if (!user || !user.isEmailVerified) {
                throw new common_1.HttpException(!user ? 'user not found' : "user need login or create account", !user ? common_1.HttpStatus.NOT_FOUND : common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const collectRecords = await this.userOrder.find({ userId });
            if (!collectRecords || collectRecords.length === 0) {
                return {
                    status: true,
                    total: 0,
                    records: [],
                };
            }
            else {
                return {
                    status: true,
                    total: collectRecords.length,
                    records: collectRecords,
                };
            }
        }
        catch (error) {
            return {
                status: false,
                total: 0,
                records: [],
            };
        }
    }
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_orders_schema_1.UserOrder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService,
        mailer_1.MailerService,
        notification_service_1.NotificationService,
        alchemy_service_1.AlchemyService,
        walletNotification_service_1.WalletNotificationService,
        user_wallet_service_1.UserWalletService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map