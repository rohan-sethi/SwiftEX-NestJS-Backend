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
exports.swap_allbridge_dto = void 0;
const class_validator_1 = require("class-validator");
const validations_token_1 = require("../Validations/validations_token");
class swap_allbridge_dto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEthereumAddress)(),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "fromAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^G[A-Z0-9]{55}$/, {
        message: 'Invalid Stellar public key format',
    }),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "toAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, validations_token_1.IsValidToken)({ message: 'Invalid sourceToken for the given walletType.' }),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "sourceToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, validations_token_1.IsValidToken)({ message: 'Invalid destinationToken for the given walletType.' }),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "destinationToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], swap_allbridge_dto.prototype, "walletType", void 0);
exports.swap_allbridge_dto = swap_allbridge_dto;
//# sourceMappingURL=swap-allbrideg.dto.js.map