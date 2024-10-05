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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapService = void 0;
const common_1 = require("@nestjs/common");
const bridge_core_sdk_1 = require("@allbridge/bridge-core-sdk");
let SwapService = class SwapService {
    constructor() {
        this.sdk = new bridge_core_sdk_1.AllbridgeCoreSdk({
            ETH: process.env.ETH_PROVIDER_NEW,
        });
    }
    async fetch_tokens(source_token, wallet_type) {
        try {
            const chains = await this.sdk.chainDetailsMap();
            if (wallet_type === "Ethereum") {
                const { tokens } = chains[bridge_core_sdk_1.ChainSymbol.ETH];
                const res_Token = tokens.find(token => token.symbol === source_token);
                return {
                    result: res_Token,
                    status_opt: true
                };
            }
            if (wallet_type === "BNB") {
                const { tokens } = chains[bridge_core_sdk_1.ChainSymbol.BSC];
                const res_Token = tokens.find(token => token.symbol === source_token);
                return {
                    result: res_Token,
                    status_opt: true
                };
            }
            if (wallet_type === "Stellar") {
                const { tokens } = chains[bridge_core_sdk_1.ChainSymbol.STLR];
                const res_Token = tokens.find(token => token.symbol === source_token);
                return {
                    result: res_Token,
                    status_opt: true
                };
            }
        }
        catch (error) {
            console.log("Error - fetch-tokens : ", error);
            return {
                result: error,
                status_opt: false
            };
        }
    }
    async swap_prepare(fromAddress, toAddress, amount, source_token, destination_token, wallet_type) {
        try {
            const sourceToken = await this.fetch_tokens(source_token, wallet_type);
            if (!(await this.sdk.bridge.checkAllowance({ token: sourceToken.result, owner: fromAddress, amount: amount }))) {
                const rawTransactionApprove = (await this.sdk.bridge.rawTxBuilder.approve({
                    token: sourceToken.result,
                    owner: fromAddress,
                }));
                return new common_1.HttpException({ res: rawTransactionApprove, status_swap: true }, common_1.HttpStatus.CREATED);
            }
        }
        catch (error) {
            console.error("Error in swap_prepare:", error);
            throw new common_1.HttpException({ res: error, status_swap: false }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async swap_execute(fromAddress, toAddress, amount, source_token, destination_token, wallet_type) {
        try {
            const sourceToken = await this.fetch_tokens(source_token, wallet_type);
            const destinationToken = await this.fetch_tokens(destination_token, "Stellar");
            if (sourceToken.status_opt === true && destinationToken.status_opt === true) {
                const rawTransactionTransfer = (await this.sdk.bridge.rawTxBuilder.send({
                    amount: amount,
                    fromAccountAddress: fromAddress,
                    toAccountAddress: toAddress,
                    sourceToken: sourceToken.result,
                    destinationToken: destinationToken.result
                }));
                return new common_1.HttpException({ res: rawTransactionTransfer, status_swap: true }, common_1.HttpStatus.OK);
            }
            else {
                throw new common_1.HttpException({ res: "token not found:- ", status_swap: false }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            console.error("Error in swap_execution:", error);
            throw new common_1.HttpException({ res: error, status_swap: false }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
SwapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SwapService);
exports.SwapService = SwapService;
//# sourceMappingURL=swap-allbrige.js.map