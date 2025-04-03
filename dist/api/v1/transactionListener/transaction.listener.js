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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ContractTransactionListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTransactionListener = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const dotenv = __importStar(require("dotenv"));
const Stellar = __importStar(require("stellar-sdk"));
const mongoose_1 = require("mongoose");
const user_schema_1 = require("../user/schema/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
const notification_service_1 = require("../notification/service/notification.service");
dotenv.config();
let ContractTransactionListener = ContractTransactionListener_1 = class ContractTransactionListener {
    constructor(userModel, notificationService) {
        this.userModel = userModel;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(ContractTransactionListener_1.name);
        this.contractAddress = process.env.ETH_SMART_CONTRACT;
        this.StellarRpc = process.env.RPC_STELLAR;
        this.contractABI = [
            "event Transfer(address indexed from, address indexed to, uint256 value)"
        ];
        this.provider = new ethers_1.ethers.WebSocketProvider(process.env.ALCHEMY_PROVIDER_WEBSOCKET);
        this.contract = new ethers_1.ethers.Contract(this.contractAddress, this.contractABI, this.provider);
        this.server = new Stellar.Server(this.StellarRpc);
        Stellar.Network.useTestNetwork();
    }
    onModuleInit() {
        this.listenToEvents();
    }
    listenToEvents() {
        this.logger.log('Listening for EthReceived events...');
        this.contract.on('Transfer', (from, to, value, event) => {
            this.logger.log(`EthReceived Event:`);
            this.logger.log(`Sender: ${from}`);
            this.logger.log(`Amount: ${ethers_1.ethers.formatUnits(value, 6)} USDT} USDT`);
            this.logger.log('-----------------------------------');
            this.findUserByWallet(from, ethers_1.ethers.formatUnits(value, 6));
        });
    }
    async findUserByWallet(sender, amount) {
        const user = await this.userModel.findOne({ walletAddress: sender });
        if (!user) {
            this.logger.log(`User with wallet address not found`);
        }
        else {
            this.sendXLM(user.public_key, amount)
                .then(async () => {
                await this.notificationService.sendNotification(user.fcmRegTokens[0], 'Cross Chain', `Congratulations! ${amount} USDC has been successfully added to your wallet.`);
            })
                .catch((error) => {
                console.log("--->", error);
            });
        }
    }
    async sendXLM(destinationPublic, amount) {
        const sourceSecretKey = process.env.STELLAR_ONETAP_KEY;
        const sourceKeypair = Stellar.Keypair.fromSecret(sourceSecretKey);
        const res = this.server.loadAccount(sourceKeypair.publicKey())
            .then(account => {
            const newAsset = new Stellar.Asset('USDC', process.env.STELLAR_ONETAP_ISSUER);
            const transaction = new Stellar.TransactionBuilder(account, {
                fee: Stellar.BASE_FEE,
                networkPassphrase: Stellar.Networks.TESTNET
            })
                .addOperation(Stellar.Operation.payment({
                destination: destinationPublic,
                asset: newAsset,
                amount: amount,
            }))
                .setTimeout(30)
                .build();
            transaction.sign(sourceKeypair);
            const res = this.server.submitTransaction(transaction);
        })
            .then(result => {
            this.logger.log('Success! Result:');
            return { success: true, message: "Sended successfully" };
        })
            .catch(error => {
            this.logger.log('Error in sending funds:', error);
            return { success: false, message: "Error in sending funds" };
        });
    }
};
ContractTransactionListener = ContractTransactionListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        notification_service_1.NotificationService])
], ContractTransactionListener);
exports.ContractTransactionListener = ContractTransactionListener;
//# sourceMappingURL=transaction.listener.js.map