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
import { User } from '../schema/user.schema';
import { CreateUserDto, VerifyEmailDto } from '../dto/create-user.dto';
import { OtpDto } from '../dto/update-user.dto';
import { EmailService } from '../../utils/email.service';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationService } from '../../notification/service/notification.service';
export declare class UserService {
    private userModel;
    private readonly emailService;
    private readonly mailerService;
    private readonly notificationService;
    private readonly logger;
    constructor(userModel: Model<User>, emailService: EmailService, mailerService: MailerService, notificationService: NotificationService);
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
    findAndUpdatePublicKey(id: string, newPublicKey: any): Promise<any>;
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
}
