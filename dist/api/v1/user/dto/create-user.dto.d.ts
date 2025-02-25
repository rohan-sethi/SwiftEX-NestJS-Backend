export declare class CreateUserDto {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    walletAddress: string;
}
export declare class CreateGuestUserDto {
    deviceBrand?: string;
    deviceModel?: string;
    systemVersion?: string;
    deviceIP?: string;
    deviceType?: string;
    deviceMacAddress?: string;
    deviceUniqueID?: string;
}
export declare class UpdatePublicKey {
    publicKey: string;
    wallletPublicKey: string;
}
export declare class VerifyEmailDto {
    email: string;
    otp?: string;
}
export declare class PasscodeDTO {
    passcode: string;
}
