import { ethers } from "ethers";
import { ChainIds } from "./enums";

export const PRIVACY_LINK =
  "https://docs.google.com/document/d/1JjxNQEkyuPHtX8DCZ9-HY-bgeym2WvA-VdXneXL24wM/edit?usp=sharing";
export const T_C_LINK =
  "https://docs.google.com/document/d/1f82WbeZPIM54eVJcTqZKqLgIYNPKX0-s9VzTkvgL6w0/edit?usp=sharing";
export const TWITTER_LINK = "https://twitter.com/eddy_protocol";
export const DISCORD_LINK = "https://discord.gg/37zcAqscEv";
export const DOCS_LINK = "https://docs.eddy.finance/";

export const DEFAULT_PAYCHAIN = ChainIds.ETHEREUM;
export const DEFAULT_GETCHAIN = ChainIds.ZETACHAIN;
export const DEFAULT_GAS_PERCENTAGE = 150;

export const TOKEN_FORM_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSeghHWilT5GWOFLaN_RgVQmveWmXyKZR_wYE5MBbdEw6_5LZA/viewform?usp=header";


export const TimeStampValue = {
    DAILY: 86400,
    WEEKLY: 604800,
    MONTHLY: 2592000,
};


export const supportedBridgeChains = [
  {
    chainId: ChainIds.BITCOIN,
    name: "Bitcoin Mainnet",
    logo: "https://asset.eddy.finance/tokens/bitcoinchain.svg",
  },
  {
    chainId: ChainIds.ETHEREUM,
    name: "Ethereum",
    logo: "https://asset.eddy.finance/logo/eth-purple.svg",
  },
  {
    chainId: ChainIds.POLYGON,
    name: "Polygon",
    logo: "https://asset.eddy.finance/tokens/matic-token.svg",
  },
  {
    chainId: ChainIds.BSC,
    name: "Binance Smart Chain",
    logo: "https://asset.eddy.finance/tokens/bnb-token.svg",
  },
  {
    chainId: ChainIds.ZETACHAIN,
    name: "ZetaChain",
    logo: "https://asset.eddy.finance/tokens/zeta-token.svg",
  },
  {
    chainId: ChainIds.BASE,
    name: "Base",
    logo: "https://asset.eddy.finance/logo/base.svg",
  },
  {
    chainId: ChainIds.SOLANA,
    name: "Solana",
    logo: "http://asset.eddy.finance/tokens/sol.svg",
  },
];

export const ZETA_CONTRACT_ADDRESS = "452E811fD1A15f7C1603DEAfdC3ac198bD116591";
export const POOL_DEPOSIT_WITHDRAW = "CEf5E7Db18C9FE3756F23664b45967af2cD6c486";
export const OMNI_CHAIN_CONTRACT_ZETACHAIN =
  "0xCEf5E7Db18C9FE3756F23664b45967af2cD6c486";
export const OMNI_CHAIN_CONTRACT_ANY_CHAIN =
  "0x452E811fD1A15f7C1603DEAfdC3ac198bD116591";
export const BTC_TSS_ZETA = "bc1qm24wp577nk8aacckv8np465z3dvmu7ry45el6y";

export const POOL_BALANCE_COLORS = ["#2775CA", "#53AE94", "#F5AC37", "#627EEA"];

/**
 *
 * @param chainId Current active chain id.
 * @param hash Hash of transaction
 * @returns Block explorer link for chain id.
 */
export const getExplorerLinkForHashAndChainId = (
  chainId: number,
  hash: string,
  isCCTX?: boolean
) => {
  switch (chainId) {
    case ChainIds.ETHEREUM:
      return `https://eth.blockscout.com/tx/${hash}/?utm_source=Eddy`;
    case ChainIds.BSC:
      return `https://bscscan.com/tx/${hash}`;
    case ChainIds.POLYGON:
      return `https://polygon.blockscout.com/tx/${hash}/?utm_source=Eddy`;
    case ChainIds.BITCOIN:
      return `https://live.blockcypher.com/btc/tx/${hash}`;
    case 1116:
      return `https://scan.coredao.org/tx/${hash}`;
    case 810180:
      return `https://explorer.zklink.io/tx/${hash}`;
    case ChainIds.ZETACHAIN:
      return isCCTX
        ? `https://explorer.zetachain.com/cc/tx/${hash}`
        : `https://zetachain.blockscout.com/tx/${hash}/?utm_source=Eddy`;
    case ChainIds.BASE:
      return `https://base.blockscout.com//tx/${hash}/?utm_source=Eddy`;
    case ChainIds.SOLANA:
      return `https://solscan.io/tx/${hash}`;
    case 7000:
      return `https://explorer.zetachain.com/cc/tx/${hash}`;
    case 34443:
      return `https://explorer.mode.network/tx/${hash}`;
    case 81457:
      return `https://blastscan.io/tx/${hash}`;
  }
};

export const MODAL_STYLE = {
  backdropFilter: "blur(5px)",
};

export const CHAIN_IDS = {
  ZETACHAIN: 7000,
  ETHEREUM_MAINNET: 1,
  BSC_MAINNET: 56,
  POLYGON_MAINNET: 137,
  BITCOIN_MAINNET: 9999,
  BASE: 8453,
  SOLANA: 88888,
};


/**
 *
 * @param bitcoinWalletAddress BTC wallet address for user.
 * @returns BTC address in encoded format.
 */
export const getEncodedBitcoinWalletAddress = (
  bitcoinWalletAddress: string
) => {
  const dataTypes = ["bytes"];
  const values = [ethers.toUtf8Bytes(bitcoinWalletAddress)];

  const encodedData = ethers.solidityPacked(dataTypes, values);

  return encodedData;
};
