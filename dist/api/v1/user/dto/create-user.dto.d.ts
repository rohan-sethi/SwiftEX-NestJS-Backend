export declare class CreateUserDto {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    walletAddress: string;
}
export declare class UpdatePublicKey {
    publicKey: string;
}
export declare class VerifyEmailDto {
    email: string;
    otp?: string;
}
export declare class PasscodeDTO {
    passcode: string;
}
