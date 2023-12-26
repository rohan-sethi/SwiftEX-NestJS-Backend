import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
} from 'class-validator';

export class NewOfferDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: number;

  @IsNotEmpty()
  @IsString()
  assetName: string;

  // @IsNotEmpty()
  // @IsNumberString()
  // pricePerUnit: number;

  @IsObject()
  signedTx: object;

  @IsString()
  currencyName: string;

  @IsNumber()
  chainId: number;
}
