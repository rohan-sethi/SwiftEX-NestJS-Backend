import { MarketData } from '../models/marketdata.schema';
import { MarketDataService } from '../services/market-data.service';
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    get(): Promise<MarketData[]>;
}
