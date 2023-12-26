"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetToUsd = void 0;
const axios_1 = __importDefault(require("axios"));
const redisHandler_1 = require("./redisHandler");
const redisHandler = new redisHandler_1.RedisService();
const redisClient = redisHandler.getClient();
const getAssetToUsd = async (assetId) => {
    const cashedPrice = Number(await redisClient.get(assetId));
    if (cashedPrice)
        return cashedPrice;
    const { data: { [assetId]: { usd }, }, } = await axios_1.default.get(`${process.env.COIN_GECKO_SIMPLE_PRICE_URL}?ids=${assetId}&vs_currencies=usd`);
    redisClient.set(assetId, usd, 'EX', 300);
    return usd;
};
exports.getAssetToUsd = getAssetToUsd;
//# sourceMappingURL=getAssetPrice.js.map