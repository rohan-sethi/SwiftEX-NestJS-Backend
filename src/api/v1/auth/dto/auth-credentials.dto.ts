import { IsEmail, IsString } from "class-validator";

export class AuthCredentialsDto {
  @IsEmail()
  email: string;
  @IsString()
  otp: string;
}

export class UserForgetDto {
  @IsEmail()
  email: string;
}