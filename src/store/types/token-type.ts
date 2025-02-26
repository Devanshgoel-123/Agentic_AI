import { BigNumber, ethers } from "v5n";

export interface Token {
  id: number;
  isBridge: boolean;
  isNative: boolean;
  isDefault: boolean;
  isStable: boolean;
  address: string;
  zrc20Address: string;
  name: string;
  chain: {
    chainId: number;
    chainLogo: string;
    name: string;
  };
  decimal: number;
  tokenLogo: string;
  pythId: string;
  curveIndex: number;
  unsupported: boolean;
  isUniV3Supported: boolean;
  feeTier?: number;
  intermediateToken?: boolean;
}

export interface ResponseToken {
  id: number;
  isBridge: boolean;
  isNative: boolean;
  isStable: boolean;
  isDefault: boolean;
  address: string;
  zrc20Address: string;
  name: string;
  tokenLogo: string;
  pythId: string;
  chain: {
    chainId: number;
    chainLogo: string;
    name: string;
    __typename: string;
  };
  decimal: number;
  unsupported: boolean;
  isUniV3Supported: boolean;
  __typename: string;
  feeTier?: number;
  intermediateToken?: boolean;
}

export interface ContractConfig {
  address?: string;
  abi?: Array<any>;
  args?: Array<any>;
  functionName?: string;
  to?: string;
  value?: string | number | undefined;
  data?: string;
  message?: string;
}

export interface userRewardPoints {
  walletAddress?: string;
  addLiquidtyPoints: number;
  crossChainPoints: number;
  nftCaptain: number;
  nftMariner: number;
  nftNavigator: number;
  nftSkipper: number;
  nftVoyager: number;
  rewardsMulitplier: number;
  totalPoints: number;
  _typename: string;
}

export interface NFTConfig {
  image: string;
  name: string;
  alt: string;
  value: number;
}

export interface TokenSwap {
  amount: ethers.BigNumber;
  token: string;
  poolFeeTier: number;
  usdValue: string;
}

export interface PermitTokenSwap {
  amount: ethers.BigNumber;
  token: string;
  poolFeeTier: number;
}
