"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20_ABI = exports.OFFER_CANCELLATION_LIMIT_TIME = exports.APP_FEE_PERCENTAGE = exports.JWT_EXPIRE_TIME = exports.MIN_TX_FEE_BALANCE = exports.TX_NAME_TO_AVG_GAS = exports.TX_NAME_ENUM = exports.NOTIFICATION_TYPES_ENUM = exports.TRANSACTION_STATUS_ENUM = exports.OFFER_STATUS_ENUM = exports.BID_STATUS_ENUM = void 0;
exports.BID_STATUS_ENUM = {
    ACTIVE: 'ACTIVE',
    MATCHED: 'MATCHED',
    CANCELED: 'CANCELED',
    FINALIZIED: 'FINALIZIED',
};
exports.OFFER_STATUS_ENUM = {
    ACTIVE: 'ACTIVE',
    MATCHED: 'MATCHED',
    CANCELED: 'CANCELED',
    FINALIZIED: 'FINALIZIED',
    TRANSFER_IN_PROGRESS: 'TRANSFER_IN_PROGRESS',
    TRANSFER_FAILED: 'TRANSFER_FAILED',
};
exports.TRANSACTION_STATUS_ENUM = {
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    TRANSFER_PENDING: 'TRANSFER_PENDING',
    TRANSFER_FAILED: 'TRANSFER_FAILED',
    SUCCEEDED: 'SUCCEEDED',
    OFFER_CANCELLED: 'OFFER_CANCELLED',
    BID_CANCELLED: 'BID_CANCELLED',
};
exports.NOTIFICATION_TYPES_ENUM = {
    BID_ACCEPTED: 'BID_ACCEPTED',
    BID_ADDED: 'BID_ADDED',
    OFFER_FINALIZED: 'OFFER_FINALIZED',
    TRANSFER_FAILED: 'TRANSFER_FAILED',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYOUT_FAILED: 'PAYOUT_FAILED',
    PAYOUT_SUCCEEDED: 'PAYOUT_SUCCEEDED',
};
exports.TX_NAME_ENUM = {
    ETH_ERC20_TRANSFER: 'ETH_ERC20_TRANSFER',
    ETH_TRANSFER: 'ETH_TRANSFER',
};
exports.TX_NAME_TO_AVG_GAS = {
    ETH_ERC20_TRANSFER: '50000',
    ETH_TRANSFER: '21000',
};
exports.MIN_TX_FEE_BALANCE = '20000000000000000';
exports.JWT_EXPIRE_TIME = '3d';
exports.APP_FEE_PERCENTAGE = 0.005;
exports.OFFER_CANCELLATION_LIMIT_TIME = 5 * 60 * 1000;
exports.ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_from',
                type: 'address',
            },
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
            {
                name: '_spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
];
//# sourceMappingURL=constants.js.map