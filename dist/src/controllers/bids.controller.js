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
exports.BidsController = void 0;
const common_1 = require("@nestjs/common");
const bidSyncBody_dto_1 = require("../dtos/bidSyncBody.dto");
const newBid_dto_1 = require("../dtos/newBid.dto");
const updateBid_dto_1 = require("../dtos/updateBid.dto");
const bids_service_1 = require("../services/bids.service");
const validation_pipe_1 = require("../utils/validation.pipe");
let BidsController = class BidsController {
    constructor(BidsService) {
        this.BidsService = BidsService;
    }
    getAllBids(userId) {
        return this.BidsService.getAllBids(userId);
    }
    addNewBid(newBid, userId) {
        return this.BidsService.addNewBid(newBid, userId);
    }
    updateBidPrice(bidId, userId, update) {
        return this.BidsService.updateBidPrice(userId, bidId, update);
    }
    cancelBid(bidId, userId) {
        return this.BidsService.cancelBid(userId, bidId);
    }
    getBidDetails(bidId, userId) {
        return this.BidsService.getBidDetails(bidId, userId);
    }
    getInSyncedBids(fcmRegToken, userId) {
        return this.BidsService.getInSyncedBids(userId, fcmRegToken);
    }
    syncDevice(userId, bidSyncBody) {
        return this.BidsService.syncDevice(userId, bidSyncBody.fcmRegToken);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "getAllBids", null);
__decorate([
    (0, common_1.Post)('addNewBid'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newBid_dto_1.NewBidDto, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "addNewBid", null);
__decorate([
    (0, common_1.Patch)('updateBidPrice/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, updateBid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "updateBidPrice", null);
__decorate([
    (0, common_1.Patch)('cancelBid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "cancelBid", null);
__decorate([
    (0, common_1.Get)('getBidDetails/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "getBidDetails", null);
__decorate([
    (0, common_1.Get)('getInSyncedBids/:fcmRegToken'),
    __param(0, (0, common_1.Param)('fcmRegToken')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "getInSyncedBids", null);
__decorate([
    (0, common_1.Post)('syncDevice'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bidSyncBody_dto_1.BidSyncBodyDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "syncDevice", null);
BidsController = __decorate([
    (0, common_1.Controller)('api/bids'),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidsController);
exports.BidsController = BidsController;
//# sourceMappingURL=bids.controller.js.map