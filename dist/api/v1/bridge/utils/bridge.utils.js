"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeUtils = void 0;
const common_1 = require("@nestjs/common");
const bridge_core_sdk_1 = require("@allbridge/bridge-core-sdk");
let BridgeUtils = class BridgeUtils {
    constructor() {
        this.ETHRPC = process.env.ETH_PROVIDER_NEW;
    }
    async getSwapDetails(amount, chainType) {
        try {
            const sdk = new bridge_core_sdk_1.AllbridgeCoreSdk({ ETH: this.ETHRPC });
            const chains = await sdk.chainDetailsMap();
            if (chainType !== "ETH" && chainType !== "BSC") {
                throw new common_1.HttpException('Wrong Chain', common_1.HttpStatus.BAD_REQUEST);
            }
            const sourceChain = chainType == "ETH" ? chains[bridge_core_sdk_1.ChainSymbol.ETH] : chains[bridge_core_sdk_1.ChainSymbol.BSC];
            const destinationChain = chains[bridge_core_sdk_1.ChainSymbol.SRB];
            if (!sourceChain || !destinationChain) {
                throw new common_1.HttpException('Chain details not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const sourceToken = sourceChain.tokens.find(token => token.symbol === 'USDT');
            const destinationToken = destinationChain.tokens.find(token => token.symbol === 'USDC');
            if (!sourceToken || !destinationToken) {
                throw new common_1.HttpException('Token not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const minimumReceiveAmount = await sdk.getAmountToBeReceived(amount, sourceToken, destinationToken, bridge_core_sdk_1.Messenger.ALLBRIDGE);
            const conversionRate = (parseFloat(minimumReceiveAmount) / parseFloat(amount)).toFixed(12);
            const slippageTolerance = "1";
            const result = {
                conversionRate,
                minimumAmountOut: minimumReceiveAmount,
                slippageTolerance,
            };
            return new common_1.HttpException(result, common_1.HttpStatus.OK);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
BridgeUtils = __decorate([
    (0, common_1.Injectable)()
], BridgeUtils);
exports.BridgeUtils = BridgeUtils;
//# sourceMappingURL=bridge.utils.js.map