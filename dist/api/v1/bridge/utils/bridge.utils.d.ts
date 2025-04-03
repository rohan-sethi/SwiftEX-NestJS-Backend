import { HttpException } from '@nestjs/common';
export declare class BridgeUtils {
    private readonly ETHRPC;
    getSwapDetails(amount: string, chainType: string): Promise<HttpException>;
}
