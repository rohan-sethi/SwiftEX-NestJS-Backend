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
exports.BidSchema = exports.Bid = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../utils/constants");
let Bid = class Bid {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Bid.prototype, "pricePerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Bid.prototype, "bidder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Bid.prototype, "offer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: constants_1.BID_STATUS_ENUM.ACTIVE, enum: constants_1.BID_STATUS_ENUM }),
    __metadata("design:type", String)
], Bid.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Transaction' }),
    __metadata("design:type", Object)
], Bid.prototype, "acceptanceTx", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], Bid.prototype, "fcmRegTokens", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bid.prototype, "currencyName", void 0);
Bid = __decorate([
    (0, mongoose_1.Schema)()
], Bid);
exports.Bid = Bid;
exports.BidSchema = mongoose_1.SchemaFactory.createForClass(Bid);
//# sourceMappingURL=bid.model.js.map