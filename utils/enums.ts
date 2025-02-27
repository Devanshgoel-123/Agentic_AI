export enum ChainIds {
  BITCOIN = 9999,
  ZETACHAIN = 7000,
  POLYGON = 137,
  BSC = 56,
  ETHEREUM = 1,
  BASE = 8453,
  SOLANA = 88888,
}

export enum TOAST_TYPE {
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
}


export enum TOAST_NAMES {
  CUSTOM = "custom",
  TXN_NOTIFICATION = "txnNotification",
  // REWARDS_MODAL = "rewardsModal",
  TXN_NOTIFICATION_DUST = "txnNotificationDust",
}

export enum STATUS_CODES {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum POOL_TYPE {
  UNI_V2 = "Uni V2",
  CURVE = "Stable Pool",
  UNI_V3 = "Uni V3",
}

export enum UNI_V2_INPUT_ACTIONS {
  TOKENA = "tokenA",
  TOKENB = "tokenB",
}

export enum UNI_V3_INPUT_ACTIONS {
  TOKEN0 = "token0",
  TOKEN1 = "token1",
}

export enum POOL_ACTION_TYPE {
  ADD = "ADD_LIQUIDITY",
  REMOVE = "REMOVE_LIQUIDITY",
}

export enum TRANSFER_ACTION_TYPE {
  SWAP = "SWAP",
  BRIDGE = "BRIDGE",
}

export enum EVM_WALLETS_ID {
  COINBASE = "coinbaseWalletSDK",
  WALLET_CONNECT = "walletConnect",
  BINANCE_WEB3 = "BinanceW3WSDK",
  BINANCE_WEB_CHROME = "wallet.binance.com",
}

export enum BTC_WALLET_IDS {
  XDEFI = "xdefi",
  OKX = "OKX",
  UNISAT = "unisat",
  XVERSE = "xverse",
}

export enum SOLANA_WALLET_IDS {
  PHANTOM = "Phantom",
  BACKPACK = "Backpack",
  OKX = "OKX Wallet",
}

export enum WALLET_TYPES {
  SOLANA = "sol",
  BITCOIN = "btc",
  EVM = "evm",
}
