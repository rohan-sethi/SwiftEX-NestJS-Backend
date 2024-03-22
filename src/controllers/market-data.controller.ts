import { Controller, Get, Post, Body } from '@nestjs/common';
import { MarketData } from '../models/marketdata.schema';
import { MarketDataService } from '../services/market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}
 
  @Get("/getcryptodata")
  async get(){
    return this.marketDataService.findAll();
  }
}
