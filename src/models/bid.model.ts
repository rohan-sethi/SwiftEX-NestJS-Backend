import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { BID_STATUS_ENUM } from '../utils/constants';

export type BidDocument = HydratedDocument<Bid>;

@Schema()
export class Bid {
  _id: ObjectId;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  bidder: ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  offer: ObjectId;

  @Prop({ default: BID_STATUS_ENUM.ACTIVE, enum: BID_STATUS_ENUM })
  status?: string;

  @Prop({ type: Types.ObjectId, ref: 'Transaction' })
  acceptanceTx?: ObjectId;

  @Prop({ required: true })
  fcmRegTokens: string[];

  @Prop({ required: true })
  currencyName: string;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
