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
exports.AllbridgeService = void 0;
const common_1 = require("@nestjs/common");
const bridge_core_sdk_1 = require("@allbridge/bridge-core-sdk");
let AllbridgeService = class AllbridgeService {
    constructor() {
        this.allbridge = new bridge_core_sdk_1.Allbridge({
            apiKey: process.env.ALLBRIDGE_API_KEY,
        });
    }
};
AllbridgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AllbridgeService);
exports.AllbridgeService = AllbridgeService;
//# sourceMappingURL=swap_allbrige.service.js.map