import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './api/v1/user/user.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { MarketDataModule } from './api/v1/market-data/market-data.module';
import { JwtAuthMiddleware } from './api/v1/auth/jwt-auth.middleware';
import { NotificationModule } from './api/v1/notification/notification.module';
import { ContractTransactionListener } from './api/v1/transactionListener/transaction.listener';
import { ListenerModule } from './api/v1/transactionListener/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtpout.secureserver.net',
          port: 465,
          secure: true,
          auth: {
            user: configService.get('EMAIL_ADD'),
            pass: configService.get('EMAIL_PASS'),
          },
          tls: { rejectUnauthorized: false }
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MarketDataModule,
    NotificationModule,
    ListenerModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: "/api/market-data/getcryptodata", method: RequestMethod.GET },
        { path: "/api/auth/login", method: RequestMethod.POST },
        { path: "/api/users/register", method: RequestMethod.POST },
        { path: "/api/users/forgotPasscode",method: RequestMethod.POST},
        { path: "/api/users/guestRegister",method: RequestMethod.POST}
      )
      .forRoutes("*")
  }
}