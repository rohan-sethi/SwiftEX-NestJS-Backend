"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCurrencies = void 0;
const axios_1 = __importDefault(require("axios"));
const convertCurrencies = async (from, to, amount) => {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}`;
    const { data } = await axios_1.default.get(url);
    const rate = +data.result;
    return amount * rate;
};
exports.convertCurrencies = convertCurrencies;
//# sourceMappingURL=currencyConvHandler.js.map