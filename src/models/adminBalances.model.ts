import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type BalanceDocument = HydratedDocument<Balance>;
export type AdminBalancesDocument = HydratedDocument<AdminBalances>;

@Schema()
export class Balance {
  _id?: ObjectId;

  @Prop({ required: true })
  assetName: string;

  @Prop({ required: true })
  chainId: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  balance: string;
}
export const BalanceSchema = SchemaFactory.createForClass(Balance);

@Schema()
export class HasEnoughFeeBalance {
  _id?: ObjectId;

  @Prop({ required: true })
  chainId: number;

  @Prop({ required: true, default: false })
  hasEnoughTxFeeBalance: boolean;
}
export const HasEnoughFeeBalanceSchema =
  SchemaFactory.createForClass(HasEnoughFeeBalance);

@Schema()
export class AdminBalances {
  _id?: ObjectId;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true, type: [{ type: HasEnoughFeeBalanceSchema }] })
  txFeeBalances: HasEnoughFeeBalance[];

  @Prop({ required: true, type: [{ type: BalanceSchema }] })
  balances: Balance[];
}

export const AdminBalancesSchema = SchemaFactory.createForClass(AdminBalances);
