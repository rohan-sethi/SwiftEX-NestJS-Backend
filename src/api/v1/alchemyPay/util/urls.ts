export const QUOTES={
    METHODTYPE:'POST',
    REQUESTURL:'https://openapi.alchemypay.org/open/api/v4/merchant/order/quote'
}

export const USERREGISTER={
    METHODTYPE:'POST',
    REQUESTURL:'https://pro-user-api.alchemytech.cc/open/api/user/core/register'
}

export const USERKYCSTATUS={
    METHODTYPE:'POST',
    REQUESTURL:'https://pro-user-api.alchemytech.cc/open/api/user/core/getKycStatusInfo'
}

export const ORDERCREATION={
    METHODTYPE:'POST',
    REQUESTURL:'https://openapi.alchemypay.org/open/api/v4/merchant/trade/create'
}

export const USERAUTHTOKEN={
    METHODTYPE:'POST',
    REQUESTURL:'https://openapi.alchemypay.org/open/api/v4/merchant/getToken'
}

export const USERSELLORDER={
    METHODTYPE:'GET',
    REQUESTURL:'/index/rampPageSell',
    SELLORDER:'https://ramp.alchemypay.org?'
}