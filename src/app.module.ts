import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BidsController } from './controllers/bids.controller';
import { OffersController } from './controllers/offers.controller';
import { TransactionsController } from './controllers/transactions.controller';
import { UsersController } from './controllers/users.controller';
import { AuthenticateUser } from './middlewares/auth.middleware';
import { Bid, BidSchema } from './models/bid.model';
import { Offer, OfferSchema } from './models/offer.model';
import { Transaction, TransactionSchema } from './models/transaction.model';
import { User, UserSchema } from './models/user.model';
import { TransactionRepository } from './repositories/transaction.repository';
import { BidsService } from './services/bids.service';
import { OffersService } from './services/offers.service';
import { TransactionsService } from './services/transactions.service';
import { UsersService } from './services/users.service';
import { RedisService } from './utils/redisHandler';
import { EmailService } from './utils/emailHandler';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/schduler.service';
import {
  AdminBalances,
  AdminBalancesSchema,
} from './models/adminBalances.model';
import { AdminBalancesRepository } from './repositories/adminBalances.repository';
import { AdminWalletsService } from './services/adminWallets.service';
import { ChainServices, Web3Services } from './services/web3.service';
import { TxFee, TxFeeSchema } from './models/txFees.model';
import { TxFeeRepository } from './repositories/txFees.repository';
import { AwsServices } from './services/aws.service';
import { ChainController } from './controllers/chain.controller';
import { PayoutRepository } from './repositories/payout.repository';
import { PayoutServices } from './services/payout.services';
import { PayoutController } from './controllers/payout.controller';
import {ListionController} from './controllers/Listion.controller';
import {ListionService} from './services/listion.service'
import { StripeWebhookService } from './services/stripe-webhook.service'
import { Payout_listion } from './services/Payout.service'


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: Bid.name, schema: BidSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: AdminBalances.name, schema: AdminBalancesSchema },
      { name: TxFee.name, schema: TxFeeSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        // transport: process.env.SMTP_URL
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
    AppController,
    OffersController,
    UsersController,
    BidsController,
    TransactionsController,
    ChainController,
    PayoutController,
  ],
  providers: [
    AppService,
    OffersService,
    UsersService,
    BidsService,
    TransactionRepository,
    TransactionsService,
    RedisService,
    EmailService,
    TasksService,
    AdminBalancesRepository,
    AdminWalletsService,
    Web3Services,
    TxFeeRepository,
    AwsServices,
    ChainServices,
    PayoutRepository,
    PayoutServices,
    ListionService,
    Payout_listion,
    StripeWebhookService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateUser)
      .exclude(
        'users/login',
        'users/register',
        'transactions/webhook',
        'transactions/webhook/connect',
        'users/verifyLoginOtp',
        'users/ACTIVATE'
        // '/listion/start',
        // '/listion/price'
      )
      .forRoutes(
        UsersController,
        OffersController,
        BidsController,
        TransactionsController,
        ChainController,
        PayoutController,
        ListionController
      );
  }
}
