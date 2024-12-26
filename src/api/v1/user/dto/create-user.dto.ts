import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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

export class UpdatePublicKey {
@IsNotEmpty()
@IsString()
@Matches(/^G[A-Z0-9]{55}$/, {
  message: 'Invalid Stellar public key format',
})
publicKey: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  otp?: string;
}

export class PasscodeDTO {
  @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    )
    passcode: string;
}