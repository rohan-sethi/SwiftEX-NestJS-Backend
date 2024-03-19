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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const adminBalances_repository_1 = require("../repositories/adminBalances.repository");
const txFees_repository_1 = require("../repositories/txFees.repository");
const adminWallets_service_1 = require("./adminWallets.service");
let TasksService = class TasksService {
    constructor(adminBalancesRepository, txFeeRepository, adminWalletsService) {
        this.adminBalancesRepository = adminBalancesRepository;
        this.txFeeRepository = txFeeRepository;
        this.adminWalletsService = adminWalletsService;
    }
    updateAddminWalletBalance() {
        this.adminBalancesRepository.updateAdminBalances();
    }
    updateTxPrice() {
        this.txFeeRepository.updateTxFeePrice();
    }
    udpateAdminWallets() {
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksService.prototype, "updateAddminWalletBalance", null);
__decorate([
    (0, schedule_1.Cron)('0/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksService.prototype, "updateTxPrice", null);
__decorate([
    (0, schedule_1.Cron)('0 0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksService.prototype, "udpateAdminWallets", null);
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adminBalances_repository_1.AdminBalancesRepository,
        txFees_repository_1.TxFeeRepository,
        adminWallets_service_1.AdminWalletsService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=schduler.service.js.map