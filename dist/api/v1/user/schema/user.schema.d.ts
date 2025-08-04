import mongoose, { Document, ObjectId } from "mongoose";
export declare class User extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
    loginOtp: string;
    loginOtpUpdatedAt?: number;
    walletAddress: string;
    isVerified: boolean;
    stripeAccountId?: string;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    isEmailVerified?: boolean;
    isLoginOtpUsed?: boolean;
    fcmRegTokens?: string[];
    public_key: string;
    userAddress: Object;
    passcode: string;
    SubscriptionId: mongoose.Schema.Types.ObjectId;
    SubscriptionExpire: string;
    DeviceInfo: Object;
    streamId?: string;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User>;
