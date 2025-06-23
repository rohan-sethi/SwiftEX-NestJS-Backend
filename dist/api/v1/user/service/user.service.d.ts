import { HttpStatus } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { User } from '../schema/user.schema';
import { CreateGuestUserDto, CreateUserDto, VerifyEmailDto } from '../dto/create-user.dto';
import { OtpDto } from '../dto/update-user.dto';
import { EmailService } from '../../utils/email.service';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationService } from '../../notification/service/notification.service';
import { AlchemyService } from '../../alchemyPay/service/alchemy.service';
import { SorobanHooksService } from '../../notification/service/sorobanHooks.service';
export declare class UserService {
    private userModel;
    private readonly emailService;
    private readonly mailerService;
    private readonly notificationService;
    private readonly alchemyService;
    private readonly sorobanHooksService;
    private readonly logger;
    constructor(userModel: Model<User>, emailService: EmailService, mailerService: MailerService, notificationService: NotificationService, alchemyService: AlchemyService, sorobanHooksService: SorobanHooksService);
    guestRegister(CreateGuestUserDto: CreateGuestUserDto): Promise<{
        success: boolean;
        message: string;
        status: number;
        token: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        status: number;
        error: any;
        token?: undefined;
    }>;
    register(CreateUserDto: CreateUserDto): Promise<{
        token: string;
        message: string;
    }>;
    private _generateOtp;
    forgotEmail(credintails: UserForgetDto): Promise<User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    verifyLoginOtp(userId: ObjectId, phoneOtp: OtpDto): Promise<{
        token: string;
    }>;
    verifyUserEmail(userId: ObjectId, emailBody: VerifyEmailDto): Promise<{
        otpSent: boolean;
    }>;
    getInSynced(userId: ObjectId, fcmRegToken: string): Promise<{
        isInSynced: boolean;
    }>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    findAndUpdatePublicKey(id: string, newPublicKey: any, newWalletPublicKey: any): Promise<{
        success: boolean;
        message: string;
        resXdr: any;
        status_code: HttpStatus;
    } | {
        success: boolean;
        message: string;
        status_code: HttpStatus;
        resXdr?: undefined;
    }>;
    UpdatePublicKey(id: string, newPublicKey: any, newWalletPublicKey: any): Promise<{
        success: boolean;
        message: string;
        status_code: HttpStatus;
    }>;
    findByEmailAndupdataPasscode(userId: ObjectId, passcode: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        token?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        status: number;
        token: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        status: number;
        error: any;
        token?: undefined;
    }>;
    report(data: JSON): Promise<any>;
    sendEmail(to: string, subject: string, text: string): Promise<any>;
    getStripeAccount(userId: ObjectId): Promise<any>;
    syncDevice(userId: ObjectId, fcmRegToken: string, deviceInfo: object): Promise<{
        success: boolean;
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
        upsertedCount: number;
        upsertedId: import("bson").ObjectID;
    }>;
    userKycApply(userId: any): Promise<string>;
    fetchAlchemyQuotes(userId: ObjectId, payload: any): Promise<any>;
    userRegisterForAlchemy(userId: ObjectId, businessSubType: string): Promise<any>;
    userKycStatus(userId: ObjectId): Promise<any>;
    alchemyOrder(userId: ObjectId, requestPayload: any): Promise<any>;
    alchemySellOrderCreate(userId: ObjectId, requestPayload: any): Promise<any>;
}
