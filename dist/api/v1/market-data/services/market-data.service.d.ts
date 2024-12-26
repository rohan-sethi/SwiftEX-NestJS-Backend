import { Model } from 'mongoose';
import { MarketData } from '../schema/market-data.schema';
export declare class MarketDataService {
    private readonly marketDataModel;
    private readonly logger;
    constructor(marketDataModel: Model<MarketData>);
    findAll(): Promise<MarketData[]>;
    getCryptoData(): Promise<void>;
    update_db(): Promise<any>;
    handleCron(): Promise<void>;
}
