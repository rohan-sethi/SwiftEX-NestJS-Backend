"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.signJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const signJwtToken = (user) => {
    try {
        const { phoneNumber, _id } = user;
        const token = jsonwebtoken_1.default.sign({ phoneNumber, _id }, process.env.JWT_SECRET, {
            expiresIn: constants_1.JWT_EXPIRE_TIME,
        });
        return token;
    }
    catch (err) {
        console.log(err);
        return err.message;
    }
};
exports.signJwtToken = signJwtToken;
const verifyJwtToken = (token, secret = process.env.JWT_SECRET) => {
    try {
        const tokenArray = token.split(' ');
        const tokenToUse = tokenArray.length === 2 ? tokenArray[1] : tokenArray[0];
        return jsonwebtoken_1.default.verify(tokenToUse, secret);
    }
    catch (err) {
        console.log(err);
        return err.message;
    }
};
exports.verifyJwtToken = verifyJwtToken;
//# sourceMappingURL=jwtHandler.js.map