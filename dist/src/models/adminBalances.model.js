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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBalancesSchema = exports.AdminBalances = exports.HasEnoughFeeBalanceSchema = exports.HasEnoughFeeBalance = exports.BalanceSchema = exports.Balance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Balance = class Balance {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Balance.prototype, "assetName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Balance.prototype, "chainId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Balance.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Balance.prototype, "balance", void 0);
Balance = __decorate([
    (0, mongoose_1.Schema)()
], Balance);
exports.Balance = Balance;
exports.BalanceSchema = mongoose_1.SchemaFactory.createForClass(Balance);
let HasEnoughFeeBalance = class HasEnoughFeeBalance {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], HasEnoughFeeBalance.prototype, "chainId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], HasEnoughFeeBalance.prototype, "hasEnoughTxFeeBalance", void 0);
HasEnoughFeeBalance = __decorate([
    (0, mongoose_1.Schema)()
], HasEnoughFeeBalance);
exports.HasEnoughFeeBalance = HasEnoughFeeBalance;
exports.HasEnoughFeeBalanceSchema = mongoose_1.SchemaFactory.createForClass(HasEnoughFeeBalance);
let AdminBalances = class AdminBalances {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], AdminBalances.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [{ type: exports.HasEnoughFeeBalanceSchema }] }),
    __metadata("design:type", Array)
], AdminBalances.prototype, "txFeeBalances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [{ type: exports.BalanceSchema }] }),
    __metadata("design:type", Array)
], AdminBalances.prototype, "balances", void 0);
AdminBalances = __decorate([
    (0, mongoose_1.Schema)()
], AdminBalances);
exports.AdminBalances = AdminBalances;
exports.AdminBalancesSchema = mongoose_1.SchemaFactory.createForClass(AdminBalances);
//# sourceMappingURL=adminBalances.model.js.map