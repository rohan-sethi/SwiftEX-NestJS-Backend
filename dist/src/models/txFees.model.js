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
exports.TxFeeSchema = exports.TxFee = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../utils/constants");
let TxFee = class TxFee {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TxFee.prototype, "chainId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: constants_1.TX_NAME_ENUM }),
    __metadata("design:type", String)
], TxFee.prototype, "txName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TxFee.prototype, "gasFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TxFee.prototype, "avgGasAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TxFee.prototype, "gasPriceInUsd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TxFee.prototype, "gasPriceInEth", void 0);
TxFee = __decorate([
    (0, mongoose_1.Schema)()
], TxFee);
exports.TxFee = TxFee;
exports.TxFeeSchema = mongoose_1.SchemaFactory.createForClass(TxFee);
//# sourceMappingURL=txFees.model.js.map