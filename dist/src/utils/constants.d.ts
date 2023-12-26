export declare const BID_STATUS_ENUM: {
    ACTIVE: string;
    MATCHED: string;
    CANCELED: string;
    FINALIZIED: string;
};
export declare const OFFER_STATUS_ENUM: {
    ACTIVE: string;
    MATCHED: string;
    CANCELED: string;
    FINALIZIED: string;
    TRANSFER_IN_PROGRESS: string;
    TRANSFER_FAILED: string;
};
export declare const TRANSACTION_STATUS_ENUM: {
    PAYMENT_PENDING: string;
    PAYMENT_FAILED: string;
    TRANSFER_PENDING: string;
    TRANSFER_FAILED: string;
    SUCCEEDED: string;
    OFFER_CANCELLED: string;
    BID_CANCELLED: string;
};
export declare const NOTIFICATION_TYPES_ENUM: {
    BID_ACCEPTED: string;
    BID_ADDED: string;
    OFFER_FINALIZED: string;
    TRANSFER_FAILED: string;
    PAYMENT_FAILED: string;
    PAYOUT_FAILED: string;
    PAYOUT_SUCCEEDED: string;
};
export declare const TX_NAME_ENUM: {
    ETH_ERC20_TRANSFER: string;
    ETH_TRANSFER: string;
};
export declare const TX_NAME_TO_AVG_GAS: {
    ETH_ERC20_TRANSFER: string;
    ETH_TRANSFER: string;
};
export declare const MIN_TX_FEE_BALANCE = "20000000000000000";
export declare const JWT_EXPIRE_TIME = "3d";
export declare const APP_FEE_PERCENTAGE = 0.005;
export declare const OFFER_CANCELLATION_LIMIT_TIME: number;
export declare const ERC20_ABI: ({
    constant: boolean;
    inputs: {
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        name: string;
        type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    payable: boolean;
    stateMutability: string;
    type: string;
    constant?: undefined;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    constant?: undefined;
    outputs?: undefined;
    payable?: undefined;
    stateMutability?: undefined;
})[];
