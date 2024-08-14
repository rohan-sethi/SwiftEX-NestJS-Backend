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
exports.OffersController = void 0;
const common_1 = require("@nestjs/common");
const acceptABid_dto_1 = require("../dtos/acceptABid.dto");
const newOffer_dto_1 = require("../dtos/newOffer.dto");
const offerUpdate_dto_1 = require("../dtos/offerUpdate.dto");
const validation_pipe_1 = require("../utils/validation.pipe");
const offers_service_1 = require("../services/offers.service");
let OffersController = class OffersController {
    constructor(OffersService) {
        this.OffersService = OffersService;
    }
    getAllOffers() {
        return this.OffersService.getAllOffers();
    }
    addNewOffer(newOffer, userId) {
        return this.OffersService.addNewOffer(newOffer, userId);
    }
    updateOffer(offerId, update, userId) {
        return this.OffersService.updateOffer(userId, offerId, update);
    }
    cancelOffer(offerId, userId) {
        return this.OffersService.cancelOffer(userId, offerId);
    }
    getOfferDetails(offerId, userId) {
        return this.OffersService.getOfferDetails(offerId, userId);
    }
    acceptABid(body, userId) {
        return this.OffersService.acceptABid(userId, body.bidId, body.offerId);
    }
    cancelMatchedBid(offerId, userId) {
        return this.OffersService.cancelMatchedBid(userId, offerId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "getAllOffers", null);
__decorate([
    (0, common_1.Post)('addNewOffer'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newOffer_dto_1.NewOfferDto, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "addNewOffer", null);
__decorate([
    (0, common_1.Patch)('updateOffer/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, offerUpdate_dto_1.OfferUpdateDto, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Patch)('cancelOffer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "cancelOffer", null);
__decorate([
    (0, common_1.Get)('/getOfferDetails/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "getOfferDetails", null);
__decorate([
    (0, common_1.Post)('acceptABid'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [acceptABid_dto_1.AcceptABidDto, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "acceptABid", null);
__decorate([
    (0, common_1.Patch)('cancelMatchedBid/:offerId'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('offerId', validation_pipe_1.ObjectIdValidationPipe)),
    __param(1, (0, common_1.Query)('userId', validation_pipe_1.ObjectIdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "cancelMatchedBid", null);
OffersController = __decorate([
    (0, common_1.Controller)('api/offers'),
    __metadata("design:paramtypes", [offers_service_1.OffersService])
], OffersController);
exports.OffersController = OffersController;
//# sourceMappingURL=offers.controller.js.map