import { UrlSigner } from './url.signer';
export declare class UrlExecuter {
    private readonly urlSigner;
    private readonly logger;
    private readonly appId;
    constructor(urlSigner: UrlSigner);
    getAlchemyQuotes(timestamp: any, body: any, signKey: any, method: any, url: any): Promise<any>;
    alchemyUserRegister(timestamp: any, body: any, signKey: any, method: any, url: any): Promise<any>;
    authRequest(timestamp: any, body: any, signKey: any, method: any, url: any, userEmail: any): Promise<any>;
}
