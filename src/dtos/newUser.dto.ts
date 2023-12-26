import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class NewUserDto {
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  walletAddress: string;
}
