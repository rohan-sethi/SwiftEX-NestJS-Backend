"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const marketdata_schema_1 = require("../models/marketdata.schema");
let MarketDataService = class MarketDataService {
    constructor(marketDataModel) {
        this.marketDataModel = marketDataModel;
    }
    async getCryptoData() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log("====", responseData);
                await this.update_db();
                const document = new this.marketDataModel({
                    MarketData: responseData,
                });
                await document.save()
                    .then(savedDocument => {
                    console.log('Document saved:', savedDocument);
                })
                    .catch(error => {
                    console.error('Error saving document:', error);
                });
                console.log("Crypto data saved successfully.");
            }
            else {
                console.error("Failed to fetch crypto data:", response.statusText);
            }
        }
        catch (error) {
            console.error("Error fetching crypto data:", error);
        }
    }
    startInterval() {
        const intervalDuration = 60 * 1000;
        setInterval(async () => {
            console.log('Interval tick');
            await this.getCryptoData();
        }, intervalDuration);
    }
    async onModuleInit() {
        await this.startInterval();
    }
    async update_db() {
        this.marketDataModel.deleteMany({});
        return this.marketDataModel.deleteMany({});
    }
    async findAll() {
        return await this.marketDataModel.find({});
    }
};
MarketDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(marketdata_schema_1.MarketData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MarketDataService);
exports.MarketDataService = MarketDataService;
//# sourceMappingURL=market-data.service.js.map