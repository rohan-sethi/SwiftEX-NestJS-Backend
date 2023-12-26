"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotification = void 0;
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const credential = (0, app_1.cert)(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const app = (0, app_1.initializeApp)({ credential });
const messaging = (0, messaging_1.getMessaging)(app);
const pushNotification = (message) => {
    return messaging.sendMulticast(message);
};
exports.pushNotification = pushNotification;
//# sourceMappingURL=fcmHandler.js.map