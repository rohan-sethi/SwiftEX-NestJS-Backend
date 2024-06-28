import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketData, MarketDataDocument } from '../models/marketdata.schema';

@Injectable()
export class MarketDataService {
  constructor(
    @InjectModel(MarketData.name) private readonly marketDataModel: Model<MarketDataDocument>,
  ) {}



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
        // console.log("====",responseData)
       await this.update_db();
        const document = new this.marketDataModel({
          MarketData: responseData,
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

  // startInterval(): void {
  //   const intervalDuration = 60 * 1000; // 1min
  //   setInterval(async() => {
  //      await this.getCryptoData();
  //   }, intervalDuration);
  // }
  // async onModuleInit() {
  //   await this.startInterval();
  // }



  
  async update_db(): Promise<any> {
    return this.marketDataModel.deleteMany({})
    // return createdMarketData.save();
  }

  async findAll(): Promise<MarketData[]> {
    // await this.getCryptoData()
    return await this.marketDataModel.find({})
  }
}



