import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UserLoginDto {
  // @IsPhoneNumber()
  @IsEmail()
  email: string;
}
