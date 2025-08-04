import { HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateGuestUserDto, CreateUserDto, PasscodeDTO, UpdatePublicKey, UpdatePublicKeyNew, VerifyEmailDto } from '../dto/create-user.dto';
import { User } from '../schema/user.schema';
import { FcmTokenDto, OtpDto } from '../dto/update-user.dto';
import mongoose from 'mongoose';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
import { swapAllbridgeDto } from '../../bridge/dto/swapAllbridgeDto';
import { SwapService } from '../../bridge/services/bridge.service';
import { BridgeUtils } from '../../bridge/utils/bridge.utils';
import { bridgeUtilsDto } from '../../bridge/dto/bridgeUtilsDto';
import { alchemyCreateOrder, alchemySellOrderDto, alchemyUserKyc, conversionQuote } from '../../alchemyPay/dto/alchemy.dto';
export declare class UserController {
    private readonly userService;
    private readonly swapService;
    private readonly bridgeUtils;
    constructor(userService: UserService, swapService: SwapService, bridgeUtils: BridgeUtils);
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
    updatePublicKeyByEmail(req: any, publicKey: UpdatePublicKey): Promise<{
        success: boolean;
        message: string;
        resXdr: any;
        status_code: HttpStatus;
    } | {
        success: boolean;
        message: string;
        status_code: HttpStatus;
        resXdr?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    updatePublicKey(req: any, publicKey: UpdatePublicKeyNew): Promise<{
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
    prepare_swap(body: swapAllbridgeDto): Promise<HttpException>;
    execute_swap(body: swapAllbridgeDto): Promise<HttpException>;
    getSwapDetails(query: bridgeUtilsDto): Promise<HttpException>;
    getAlchemyQuotes(query: conversionQuote, req: any): Promise<any>;
    alchemyUserRegister(query: alchemyUserKyc, req: any): Promise<any>;
    alchemyKycStatus(req: any): Promise<any>;
    orderCreate(query: alchemyCreateOrder, req: any): Promise<any>;
    sellOrder(query: alchemySellOrderDto, req: any): Promise<any>;
    fetchOrders(req: any): Promise<any>;
}
