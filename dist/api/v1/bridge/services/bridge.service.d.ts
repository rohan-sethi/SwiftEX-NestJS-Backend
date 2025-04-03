import { HttpException } from '@nestjs/common';
export declare class SwapService {
    private sdk;
    constructor();
    fetch_tokens(source_token: string, wallet_type: string): Promise<{
        result: any;
        status_opt: boolean;
    }>;
    swap_prepare(fromAddress: string, toAddress: string, amount: string, source_token: string, destination_token: string, wallet_type: string): Promise<HttpException>;
    swap_execute(fromAddress: string, toAddress: string, amount: string, source_token: string, destination_token: string, wallet_type: string): Promise<HttpException>;
}
