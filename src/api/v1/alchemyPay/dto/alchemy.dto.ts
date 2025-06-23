import { IsEthereumAddress, IsIn, IsNotEmpty, IsString } from "class-validator";

export class conversionQuote {
    @IsNotEmpty()
    @IsString()
    crypto: string;

    @IsNotEmpty()
    @IsString()
    network: string;

    @IsNotEmpty()
    @IsString()
    fiat: string;

    @IsNotEmpty()
    @IsString()
    amount: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['BUY', 'SELL'], {
        message: 'wrong sideType',
    })
    side: string;
}

export class alchemyUserKyc {
@IsNotEmpty()
@IsString()
@IsIn(['BUY', 'SELL'], {
    message: 'wrong businessSubType',
})
businessSubType: string;
}

export class alchemyCreateOrder {
    @IsNotEmpty()
    @IsString()
    @IsIn(['BUY', 'SELL'], {
        message: 'wrong sideType',
    })
    side: string;

    @IsNotEmpty()
    @IsString()
    amount: string;

    @IsNotEmpty()
    @IsString()
    fiat: string;

    @IsNotEmpty()
    @IsString()
    crypto: string;
    
    @IsNotEmpty()
    @IsString()
    @IsEthereumAddress()
    address:string;

    @IsNotEmpty()
    @IsString()
    network: string;

    @IsNotEmpty()
    @IsString()
    payWayCode: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['4', '6'], {
        message: 'wrong order type onramp: 4 / offramp: 6',
    })
    orderType: string;

    @IsString()
    memo: string;
}

export class alchemySellOrderDto {
    @IsNotEmpty()
    @IsString()
    amount: string;

    @IsNotEmpty()
    @IsString()
    fiat: string;

    @IsNotEmpty()
    @IsString()
    crypto: string;

    @IsNotEmpty()
    @IsString()
    network: string;
}