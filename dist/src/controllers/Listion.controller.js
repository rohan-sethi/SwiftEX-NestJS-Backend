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
exports.ListionController = void 0;
const common_1 = require("@nestjs/common");
const listion_service_1 = require("../services/listion.service");
let ListionController = class ListionController {
    constructor(listion) {
        this.listion = listion;
    }
    getHello() {
        return this.listion.getHello();
    }
    async getXlmPrice() {
        const price = await this.listion.getCurrentPrice();
        return { price };
    }
    startListening() {
        this.listion.listenForTransactions();
        return { message: 'Listening started' };
    }
};
__decorate([
    (0, common_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ListionController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('price'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListionController.prototype, "getXlmPrice", null);
__decorate([
    (0, common_1.Get)('start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ListionController.prototype, "startListening", null);
ListionController = __decorate([
    (0, common_1.Controller)('api/listion'),
    __metadata("design:paramtypes", [listion_service_1.ListionService])
], ListionController);
exports.ListionController = ListionController;
//# sourceMappingURL=Listion.controller.js.map