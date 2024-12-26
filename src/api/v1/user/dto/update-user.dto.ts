import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsString()
  stripeAccountId?: string;

  @IsOptional()
  @IsString()
  public_key?: string;
}

export class OtpDto {
  @IsString()
  otp:string;
}

export declare class FcmTokenDto {
  fcmRegToken: string;
  deviceInfo:object;
}