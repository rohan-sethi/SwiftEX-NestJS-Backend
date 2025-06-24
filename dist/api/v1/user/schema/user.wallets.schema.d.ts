import mongoose, { Document, ObjectId } from "mongoose";
export declare enum WalletStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
declare class WalletAddress {
    multichainAddress: string;
    multichainStatus: WalletStatus;
    stellarAddress: string;
    stellarStatus: WalletStatus;
}
export declare class UserWallet extends Document {
    _id: ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    allWalletAddress: WalletAddress[];
}
export declare const UserWalletSchema: mongoose.Schema<UserWallet, mongoose.Model<UserWallet, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserWallet>;
export {};
