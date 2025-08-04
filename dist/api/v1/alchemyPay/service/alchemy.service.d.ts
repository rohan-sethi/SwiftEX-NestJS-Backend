import { UrlSigner } from "../util/url.signer";
import { UrlExecuter } from "../util/ulr.executer";
export declare class AlchemyService {
    private readonly urlSigner;
    private readonly urlExecuter;
    private readonly logger;
    private readonly appId;
    private readonly appSecret;
    constructor(urlSigner: UrlSigner, urlExecuter: UrlExecuter);
    fetchQuotes(payload: JSON): Promise<{
        status: boolean;
        res: any;
    }>;
    userRegister(payload: any): Promise<{
        status: boolean;
        res: any;
    }>;
    userStatus(payload: any): Promise<{
        status: boolean;
        res: any;
    }>;
    orderCreate(payload: any, userEmail: string): Promise<{
        status: boolean;
        res: any;
    }>;
    sellOrderCreate(payload: any, userEmail: string): Promise<{
        status: boolean;
        res: string;
        servicePayload: {
            appId: string;
            timestamp: string;
            type: string;
            merchantOrderNo: number;
            crypto: any;
            network: any;
            cryptoAmount: any;
            fiat: any;
            country: string;
            email: string;
            redirectUrl: string;
            callbackUrl: string;
            language: string;
            showTable: string;
        };
    } | {
        status: boolean;
        res: any;
        servicePayload?: undefined;
    }>;
}
