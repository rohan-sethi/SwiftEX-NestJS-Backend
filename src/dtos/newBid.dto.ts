import {
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class NewBidDto {
  @IsNotEmpty()
  @IsNumberString()
  pricePerUnit: number;

  @IsNotEmpty()
  offer: ObjectId;

  @IsString()
  currencyName: string;
}
