import { IsNumberString } from 'class-validator';

export class OfferUpdateDto {
  @IsNumberString()
  pricePerUnit: string;
}
