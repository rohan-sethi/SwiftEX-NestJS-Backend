/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
export declare class MarketData extends Document {
    MarketData: [
        {
            id: string;
            symbol: string;
            name: string;
            image: string;
            currentPrice: number;
            marketCap: number;
            marketCapRank: number;
            fullyDilutedValuation: number;
            totalVolume: number;
            high24h: number;
            low24h: number;
            priceChange24h: number;
            priceChangePercentage24h: number;
            marketCapChange24h: number;
            marketCapChangePercentage_24h: number;
            circulatingSupply: number;
            totalSupply: number;
            maxSupply: number;
            ath: number;
            athChangePercentage: number;
            athDate: string;
            atl: number;
            atlChangePercentage: number;
            atlDate: string;
            roi: object;
            lastUpdated: string;
        }
    ];
}
export declare const MarketDataSchema: import("mongoose").Schema<MarketData, import("mongoose").Model<MarketData, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketData>;
