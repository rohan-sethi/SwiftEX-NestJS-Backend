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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ListionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const stellar_sdk_1 = __importDefault(require("stellar-sdk"));
let ListionService = ListionService_1 = class ListionService {
    constructor() {
        this.logger = new common_1.Logger(ListionService_1.name);
        stellar_sdk_1.default.Network.useTestNetwork();
    }
    getHello() {
        return 'Hello World!';
    }
    async getCurrentPrice() {
        try {
            const response = await axios_1.default.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: 'stellar',
                    vs_currencies: 'usd',
                },
            });
            return response.data.stellar.usd;
        }
        catch (error) {
            throw new Error(`Error fetching XLM price: ${error.message}`);
        }
    }
    listenForTransactions() {
        const accountId = "GBCNZEEQXSVQ3O6DWJXAOVGUT3VRI2ZOU2JB4ZQC27SE3UU4BX7OZ5DN";
        const server = new stellar_sdk_1.default.Server('https://horizon-testnet.stellar.org');
        const transactionStream = server.transactions()
            .forAccount(accountId)
            .cursor('now')
            .stream({
            onmessage: (transaction) => {
                this.logger.log('Transaction Received:<>');
                this.logger.log(transaction);
                this.logger.log(transaction.memo);
            },
            onerror: (error) => {
                this.logger.error('Error in transaction stream:', error);
            },
        });
        this.logger.log(`Listening for transactions on account ${accountId}...`);
    }
};
ListionService = ListionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ListionService);
exports.ListionService = ListionService;
//# sourceMappingURL=listion.service.js.map