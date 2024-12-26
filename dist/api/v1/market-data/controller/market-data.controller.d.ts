import { MarketDataService } from '../services/market-data.service';
import { MarketData } from '../schema/market-data.schema';
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    findAll(): Promise<MarketData[]>;
}
