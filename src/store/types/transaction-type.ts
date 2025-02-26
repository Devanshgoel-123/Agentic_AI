import { Token } from "./token-type";

export interface ChainStatus {
  blockConfirmations?: number;
  status?: "SUCCESS" | "PENDING" | "FAILED";
  totalConfirmationBlocks?: number;
  destinationChainHash?: string;
  sourceChainHash?: string;
  zetaChainHash?: string;
}

export interface ActiveTransaction {
  fromToken: Token;
  toToken: Token;
  estimatedTime: number;
  hash: string;
  createdAt:number;
  status?: "SUCCESS" | "PENDING" | "FAILED";
}

export interface ActiveTransactionDust{
  fromTokens:Token[],
  toToken:Token,
  hash:string,
  createdAt:number,
  status?: "SUCCESS" | "PENDING" | "FAILED";
}

export interface RouteImage {
  chainImage: string;
  tokenImage: string;
  tokenName: string;
  tokenChainId: number;
}

export interface TokenRoute {
  source: RouteImage;
  intermediates: RouteImage[];
  destination: RouteImage;
}

export interface TransactionHistory {
  __typename?: string;
  id?: number;
  walletAddress?: string;
  type?: string;
  poolName?: string;
  poolType?: string;
  poolTokenImages?: string[];
  sourceChainHash?: string;
  sourceChainId: number;
  destChainId?: number;
  sourceChainImage?: string;
  destChainImage?: string;
  sourceTokenImage?: string;
  destTokenImage?: string;
  sourceChainAmount?: string;
  zetaChainHash?: string;
  destChainHash?: string;
  createdAt?: number;
  sourceChainTokenName?: string;
}
