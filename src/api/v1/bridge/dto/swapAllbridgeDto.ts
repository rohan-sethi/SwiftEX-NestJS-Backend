import { IsNotEmpty, IsString, IsEthereumAddress, Matches } from 'class-validator';
import { IsValidToken } from '../validations/validations_token';


export class swapAllbridgeDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  fromAddress: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^G[A-Z0-9]{55}$/, {
    message: 'Invalid Stellar public key format',
  })
  toAddress: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  @IsValidToken({ message: 'Invalid sourceToken for the given walletType.' })
  sourceToken: string;

  @IsNotEmpty()
  @IsString()
  @IsValidToken({ message: 'Invalid destinationToken for the given walletType.' })
  destinationToken: string;

  @IsNotEmpty()
  @IsString()
  walletType: string;
}

