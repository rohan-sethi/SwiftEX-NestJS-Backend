import { IsNumberString } from 'class-validator';

export class UpdateBidDto {
  @IsNumberString()
  pricePerUnit: number;
}
