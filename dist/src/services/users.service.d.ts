/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, ObjectId } from 'mongoose';
import { NewUserDto } from 'src/dtos/newUser.dto';
import { UserLoginDto } from 'src/dtos/userLogin.dto';
import { User, UserDocument } from 'src/models/user.model';
import Stripe from 'stripe';
import { phoneOtpDto } from 'src/dtos/phoneOtp.dto';
import { RedisService } from 'src/utils/redisHandler';
import { VerifyEmailDto } from 'src/dtos/verifyEmail.dto';
import { EmailService } from 'src/utils/emailHandler';
import { NewStripeAccountDto } from 'src/dtos/newStripeAccount.dto';
import { AdminWalletsService } from './adminWallets.service';
import { TxFeeRepository } from 'src/repositories/txFees.repository';
import { ChainServices } from './web3.service';
import { MailerService } from '@nestjs-modules/mailer';
import { SwapService } from './swap-allbrige';
export declare class UsersService {
    private userModel;
    private readonly redisService;
    private readonly emailService;
    private readonly adminWalletsService;
    private readonly txFeeRepository;
    private readonly chainServices;
    private readonly mailerService;
    private readonly swap_allbrige;
    private readonly redisClient;
    private readonly logger;
    private server;
    private senderKeypair;
    private readonly contractAddress;
    private readonly abi;
    private readonly privateKey;
    private provider;
    private signer;
    private contract;
    constructor(userModel: Model<UserDocument>, redisService: RedisService, emailService: EmailService, adminWalletsService: AdminWalletsService, txFeeRepository: TxFeeRepository, chainServices: ChainServices, mailerService: MailerService, swap_allbrige: SwapService);
    getAllUsers(): import("mongoose").Query<(import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    register(newUser: NewUserDto): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    getUserDetails(userId: any): import("mongoose").Query<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    userKycApply(userId: any): Promise<string>;
    forgot_email(credintails: UserLoginDto): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    verifyLoginOtp(phoneOtp: phoneOtpDto): Promise<{
        token: any;
    }>;
    createStripeAccount(userId: ObjectId, accountBody: NewStripeAccountDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getStripeAccount(userId: ObjectId): Promise<Stripe.Response<Stripe.Account>>;
    getStripeBalances(userId: ObjectId): Promise<Stripe.Response<Stripe.Balance>>;
    updateEmail(userId: ObjectId, newEmail: string): Promise<{
        success: boolean;
    }>;
    verifyUserEmail(userId: ObjectId, emailBody: VerifyEmailDto): Promise<{
        isVerified: boolean;
        otpSent?: undefined;
    } | {
        otpSent: boolean;
        isVerified?: undefined;
    }>;
    getInSynced(userId: ObjectId, fcmRegToken: string): Promise<{
        isInSynced: boolean;
    }>;
    syncDevice(userId: ObjectId, fcmRegToken: string): Promise<{
        success: boolean;
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
        upsertedCount: number;
        upsertedId: import("bson").ObjectID;
    }>;
    getAdminWallet(): {
        adminWalletAddress: string;
    };
    getTxFeeData(assetName: string, chainId: number): Promise<import("mongoose").Document<unknown, any, import("../models/txFees.model").TxFee> & import("../models/txFees.model").TxFee & Required<{
        _id: string;
    }>>;
    private _generateOtp;
    findByEmailAndUpdatePublicKey(email: ObjectId, newPublicKey: string): Promise<any>;
    findByEmailAndupdataPasscode(email: string, Passcode: string): Promise<{
        success: boolean;
        message: string;
        status: string;
    } | {
        success: boolean;
        status: string;
        message?: undefined;
    }>;
    login_email(phoneOtp: phoneOtpDto): Promise<{
        token: any;
    }>;
    sendXETH(email: ObjectId, amount: string): Promise<void>;
    XETH_Payout(email: ObjectId, amount: number, recipient: string): Promise<void>;
    report(data: JSON): Promise<any>;
    sendEmail(to: string, subject: string, text: string): Promise<any>;
}
