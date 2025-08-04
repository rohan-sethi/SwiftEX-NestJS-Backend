"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const user_service_1 = require("./service/user.service");
const user_controller_1 = require("./controller/user.controller");
const email_service_1 = require("../utils/email.service");
const notification_service_1 = require("../notification/service/notification.service");
const bridge_service_1 = require("../bridge/services/bridge.service");
const bridge_utils_1 = require("../bridge/utils/bridge.utils");
const alchemy_service_1 = require("../alchemyPay/service/alchemy.service");
const url_signer_1 = require("../alchemyPay/util/url.signer");
const ulr_executer_1 = require("../alchemyPay/util/ulr.executer");
const walletNotification_service_1 = require("../notification/service/walletNotification.service");
const user_wallet_service_1 = require("./service/user.wallet.service");
const user_wallets_schema_1 = require("./schema/user.wallets.schema");
const user_orders_schema_1 = require("./schema/user.orders.schema");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }, { name: user_wallets_schema_1.UserWallet.name, schema: user_wallets_schema_1.UserWalletSchema }, { name: user_orders_schema_1.UserOrder.name, schema: user_orders_schema_1.UserOrdersSchema }])],
        providers: [user_service_1.UserService, email_service_1.EmailService, notification_service_1.NotificationService, bridge_service_1.SwapService, bridge_utils_1.BridgeUtils, alchemy_service_1.AlchemyService, url_signer_1.UrlSigner, ulr_executer_1.UrlExecuter, walletNotification_service_1.WalletNotificationService, user_wallet_service_1.UserWalletService],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map