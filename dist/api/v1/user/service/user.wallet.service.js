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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserWalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_wallets_schema_1 = require("../schema/user.wallets.schema");
const mongoose_2 = require("mongoose");
let UserWalletService = UserWalletService_1 = class UserWalletService {
    constructor(userWallet) {
        this.userWallet = userWallet;
        this.logger = new common_1.Logger(UserWalletService_1.name);
    }
    async updateAddressWithUser(userObjId, newAddress) {
        try {
            const walletInfo = await this.userWallet.findOne({ userId: new mongoose_2.Types.ObjectId(userObjId) }).exec();
            if (!walletInfo) {
                const newUser = new this.userWallet({
                    userId: userObjId,
                    allWalletAddress: [
                        {
                            multichainAddress: newAddress.multichainAddress,
                            multichainStatus: user_wallets_schema_1.WalletStatus.ACTIVE,
                            stellarAddress: newAddress.stellarAddress,
                            stellarStatus: user_wallets_schema_1.WalletStatus.ACTIVE,
                        },
                    ],
                });
                return newUser.save();
            }
            for (const addr of walletInfo.allWalletAddress) {
                if (addr.multichainStatus === user_wallets_schema_1.WalletStatus.ACTIVE)
                    addr.multichainStatus = user_wallets_schema_1.WalletStatus.INACTIVE;
                if (addr.stellarStatus === user_wallets_schema_1.WalletStatus.ACTIVE)
                    addr.stellarStatus = user_wallets_schema_1.WalletStatus.INACTIVE;
            }
            walletInfo.allWalletAddress.push({
                multichainAddress: newAddress.multichainAddress,
                multichainStatus: user_wallets_schema_1.WalletStatus.ACTIVE,
                stellarAddress: newAddress.stellarAddress,
                stellarStatus: user_wallets_schema_1.WalletStatus.ACTIVE,
            });
            return walletInfo.save();
        }
        catch (error) {
            this.logger.log('walletAddress Error: ', error);
            throw new Error('Error while saving user walletAddress.');
        }
    }
};
UserWalletService = UserWalletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_wallets_schema_1.UserWallet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserWalletService);
exports.UserWalletService = UserWalletService;
//# sourceMappingURL=user.wallet.service.js.map