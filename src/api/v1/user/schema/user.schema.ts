import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false, unique: true, sparse: true })
  email?: string; 

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  loginOtp: string;

  @Prop({ required: false })
  loginOtpUpdatedAt?: number;

  @Prop({ required: true })
  walletAddress: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false, sparse: true, default: null })
  stripeAccountId?: string;

  @Prop({ required: false, default: false })
  chargesEnabled?: boolean;

  @Prop({ required: false, default: false })
  payoutsEnabled?: boolean;

  @Prop({ required: false, default: false })
  isEmailVerified?: boolean;

  @Prop({ required: false, default: false })
  isLoginOtpUsed?: boolean;

  @Prop()
  fcmRegTokens?: string[];

  @Prop({ required: false })
  public_key: string;

  @Prop({ required: false, type: Object, default: null })
  userAddress: Object;

  @Prop({ required: false })
  passcode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null })
  SubscriptionId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: null })
  SubscriptionExpire: string;

  @Prop({ type: Object })
  DeviceInfo:Object;
}

export const UserSchema = SchemaFactory.createForClass(User);
