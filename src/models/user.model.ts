import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  // @Prop({
  //   type: Types.ObjectId,
  //   index: true,
  //   required: true,
  //   auto: true,
  // })
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

  @Prop({ required: false, unique: true, sparse: true })
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

  @Prop({ required: false, unique: true })
  public_key: string;

  @Prop({ required: false, unique: true })
  secret_key: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
