import axios from 'axios';
import { RedisService } from './redisHandler';

const redisHandler = new RedisService();
const redisClient = redisHandler.getClient();

export const getAssetToUsd = async (assetId: string): Promise<number> => {
  const cashedPrice: number = Number(await redisClient.get(assetId))
  if(cashedPrice) return cashedPrice

  const {
    data: {
      [assetId]: { usd },
    },
  } = await axios.get(
    `${process.env.COIN_GECKO_SIMPLE_PRICE_URL}?ids=${assetId}&vs_currencies=usd`,
  );

  redisClient.set(assetId, usd, 'EX', 300);

  return usd;
};
