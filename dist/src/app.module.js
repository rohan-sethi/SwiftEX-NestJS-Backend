"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bids_controller_1 = require("./controllers/bids.controller");
const offers_controller_1 = require("./controllers/offers.controller");
const transactions_controller_1 = require("./controllers/transactions.controller");
const users_controller_1 = require("./controllers/users.controller");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const bid_model_1 = require("./models/bid.model");
const offer_model_1 = require("./models/offer.model");
const transaction_model_1 = require("./models/transaction.model");
const user_model_1 = require("./models/user.model");
const transaction_repository_1 = require("./repositories/transaction.repository");
const bids_service_1 = require("./services/bids.service");
const offers_service_1 = require("./services/offers.service");
const transactions_service_1 = require("./services/transactions.service");
const users_service_1 = require("./services/users.service");
const redisHandler_1 = require("./utils/redisHandler");
const emailHandler_1 = require("./utils/emailHandler");
const schedule_1 = require("@nestjs/schedule");
const schduler_service_1 = require("./services/schduler.service");
const adminBalances_model_1 = require("./models/adminBalances.model");
const adminBalances_repository_1 = require("./repositories/adminBalances.repository");
const adminWallets_service_1 = require("./services/adminWallets.service");
const web3_service_1 = require("./services/web3.service");
const txFees_model_1 = require("./models/txFees.model");
const txFees_repository_1 = require("./repositories/txFees.repository");
const aws_service_1 = require("./services/aws.service");
const chain_controller_1 = require("./controllers/chain.controller");
const payout_repository_1 = require("./repositories/payout.repository");
const payout_services_1 = require("./services/payout.services");
const payout_controller_1 = require("./controllers/payout.controller");
const Listion_controller_1 = require("./controllers/Listion.controller");
const listion_service_1 = require("./services/listion.service");
const stripe_webhook_service_1 = require("./services/stripe-webhook.service");
const Payout_service_1 = require("./services/Payout.service");
const marketdata_schema_1 = require("./models/marketdata.schema");
const market_data_controller_1 = require("./controllers/market-data.controller");
const market_data_service_1 = require("./services/market-data.service");
const stripe_controller_1 = require("./controllers/stripe.controller");
const swap_allbrige_1 = require("./services/swap-allbrige");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthenticateUser)
            .exclude('api/users/login', 'api/users/register', 'api/transactions/webhook', 'api/transactions/webhook/connect', 'api/users/verifyLoginOtp', 'api/users/ACTIVATE', 'api/users/forgot_passcode', 'api/stripe-payment/payment_link', 'api/stripe-payment/:mail/:amount', 'api/users/reports')
            .forRoutes(users_controller_1.UsersController, offers_controller_1.OffersController, bids_controller_1.BidsController, transactions_controller_1.TransactionsController, chain_controller_1.ChainController, payout_controller_1.PayoutController, Listion_controller_1.ListionController, stripe_controller_1.stripe_controller);
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URL),
            mongoose_1.MongooseModule.forFeature([
                { name: user_model_1.User.name, schema: user_model_1.UserSchema },
                { name: offer_model_1.Offer.name, schema: offer_model_1.OfferSchema },
                { name: bid_model_1.Bid.name, schema: bid_model_1.BidSchema },
                { name: transaction_model_1.Transaction.name, schema: transaction_model_1.TransactionSchema },
                { name: adminBalances_model_1.AdminBalances.name, schema: adminBalances_model_1.AdminBalancesSchema },
                { name: txFees_model_1.TxFee.name, schema: txFees_model_1.TxFeeSchema },
                { name: marketdata_schema_1.MarketData.name, schema: marketdata_schema_1.MarketDataSchema }
            ]),
            mailer_1.MailerModule.forRootAsync({
                useFactory: () => ({
                    transport: {
                        host: 'smtpout.secureserver.net',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL_ADD,
                            pass: process.env.EMAIL_PASS,
                        },
                        tls: { rejectUnauthorized: false }
                    },
                }),
            }),
        ],
        controllers: [
            app_controller_1.AppController,
            offers_controller_1.OffersController,
            users_controller_1.UsersController,
            bids_controller_1.BidsController,
            transactions_controller_1.TransactionsController,
            chain_controller_1.ChainController,
            payout_controller_1.PayoutController,
            market_data_controller_1.MarketDataController,
            stripe_controller_1.stripe_controller
        ],
        providers: [
            app_service_1.AppService,
            offers_service_1.OffersService,
            users_service_1.UsersService,
            bids_service_1.BidsService,
            transaction_repository_1.TransactionRepository,
            transactions_service_1.TransactionsService,
            redisHandler_1.RedisService,
            emailHandler_1.EmailService,
            schduler_service_1.TasksService,
            adminBalances_repository_1.AdminBalancesRepository,
            adminWallets_service_1.AdminWalletsService,
            web3_service_1.Web3Services,
            txFees_repository_1.TxFeeRepository,
            aws_service_1.AwsServices,
            web3_service_1.ChainServices,
            payout_repository_1.PayoutRepository,
            payout_services_1.PayoutServices,
            listion_service_1.ListionService,
            Payout_service_1.Payout_listion,
            stripe_webhook_service_1.StripeWebhookService,
            market_data_service_1.MarketDataService,
            swap_allbrige_1.SwapService
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map