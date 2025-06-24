import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";


export enum WalletStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@Schema()
class WalletAddress {
    @Prop()
    multichainAddress: string;

    @Prop({ enum: WalletStatus })
    multichainStatus: WalletStatus;

    @Prop()
    stellarAddress: string;

    @Prop({ enum: WalletStatus })
    stellarStatus: WalletStatus;
}
const WalletAddressSchema = SchemaFactory.createForClass(WalletAddress);


@Schema({collection: 'userWallets', timestamps: true })
export class UserWallet extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [WalletAddressSchema] })
    allWalletAddress: WalletAddress[];

}

export const UserWalletSchema = SchemaFactory.createForClass(UserWallet);
