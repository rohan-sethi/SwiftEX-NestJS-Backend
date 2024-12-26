import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MarketDataService } from '../services/market-data.service';
import { MarketData } from '../schema/market-data.schema';

@Controller('/market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('/getcryptodata')
  async findAll(): Promise<MarketData[]> {
    return this.marketDataService.findAll();
  }

}
