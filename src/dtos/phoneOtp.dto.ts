import { IsNumberString, IsPhoneNumber } from 'class-validator';

export class phoneOtpDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNumberString()
  otp: string;
}
