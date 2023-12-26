import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TX_NAME_ENUM } from 'src/utils/constants';

export type TxFeeDocument = HydratedDocument<TxFee>;

@Schema()
export class TxFee {
  _id?: string;

  @Prop({ required: true })
  chainId: number;

  @Prop({ required: true, enum: TX_NAME_ENUM})
  txName: string;

  @Prop({ required: true })
  gasFee: string;

  @Prop({ required: true })
  avgGasAmount: string;

  @Prop({ required: true })
  gasPriceInUsd: string;

  @Prop({ required: true })
  gasPriceInEth: string;
}

export const TxFeeSchema = SchemaFactory.createForClass(TxFee);
