/// <reference types="express" />
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
import { ObjectId } from 'mongoose';
import { BidSyncBodyDto } from 'src/dtos/bidSyncBody.dto';
import { NewStripeAccountDto } from 'src/dtos/newStripeAccount.dto';
import { NewUserDto } from 'src/dtos/newUser.dto';
import { phoneOtpDto } from 'src/dtos/phoneOtp.dto';
import { UpdateEmailDto } from 'src/dtos/updateEmail.dto';
import { UserLoginDto } from 'src/dtos/userLogin.dto';
import { VerifyEmailDto } from 'src/dtos/verifyEmail.dto';
import { UsersService } from 'src/services/users.service';
import { Stripe } from 'stripe';
export declare class UsersController {
    private readonly UsersService;
    private stripe;
    constructor(UsersService: UsersService);
    getAllUsers(): import("mongoose").Query<(import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    register(newUser: NewUserDto): Promise<import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    getUserDetails(userId: any): Promise<import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    userKycApply(userId: ObjectId): Promise<string>;
    login(credintials: phoneOtpDto): Promise<{
        token: any;
    }>;
    forgot_passcode(credintials: UserLoginDto): Promise<import("mongoose").Document<unknown, any, import("../models/user.model").User> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    verifyLoginOtp(credintials: phoneOtpDto): Promise<{
        token: any;
    }>;
    createStripeAccount(accountBody: NewStripeAccountDto, userId: ObjectId): Promise<{
        success: boolean;
        message: string;
    }>;
    getStripeAccount(userId: ObjectId): Promise<Stripe.Response<Stripe.Account>>;
    getStripeBalances(userId: ObjectId): Promise<Stripe.Response<Stripe.Balance>>;
    verifyUserEmail(userId: ObjectId, emailBody: VerifyEmailDto): Promise<{
        isVerified: boolean;
        otpSent?: undefined;
    } | {
        otpSent: boolean;
        isVerified?: undefined;
    }>;
    updateEmail(userId: ObjectId, emailBody: UpdateEmailDto): Promise<{
        success: boolean;
    }>;
    getInSynced(fcmRegToken: string, userId: ObjectId): Promise<{
        isInSynced: boolean;
    }>;
    syncDevice(userId: ObjectId, bidSyncBody: BidSyncBodyDto): Promise<{
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
    create(postData: any): {
        message: string;
        data: any;
    };
    updatePublicKeyByEmail(email: string, newPublicKey: string): Promise<any>;
    updatePasscode(email: string, passcode: string): Promise<{
        success: boolean;
        message: string;
        status: string;
    } | {
        success: boolean;
        status: string;
        message?: undefined;
    }>;
    SendXETH(email: string, amount: string): Promise<import("express").Response<any, Record<string, any>>>;
    GOVINDU(): Promise<import("express").Response<any, Record<string, any>>>;
}
