import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { TRANSACTION_STATUS_ENUM } from 'src/utils/constants';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  _id?: ObjectId;
  createdAt?: number;
  updatedAt?: number;

  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ required: true, unique: true })
  sessionUrl: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  customerId: ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Offer' })
  offerId: ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Bid' })
  bidId: ObjectId;

  @Prop({ required: true })
  assetName: string;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  appFee: number;

  @Prop({ required: true })
  transactionFee: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  assetOwner: ObjectId;

  @Prop()
  cryptoTxHash?: string;

  @Prop()
  chainId: number;

  @Prop({
    default: TRANSACTION_STATUS_ENUM.PAYMENT_PENDING,
    enum: TRANSACTION_STATUS_ENUM,
  })
  status?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
