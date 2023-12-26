export const BID_STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  MATCHED: 'MATCHED',
  CANCELED: 'CANCELED',
  FINALIZIED: 'FINALIZIED',
};

export const OFFER_STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  MATCHED: 'MATCHED',
  CANCELED: 'CANCELED',
  FINALIZIED: 'FINALIZIED',
  TRANSFER_IN_PROGRESS: 'TRANSFER_IN_PROGRESS',
  TRANSFER_FAILED: 'TRANSFER_FAILED',
};

export const TRANSACTION_STATUS_ENUM = {
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  TRANSFER_PENDING: 'TRANSFER_PENDING',
  TRANSFER_FAILED: 'TRANSFER_FAILED',
  SUCCEEDED: 'SUCCEEDED',
  OFFER_CANCELLED: 'OFFER_CANCELLED',
  BID_CANCELLED: 'BID_CANCELLED',
};

export const NOTIFICATION_TYPES_ENUM = {
  BID_ACCEPTED: 'BID_ACCEPTED',
  BID_ADDED: 'BID_ADDED',
  OFFER_FINALIZED: 'OFFER_FINALIZED',
  TRANSFER_FAILED: 'TRANSFER_FAILED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYOUT_FAILED: 'PAYOUT_FAILED',
  PAYOUT_SUCCEEDED: 'PAYOUT_SUCCEEDED',
};

export const TX_NAME_ENUM = {
  ETH_ERC20_TRANSFER: 'ETH_ERC20_TRANSFER',
  ETH_TRANSFER: 'ETH_TRANSFER',
};

// export const ASSET_TO_TX_NAME = {
//   ETH: TX_NAME_ENUM.ETH_TRANSFER,
//   USDT: TX_NAME_ENUM.ETH_ERC20_TRANSFER,
//   WBTC: TX_NAME_ENUM.ETH_ERC20_TRANSFER,
//   DAI: TX_NAME_ENUM.ETH_ERC20_TRANSFER,
// };

export const TX_NAME_TO_AVG_GAS = {
  ETH_ERC20_TRANSFER: '50000',
  ETH_TRANSFER: '21000',
};

export const MIN_TX_FEE_BALANCE = '20000000000000000'; // 0.02 ETH
export const JWT_EXPIRE_TIME = '3d';
export const APP_FEE_PERCENTAGE = 0.005;
export const OFFER_CANCELLATION_LIMIT_TIME = 5 * 60 * 1000; // Value in seconds

// export const ETH_ERC20_ADDRESSES = {
//   USDT: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
//   WBTC: '0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE',
//   DAI: '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464',
// };

export const ERC20_ABI = [
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
