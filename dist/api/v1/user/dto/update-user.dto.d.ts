export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    walletAddress?: string;
    stripeAccountId?: string;
    public_key?: string;
}
export declare class OtpDto {
    otp: string;
}
export declare class FcmTokenDto {
    fcmRegToken: string;
    deviceInfo: object;
}
