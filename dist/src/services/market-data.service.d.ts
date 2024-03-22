import { Model } from 'mongoose';
import { MarketData, MarketDataDocument } from '../models/marketdata.schema';
export declare class MarketDataService {
    private readonly marketDataModel;
    constructor(marketDataModel: Model<MarketDataDocument>);
    getCryptoData(): Promise<void>;
    create(marketData: MarketData): Promise<MarketData>;
    findAll(): Promise<MarketData[]>;
}
