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
exports.UserOrdersSchema = exports.UserOrder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
let UserOrder = class UserOrder extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, auto: true }),
    __metadata("design:type", Object)
], UserOrder.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'UserSchema', required: true }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], UserOrder.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, sparse: true }),
    __metadata("design:type", String)
], UserOrder.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], UserOrder.prototype, "deviceInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserOrder.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], UserOrder.prototype, "requsetdPayload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserOrder.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], UserOrder.prototype, "webhookResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserOrder.prototype, "deviceFCM", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserOrder.prototype, "orderType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending' }),
    __metadata("design:type", String)
], UserOrder.prototype, "status", void 0);
UserOrder = __decorate([
    (0, mongoose_1.Schema)({ collection: "userOrder", timestamps: true })
], UserOrder);
exports.UserOrder = UserOrder;
exports.UserOrdersSchema = mongoose_1.SchemaFactory.createForClass(UserOrder);
//# sourceMappingURL=user.orders.schema.js.map