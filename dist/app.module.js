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
const schedule_1 = require("@nestjs/schedule");
const user_module_1 = require("./api/v1/user/user.module");
const auth_module_1 = require("./api/v1/auth/auth.module");
const market_data_module_1 = require("./api/v1/market-data/market-data.module");
const jwt_auth_middleware_1 = require("./api/v1/auth/jwt-auth.middleware");
const notification_module_1 = require("./api/v1/notification/notification.module");
const transaction_module_1 = require("./api/v1/transactionListener/transaction.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(jwt_auth_middleware_1.JwtAuthMiddleware)
            .exclude({ path: "/api/market-data/getcryptodata", method: common_1.RequestMethod.GET }, { path: "/api/auth/login", method: common_1.RequestMethod.POST }, { path: "/api/users/register", method: common_1.RequestMethod.POST }, { path: "/api/users/forgotPasscode", method: common_1.RequestMethod.POST }, { path: "/api/users/guestRegister", method: common_1.RequestMethod.POST })
            .forRoutes("*");
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                }),
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            market_data_module_1.MarketDataModule,
            notification_module_1.NotificationModule,
            transaction_module_1.ListenerModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map