import { IsEmail, IsOptional, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  otp?: string;
}
