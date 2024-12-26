import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketData, MarketDataSchema } from './schema/market-data.schema';
import { MarketDataController } from './controller/market-data.controller';
import { MarketDataService } from './services/market-data.service';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: MarketData.name, schema: MarketDataSchema }]),
  ],
  controllers: [MarketDataController],
  providers: [MarketDataService],
})
export class MarketDataModule {}
