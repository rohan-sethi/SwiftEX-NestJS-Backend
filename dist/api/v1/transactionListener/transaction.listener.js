"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ContractTransactionListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTransactionListener = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let ContractTransactionListener = ContractTransactionListener_1 = class ContractTransactionListener {
    constructor() {
        this.logger = new common_1.Logger(ContractTransactionListener_1.name);
        this.contractAddress = process.env.ETH_SMART_CONTRACT;
        this.contractABI = [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'EthReceived',
                type: 'event',
            },
        ];
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_WEBSOCKET);
        this.contract = new ethers_1.ethers.Contract(this.contractAddress, this.contractABI, this.provider);
    }
    onModuleInit() {
        this.listenToEvents();
    }
    listenToEvents() {
        this.logger.log('Listening for EthReceived events...');
        this.contract.on('EthReceived', (sender, amount, event) => {
            this.logger.log(`EthReceived Event:`);
            this.logger.log(`Sender: ${sender}`);
            this.logger.log(`Amount: ${ethers_1.ethers.formatUnits(amount, 'ether')} ETH`);
            this.logger.log(`Transaction Hash: ${event.transactionHash}`);
            this.logger.log('-----------------------------------');
        });
    }
};
ContractTransactionListener = ContractTransactionListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ContractTransactionListener);
exports.ContractTransactionListener = ContractTransactionListener;
//# sourceMappingURL=transaction.listener.js.map