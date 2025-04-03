import { IsNotEmpty, IsString } from "class-validator";

export class bridgeUtilsDto {
    @IsNotEmpty()
    @IsString()
    amount: string;

    @IsNotEmpty()
    @IsString()
    chainType: string;
}