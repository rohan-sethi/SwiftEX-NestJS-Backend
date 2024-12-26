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
let UserService = UserService_1 = class UserService {
    constructor(userModel, emailService, mailerService, notificationService) {
        this.userModel = userModel;
        this.emailService = emailService;
        this.mailerService = mailerService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(UserService_1.name);
        Stellar.Network.useTestNetwork();
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
    async findAndUpdatePublicKey(id, newPublicKey) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            public_key: newPublicKey,
        });
        const server = new Stellar.Server(process.env.RPC_STELLAR);
        const sourceSecretKey = process.env.ACTIVATE_STELLAR_ADDRESS;
        const sourceKeypair = Stellar.Keypair.fromSecret(sourceSecretKey);
        const destinationPublicKey = newPublicKey;
        const res = server.loadAccount(sourceKeypair.publicKey())
            .then(account => {
            const transaction = new Stellar.TransactionBuilder(account, {
                fee: Stellar.BASE_FEE,
                networkPassphrase: Stellar.Networks.TESTNET
            })
                .addOperation(Stellar.Operation.createAccount({
                destination: destinationPublicKey,
                startingBalance: '5'
            }))
                .setTimeout(30)
                .build();
            transaction.sign(sourceKeypair);
            const res = server.submitTransaction(transaction);
        })
            .then(async (result) => {
            await this.notificationService.sendNotification(user.fcmRegTokens[0], 'Activate', 'Congratulations! 5 XLM has been successfully added to your wallet.');
            this.logger.log('Success! Result:');
            return { success: true, message: "Funded successfully", status_code: common_1.HttpStatus.ACCEPTED };
        })
            .catch(error => {
            this.logger.log('Error funding account:', error);
            return { success: false, message: "Error funding account", status_code: common_1.HttpStatus.EXPECTATION_FAILED };
        });
        return res;
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
};
UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        mailer_1.MailerService,
        notification_service_1.NotificationService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map