import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
export declare type MarketDataDocument = HydratedDocument<MarketData>;
export declare class MarketData {
    MarketData: [
        {
            id: string;
            symbol: string;
            name: string;
            image: string;
            current_price: number;
            market_cap: number;
            market_cap_rank: number;
            fully_diluted_valuation: number;
            total_volume: number;
            high_24h: number;
            low_24h: number;
            price_change_24h: number;
            price_change_percentage_24h: number;
            market_cap_change_24h: number;
            market_cap_change_percentage_24h: number;
            circulating_supply: number;
            total_supply: number;
            max_supply: number;
            ath: number;
            ath_change_percentage: number;
            ath_date: string;
            atl: number;
            atl_change_percentage: number;
            atl_date: string;
            roi: object;
            last_updated: string;
        }
    ];
}
export declare const MarketDataSchema: mongoose.Schema<MarketData, mongoose.Model<MarketData, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MarketData>;
