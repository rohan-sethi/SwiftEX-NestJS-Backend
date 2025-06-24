/// <reference types="node" />
export declare class WalletNotificationService {
    private readonly logger;
    constructor();
    addWalletWatcher(apiInfo: any, stellarWalletAddress: string, walletAddress: string, userFCM: string): Promise<any>;
    getSecretKey(): Promise<Buffer>;
    encryptMessageToString(payload: any): Promise<string>;
}
