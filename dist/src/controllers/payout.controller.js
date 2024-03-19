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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutController = void 0;
const common_1 = require("@nestjs/common");
const payout_services_1 = require("../services/payout.services");
const validation_pipe_1 = require("../utils/validation.pipe");
let PayoutController = class PayoutController {
    constructor(payoutServices) {
        this.payoutServices = payoutServices;
    }
    getMyPayouts(userId) {
        return this.payoutServices.getAccoutnPayouts(userId);
    }
};
__decorate([
    (0, common_1.Get)('myPayouts'),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayoutController.prototype, "getMyPayouts", null);
PayoutController = __decorate([
    (0, common_1.Controller)('payout'),
    __metadata("design:paramtypes", [payout_services_1.PayoutServices])
], PayoutController);
exports.PayoutController = PayoutController;
//# sourceMappingURL=payout.controller.js.map