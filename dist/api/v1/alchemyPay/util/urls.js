"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERSELLORDER = exports.USERAUTHTOKEN = exports.ORDERCREATION = exports.USERKYCSTATUS = exports.USERREGISTER = exports.QUOTES = void 0;
exports.QUOTES = {
    METHODTYPE: 'POST',
    REQUESTURL: 'https://openapi.alchemypay.org/open/api/v4/merchant/order/quote'
};
exports.USERREGISTER = {
    METHODTYPE: 'POST',
    REQUESTURL: 'https://pro-user-api.alchemytech.cc/open/api/user/core/register'
};
exports.USERKYCSTATUS = {
    METHODTYPE: 'POST',
    REQUESTURL: 'https://pro-user-api.alchemytech.cc/open/api/user/core/getKycStatusInfo'
};
exports.ORDERCREATION = {
    METHODTYPE: 'POST',
    REQUESTURL: 'https://openapi.alchemypay.org/open/api/v4/merchant/trade/create'
};
exports.USERAUTHTOKEN = {
    METHODTYPE: 'POST',
    REQUESTURL: 'https://openapi.alchemypay.org/open/api/v4/merchant/getToken'
};
exports.USERSELLORDER = {
    METHODTYPE: 'GET',
    REQUESTURL: '/index/rampPageSell',
    SELLORDER: 'https://ramp.alchemypay.org?'
};
//# sourceMappingURL=urls.js.map