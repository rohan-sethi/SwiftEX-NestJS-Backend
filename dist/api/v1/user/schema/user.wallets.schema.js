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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletSchema = exports.UserWallet = exports.WalletStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "active";
    WalletStatus["INACTIVE"] = "inactive";
})(WalletStatus = exports.WalletStatus || (exports.WalletStatus = {}));
let WalletAddress = class WalletAddress {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WalletAddress.prototype, "multichainAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: WalletStatus }),
    __metadata("design:type", String)
], WalletAddress.prototype, "multichainStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WalletAddress.prototype, "stellarAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: WalletStatus }),
    __metadata("design:type", String)
], WalletAddress.prototype, "stellarStatus", void 0);
WalletAddress = __decorate([
    (0, mongoose_1.Schema)()
], WalletAddress);
const WalletAddressSchema = mongoose_1.SchemaFactory.createForClass(WalletAddress);
let UserWallet = class UserWallet extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, auto: true }),
    __metadata("design:type", Object)
], UserWallet.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'UserSchema' }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], UserWallet.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [WalletAddressSchema] }),
    __metadata("design:type", Array)
], UserWallet.prototype, "allWalletAddress", void 0);
UserWallet = __decorate([
    (0, mongoose_1.Schema)({ collection: 'userWallets', timestamps: true })
], UserWallet);
exports.UserWallet = UserWallet;
exports.UserWalletSchema = mongoose_1.SchemaFactory.createForClass(UserWallet);
//# sourceMappingURL=user.wallets.schema.js.map