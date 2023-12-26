"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUser = void 0;
const common_1 = require("@nestjs/common");
const jwtHandler_1 = require("../utils/jwtHandler");
let AuthenticateUser = class AuthenticateUser {
    use(req, res, next) {
        const token = req.headers.authorization;
        if (!token)
            throw new common_1.HttpException('Auth token not provided', common_1.HttpStatus.FORBIDDEN);
        const { phoneNumber, _id } = (0, jwtHandler_1.verifyJwtToken)(token);
        if (!phoneNumber || !_id)
            throw new common_1.HttpException('Invalid token provided', common_1.HttpStatus.FORBIDDEN);
        req.query.phoneNumber = phoneNumber;
        req.query.userId = _id;
        next();
    }
};
AuthenticateUser = __decorate([
    (0, common_1.Injectable)()
], AuthenticateUser);
exports.AuthenticateUser = AuthenticateUser;
//# sourceMappingURL=auth.middleware.js.map