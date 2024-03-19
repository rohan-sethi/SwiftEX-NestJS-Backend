import { IsEmail, IsNumberString, IsPhoneNumber, IsString } from 'class-validator';

export class phoneOtpDto {
  // @IsPhoneNumber()
  // phoneNumber: string;

  // @IsNumberString()
  // otp: string;

  @IsEmail()
  email: string;

  @IsString()
  otp:string;
   
}
