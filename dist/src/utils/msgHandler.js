"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const twilio_1 = __importDefault(require("twilio"));
const sendMessage = async ({ body, from, to }) => {
    const client = (0, twilio_1.default)(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);
    const sentMsg = await client.messages.create({ body, from, to });
    return sentMsg;
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=msgHandler.js.map