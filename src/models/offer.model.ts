import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { OFFER_STATUS_ENUM } from 'src/utils/constants';

export type OfferDocument = HydratedDocument<Offer>;

@Schema()
export class Offer {
  _id: ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  assetName: string;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  issuer: ObjectId;

  @Prop({ type: [Types.ObjectId], required: false, ref: 'Bid' })
  bids?: Array<ObjectId>;

  @Prop({ type: Types.ObjectId, required: false, ref: 'Bid' })
  winnerBid?: ObjectId;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  appFee: number;

  @Prop({ required: true })
  currencyName: string;

  @Prop({ required: true })
  chainName: string;

  @Prop({ required: true })
  chainId: number;

  @Prop({ required: false })
  failureReason?: string;

  @Prop({ required: true, unique: true })
  blockchainTxHash: string;

  @Prop({
    default: OFFER_STATUS_ENUM.ACTIVE,
    enum: OFFER_STATUS_ENUM,
  })
  status: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
