import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MarketData extends Document {
  @Prop({ required: true, type: Array })
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

export const MarketDataSchema = SchemaFactory.createForClass(MarketData);
