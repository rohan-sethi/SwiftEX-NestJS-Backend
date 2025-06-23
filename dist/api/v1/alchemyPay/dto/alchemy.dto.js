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
exports.alchemySellOrderDto = exports.alchemyCreateOrder = exports.alchemyUserKyc = exports.conversionQuote = void 0;
const class_validator_1 = require("class-validator");
class conversionQuote {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], conversionQuote.prototype, "crypto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], conversionQuote.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], conversionQuote.prototype, "fiat", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], conversionQuote.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['BUY', 'SELL'], {
        message: 'wrong sideType',
    }),
    __metadata("design:type", String)
], conversionQuote.prototype, "side", void 0);
exports.conversionQuote = conversionQuote;
class alchemyUserKyc {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['BUY', 'SELL'], {
        message: 'wrong businessSubType',
    }),
    __metadata("design:type", String)
], alchemyUserKyc.prototype, "businessSubType", void 0);
exports.alchemyUserKyc = alchemyUserKyc;
class alchemyCreateOrder {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['BUY', 'SELL'], {
        message: 'wrong sideType',
    }),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "side", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "fiat", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "crypto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEthereumAddress)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "payWayCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['4', '6'], {
        message: 'wrong order type onramp: 4 / offramp: 6',
    }),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "orderType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemyCreateOrder.prototype, "memo", void 0);
exports.alchemyCreateOrder = alchemyCreateOrder;
class alchemySellOrderDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemySellOrderDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemySellOrderDto.prototype, "fiat", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemySellOrderDto.prototype, "crypto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], alchemySellOrderDto.prototype, "network", void 0);
exports.alchemySellOrderDto = alchemySellOrderDto;
//# sourceMappingURL=alchemy.dto.js.map