import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdatePublicKey {
    @IsNotEmpty()
    @IsString()
    @Matches(/^G[A-Z0-9]{55}$/, {
        message: 'Invalid Stellar public key format',
    })
    publicKey: string;

}