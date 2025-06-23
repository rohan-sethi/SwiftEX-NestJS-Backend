export declare class UrlSigner {
    private readonly logger;
    private readonly alchemyKey;
    constructor();
    apiSign(timestamp: string, method: string, requestUrl: string, body: string, secretKey: string): string;
    private getPath;
    private getJsonBody;
    private removeEmptyKeys;
    private sortObject;
    private sortMap;
    private sortList;
    payloadGenrator(apiPayload: any, method: string, requestUrl: string): Promise<any>;
}
