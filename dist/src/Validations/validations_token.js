"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidToken = exports.validations_token = void 0;
const class_validator_1 = require("class-validator");
let validations_token = class validations_token {
    validate(token, args) {
        const walletType = args.object.walletType;
        if (walletType === 'Ethereum') {
            const allowedSourceTokens = ['USDT', 'USDC'];
            const allowedDestinationTokens = ['USDC', 'aeETH'];
            if (args.property === 'sourceToken') {
                return allowedSourceTokens.includes(token);
            }
            if (args.property === 'destinationToken') {
                return allowedDestinationTokens.includes(token);
            }
        }
        if (walletType === 'BNB') {
            const allowedSourceTokens = ['USDT', 'BNB'];
            const allowedDestinationTokens = ['BNB', 'aeETH'];
            if (args.property === 'sourceToken') {
                return allowedSourceTokens.includes(token);
            }
            if (args.property === 'destinationToken') {
                return allowedDestinationTokens.includes(token);
            }
        }
        return true;
    }
    defaultMessage(args) {
        const walletType = args.object.walletType;
        if (walletType === 'Ethereum') {
            if (args.property === 'sourceToken') {
                return `sourceToken must be either USDT or USDC for Ethereum walletType.`;
            }
            if (args.property === 'destinationToken') {
                return `destinationToken must be either USDC or aeETH for Ethereum walletType.`;
            }
        }
        if (walletType === 'BNB') {
            if (args.property === 'sourceToken') {
                return `sourceToken must be either USDT or BNB for BNB walletType.`;
            }
            if (args.property === 'destinationToken') {
                return `destinationToken must be either BNB or aeETH for BNB walletType.`;
            }
        }
        return `Invalid token.`;
    }
};
validations_token = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], validations_token);
exports.validations_token = validations_token;
function IsValidToken(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: validations_token,
        });
    };
}
exports.IsValidToken = IsValidToken;
//# sourceMappingURL=validations_token.js.map