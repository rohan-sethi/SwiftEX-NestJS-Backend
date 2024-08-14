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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../models/user.model");
const jwtHandler_1 = require("../utils/jwtHandler");
const bcrypt = __importStar(require("bcryptjs"));
const stripe_1 = __importDefault(require("stripe"));
const redisHandler_1 = require("../utils/redisHandler");
const emailHandler_1 = require("../utils/emailHandler");
const adminWallets_service_1 = require("./adminWallets.service");
const txFees_repository_1 = require("../repositories/txFees.repository");
const web3_service_1 = require("./web3.service");
const Stellar = __importStar(require("stellar-sdk"));
const ethers_1 = require("ethers");
const ABI_1 = require("./ABI");
const mailer_1 = require("@nestjs-modules/mailer");
const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
    apiVersion: '2022-11-15',
});
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel, redisService, emailService, adminWalletsService, txFeeRepository, chainServices, mailerService) {
        this.userModel = userModel;
        this.redisService = redisService;
        this.emailService = emailService;
        this.adminWalletsService = adminWalletsService;
        this.txFeeRepository = txFeeRepository;
        this.chainServices = chainServices;
        this.mailerService = mailerService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.contractAddress = process.env.SMART_CONTRACT;
        this.abi = ABI_1.contractABI;
        this.privateKey = process.env.PRIVATE_KEY_OWNER;
        this.server = new Stellar.Server('https://horizon-testnet.stellar.org');
        this.senderKeypair = Stellar.Keypair.fromSecret('SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ');
        this.redisClient = redisService.getClient();
        Stellar.Network.useTestNetwork();
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC);
        this.signer = new ethers_1.ethers.Wallet(this.privateKey, this.provider);
        this.contract = new ethers_1.ethers.Contract(this.contractAddress, this.abi, this.provider);
    }
    getAllUsers() {
        return this.userModel.find();
    }
    async register(newUser) {
        const userExist = await this.userModel.findOne({
            phoneNumber: newUser.phoneNumber,
        });
        if (userExist)
            throw new common_1.HttpException('Email already registered', common_1.HttpStatus.BAD_REQUEST);
        const wallet_exist = await this.userModel.findOne({ walletAddress: newUser.walletAddress });
        if (newUser.email) {
            const emailExist = await this.userModel.findOne({ email: newUser.email });
            if (emailExist)
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.BAD_REQUEST);
        }
        const otp = this._generateOtp();
        const loginOtp = bcrypt.hashSync(otp, 10);
        const addedUser = await this.userModel.create(Object.assign(Object.assign({}, newUser), { loginOtp }));
        if (!addedUser) {
            throw new common_1.HttpException({ errorMessage: "not created" }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            const { errorMessage } = await this.emailService.sendEmail(newUser.email, 'One Time Passcode from SwiftEx.', `Hi ${newUser.firstName},\nYour email from SwiftEx verification OTP is ${otp}\nRegards,`);
            if (errorMessage)
                throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
        }
        return addedUser;
    }
    getUserDetails(userId) {
        return this.userModel.findById(userId).select('-passcode');
    }
    async userKycApply(userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        await this.userModel.updateOne({ _id: userId }, { isVerified: true });
        return 'success';
    }
    async forgot_email(credintails) {
        const { email } = credintails;
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.HttpException({ errorMessage: 'User not found' }, common_1.HttpStatus.NOT_FOUND);
        const { loginOtpUpdatedAt } = user;
        const otpLockTime = 30000 - (new Date().getTime() - loginOtpUpdatedAt);
        if (otpLockTime >= 0)
            throw new common_1.HttpException(`Cannot generate login OTP in next ${Math.floor(otpLockTime / 1000)} sec.`, common_1.HttpStatus.BAD_REQUEST);
        const otp = this._generateOtp();
        const { errorMessage, errorCode } = await await this.emailService.sendEmail(email, 'One Time Passcode from SwiftEx.', `Hi ${user.firstName},\nYour email from SwiftEx for Recover Account verification OTP is ${otp}\nRegards,`);
        const loginOtp = bcrypt.hashSync(otp, 10);
        await this.userModel.findOneAndUpdate({ email }, {
            loginOtp,
            loginOtpUpdatedAt: new Date().getTime(),
            isLoginOtpUsed: false,
        });
        if (errorMessage)
            throw new common_1.HttpException(errorMessage, errorCode);
        return user;
    }
    async verifyLoginOtp(phoneOtp) {
        const { email, otp } = phoneOtp;
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.HttpException('Invalid credintials', common_1.HttpStatus.BAD_REQUEST);
        if (user.isLoginOtpUsed)
            throw new common_1.HttpException('New OTP generation required', common_1.HttpStatus.BAD_REQUEST);
        if (!bcrypt.compareSync(otp, user.loginOtp))
            throw new common_1.HttpException('Wrong OTP', common_1.HttpStatus.BAD_REQUEST);
        const token = (0, jwtHandler_1.signJwtToken)({
            phoneNumber: user.phoneNumber,
            _id: user._id,
        });
        await this.userModel.findOneAndUpdate({ email }, { isLoginOtpUsed: true });
        return { token };
    }
    async createStripeAccount(userId, accountBody) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
            apiVersion: '2022-11-15',
        });
        if (user.stripeAccountId) {
            throw new common_1.HttpException('Already have a bank account', common_1.HttpStatus.BAD_REQUEST);
        }
        const accountDefaults = {
            object: 'bank_account',
            account_holder_name: `${user.firstName} ${user.lastName}`,
            account_holder_type: 'individual',
        };
        const newAccount = await stripe.accounts.create({
            type: 'standard',
            country: accountBody.country,
            default_currency: accountBody.currency,
            external_account: Object.assign(Object.assign({}, accountBody), accountDefaults),
            email: user.email,
        });
        await this.userModel.findByIdAndUpdate(userId, {
            stripeAccountId: newAccount.id,
        });
        return { success: true, message: 'Bank account added successfully' };
    }
    async getStripeAccount(userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (!user.stripeAccountId)
            return null;
        const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
            apiVersion: '2022-11-15',
        });
        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        return account;
    }
    async getStripeBalances(userId) {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (!user.stripeAccountId)
            return null;
        const stripe = new stripe_1.default(process.env.STRIPE_API_SK, {
            apiVersion: '2022-11-15',
        });
        const balances = await stripe.balance.retrieve({
            stripeAccount: user.stripeAccountId,
        });
        return balances;
    }
    async updateEmail(userId, newEmail) {
        const userByEmail = await this.userModel.findOne({ email: newEmail });
        if (userByEmail && userByEmail._id.toString() !== userId.toString())
            throw new common_1.HttpException('Email already in use', common_1.HttpStatus.BAD_REQUEST);
        const user = await this.userModel.findById(userId);
        if (user.email === newEmail)
            return { success: true };
        await this.userModel.findByIdAndUpdate(userId, {
            email: newEmail,
            isEmailVerified: false,
        });
        return { success: true };
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
        if (otp) {
            const cachedOtp = await this.redisClient.get(email);
            const isVerified = cachedOtp === otp;
            isVerified &&
                (await this.userModel.findByIdAndUpdate(userId, {
                    isEmailVerified: true,
                }));
            return { isVerified };
        }
        const newOtp = this._generateOtp();
        await this.emailService.sendEmail(email, 'Email Verification', `Hi ${user.firstName},\nYour email verification OTP is ${newOtp}\nRegards,`);
        await this.redisClient.set(email, newOtp, 'EX', 300);
        return { otpSent: true };
    }
    async getInSynced(userId, fcmRegToken) {
        const inSyncedUser = await this.userModel.findOne({
            _id: userId,
            fcmRegTokens: { $ne: fcmRegToken },
        });
        return inSyncedUser ? { isInSynced: true } : { isInSynced: false };
    }
    async syncDevice(userId, fcmRegToken) {
        const synced = await this.userModel.updateOne({
            _id: userId,
            fcmRegTokens: { $ne: fcmRegToken },
        }, {
            $push: { fcmRegTokens: fcmRegToken },
        });
        return Object.assign(Object.assign({}, synced), { success: true });
    }
    getAdminWallet() {
        return {
            adminWalletAddress: this.adminWalletsService.getRandomAdminWallet(),
        };
    }
    async getTxFeeData(assetName, chainId) {
        if (!this.chainServices.isChainListed(chainId))
            throw new common_1.HttpException(`${chainId} chain ID is not listed`, common_1.HttpStatus.BAD_REQUEST);
        if (!this.chainServices.isAssetListed(assetName))
            throw new common_1.HttpException(`${assetName} asset is not listed`, common_1.HttpStatus.BAD_REQUEST);
        const txName = this.chainServices.getAssetsTxName(assetName);
        const feeData = await this.txFeeRepository.getTxFeePrice(txName, chainId);
        if (!feeData)
            throw new common_1.HttpException('Transaction name not found', common_1.HttpStatus.NOT_FOUND);
        return feeData;
    }
    _generateOtp() {
        const otp = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
        console.log('New Otp:', otp);
        return otp;
    }
    async findByEmailAndUpdatePublicKey(email, newPublicKey) {
        const user = await this.userModel.findOne({ _id: email });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            public_key: newPublicKey,
        });
        const server = new Stellar.Server('https://horizon-testnet.stellar.org');
        const res = server.friendbot(newPublicKey)
            .call()
            .then(() => {
            this.logger.log('Funded successfully');
            return { success: true, message: "Funded successfully" };
        })
            .catch(() => {
            this.logger.log('Error funding account:');
            return { success: false, message: "Error funding account" };
        });
        return res;
    }
    async findByEmailAndupdataPasscode(email, Passcode) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                return { success: false, message: "user not found", status: "404" };
            }
            const newPasscode = bcrypt.hashSync(Passcode, 10);
            const res = await this.userModel.findByIdAndUpdate(user._id, {
                passcode: newPasscode,
            });
            if (!res) {
                return { success: false, message: "fail to add", status: "500" };
            }
            return { success: true, message: "Added", status: "200" };
        }
        catch (error) {
            return { success: false, status: "500" };
        }
    }
    async login_email(phoneOtp) {
        const { email, otp } = phoneOtp;
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.HttpException('Invalid credintials', common_1.HttpStatus.BAD_REQUEST);
        if (!bcrypt.compareSync(otp, user.passcode))
            throw new common_1.HttpException('Worng User Data', common_1.HttpStatus.BAD_REQUEST);
        const token = (0, jwtHandler_1.signJwtToken)({
            phoneNumber: user.phoneNumber,
            _id: user._id,
        });
        await this.userModel.findOneAndUpdate({ email }, { isLoginOtpUsed: true });
        return { token };
    }
    async sendXETH(email, amount) {
        const emailExist = await this.userModel.findOne({ _id: email });
        if (!emailExist) {
            throw new common_1.NotFoundException(`${email} is not listed`);
        }
        if (!emailExist.public_key) {
            throw new common_1.NotFoundException(` public key is not listed`);
        }
        const recipientPublicKey = emailExist.public_key;
        const server = new Stellar.Server('https://horizon-testnet.stellar.org');
        const senderSecretKey = 'SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ';
        const issuingAccountPublicKey = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
        const senderKeypair = Stellar.Keypair.fromSecret(senderSecretKey);
        const account = await server.loadAccount(senderKeypair.publicKey());
        const XETHAsset = new Stellar.Asset('XETH', issuingAccountPublicKey);
        const transaction = new Stellar.TransactionBuilder(account, {
            fee: Stellar.BASE_FEE,
            networkPassphrase: Stellar.Networks.TESTNET,
        })
            .addOperation(Stellar.Operation.payment({
            destination: recipientPublicKey,
            asset: XETHAsset,
            amount: amount,
        }))
            .setTimeout(30)
            .build();
        transaction.sign(senderKeypair);
        const transactionResult = await server.submitTransaction(transaction);
        console.log('Transaction Successful to : ', recipientPublicKey);
        throw new common_1.HttpException({ message: "true", res: transactionResult }, common_1.HttpStatus.ACCEPTED);
    }
    async XETH_Payout(email, amount, recipient) {
        const emailExist = await this.userModel.findOne({ _id: email });
        if (!emailExist) {
            throw new common_1.NotFoundException(`${email} is not listed`);
        }
        if (!emailExist.walletAddress) {
            throw new common_1.NotFoundException(` Ether public key is not listed`);
        }
        if (!amount) {
            throw new common_1.NotFoundException(`Amount require.`);
        }
        if (!recipient) {
            throw new common_1.NotFoundException(`recipient require.`);
        }
        else {
            const result = await this.payout_xeth(recipient, amount);
            return result;
        }
    }
    async payout_xeth(recipient, amountToTransfer) {
        try {
            const tx = await this.contract.connect(this.signer).payout(recipient, amountToTransfer);
            const receipt = await tx.wait();
            console.log('Payout successful', receipt);
            throw new common_1.HttpException({ status: receipt.status, transactionHash: receipt.transactionHash, Full_data: receipt }, 200);
        }
        catch (error) {
            console.error('Payout failed:', error.message);
            throw new common_1.HttpException(error, 400);
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
};
UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        redisHandler_1.RedisService,
        emailHandler_1.EmailService,
        adminWallets_service_1.AdminWalletsService,
        txFees_repository_1.TxFeeRepository,
        web3_service_1.ChainServices,
        mailer_1.MailerService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map