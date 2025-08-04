import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketData } from '../schema/market-data.schema';
import { Cron } from '@nestjs/schedule';
import { transformMarketInfo } from '../../utils/transform.marketInfo';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  constructor(
    @InjectModel(MarketData.name) private readonly marketDataModel: Model<MarketData>,
  ) { }

  async findAll(): Promise<MarketData[]> {
    return this.marketDataModel.find().exec();
  }

  async getCryptoData(): Promise<void> {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const transformedResponse = transformMarketInfo(responseData);
        await this.update_db();
        const document = new this.marketDataModel({
          MarketData: transformedResponse,
        })
        await document.save()
          .then(savedDocument => {
            // console.log('Document saved:', savedDocument);
          })
          .catch(error => {
            console.error('Error saving document:', error);
          });

        // await this.marketDataModel.create({responseData});
        console.log("Crypto data saved successfully.");
      } else {
        console.error("Failed to fetch crypto data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  }

  async update_db(): Promise<any> {
    return this.marketDataModel.deleteMany({})
  }
  ///Update market data
  @Cron('* * * * *')
  async handleCron(): Promise<void> {
    this.logger.log('Cron job running...');
    await this.getCryptoData();
  }

}
