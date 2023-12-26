import { IsOptional, IsString } from 'class-validator';

export class NewStripeAccountDto {
  @IsString()
  country: string;

  @IsString()
  currency: string;

  @IsString()
  account_number: string;

  @IsString()
  @IsOptional()
  routing_number?: string;
}
