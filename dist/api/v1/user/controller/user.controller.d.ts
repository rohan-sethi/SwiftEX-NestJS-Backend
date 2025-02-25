import { HttpStatus } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateGuestUserDto, CreateUserDto, PasscodeDTO, UpdatePublicKey, VerifyEmailDto } from '../dto/create-user.dto';
import { User } from '../schema/user.schema';
import { FcmTokenDto, OtpDto } from '../dto/update-user.dto';
import mongoose from 'mongoose';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(newUser: CreateUserDto): Promise<{
        token: string;
        message: string;
    }>;
    guestRegister(newUser: CreateGuestUserDto): Promise<{
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
    forgot_passcode(credintials: UserForgetDto): Promise<User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    verifyLoginOtp(req: any, credintials: OtpDto): Promise<{
        token: string;
    }>;
    getUserDetails(req: any): Promise<User>;
    updatePublicKeyByEmail(req: any, publicKey: UpdatePublicKey): Promise<any>;
    updatePublicKey(req: any, publicKey: UpdatePublicKey): Promise<{
        success: boolean;
        message: string;
        status_code: HttpStatus;
    } | {
        success: boolean;
        message: string;
    }>;
    verifyUserEmail(req: any, emailBody: VerifyEmailDto): Promise<{
        otpSent: boolean;
    }>;
    getInSynced(fcmRegToken: string, req: any): Promise<{
        isInSynced: boolean;
    }>;
    syncDevice(req: any, FcmTokenbody: FcmTokenDto): Promise<{
        success: boolean;
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
        upsertedCount: number;
        upsertedId: import("bson").ObjectID;
    }>;
    updatePasscode(req: any, { passcode }: PasscodeDTO): Promise<{
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
    userKycApply(req: any): Promise<string>;
    handleStripeAccount(req: any): Promise<any>;
    handleJson(jsonData: any): Promise<any>;
}
