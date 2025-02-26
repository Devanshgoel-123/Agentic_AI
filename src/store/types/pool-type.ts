import { number } from "bitcoinjs-lib/src/script";
import { Token } from "./token-type";

export interface BoostAPYData {
  boost: number;
  isBoosted: boolean;
  tokenName: string;
  tokenImage: string;
}

export interface PoolData {
  name: string;
  tvl: number;
  apy: number;
  lpFee: number;
  slug: string;
  poolType: string;
  boostInfo: BoostAPYData[];
  tokens: Token[];
  lpTokenImage: string;
  lpSymbol: string;
}

export interface PoolReservesData {
  tokenName: string;
  tokenImage: string;
  tokenAddress: string;
  tokenDecimal: 18;
  pythid: string;
  reserves: string;
}

export interface SinglePoolResponse {
  chainId: number;
  name: string;
  tvl: number;
  apy: number;
  lpFee: number;
  lpTokenAddress: string;
  lpTokenImage: string;
  lpSymbol: string;
  lpTokenDecimals: number;
  totalReserve: PoolReservesData[];
  contractAddress: string;
  routerAddress: string;
  dailyVolume: number;
  poolType: string;
  boostInfo: BoostAPYData[];
  tokens: Token[];
}

export interface PositionsResponse {
  token0Amount: string;
  token1Amount: string;
  liquidity: string;
  poolSlug: string;
  id: string;
  poolName: string;
  tickLower: {
    tickIdx: string;
  };
  tickUpper: {
    tickIdx: string;
  };
  collectedToken0: number;
  depositedToken0: number;
  lpFee: number;
  poolType: string;
  depositedToken1: number;
  token0PriceLower: number;
  token1PriceLower: number;
  token0PriceUpper: number;
  token1PriceUpper: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
  withdrawnToken0: number;
  withdrawnToken1: number;
  collectedToken1: number;
  pool: {
    id: string;
    tick: string;
  };
  isInRange: boolean;
  token0: Token;
  token1: Token;
  unclaimedFeesToken0: number;
  unclaimedFeesToken1: number;
}

export interface PoolContractType {
  address: string;
  abi: any;
  functionName: string;
  args: any;
  value?: any;
}

export interface UserChatSummary{
  chatId:number;
  user_query:string;
  firstMessageDate:number;
}
export interface GraphDataType {
  currentTick: number;
  ticks: Array<{
    tickIdx: number;
    liquidityActive: number;
    liquidityLockedToken0: number;
    liquidityLockedToken1: number;
    isCurrent: boolean;
  }>;
}

interface Reserve {
  tokenImage: string;
  __typename: string;
}

export interface PoolAnalyticsData {
  __typename: string;
  tvl: number;
  statsDiff: {
    apy_24_hours: number;
    fees_24_hours: number;
    volume_24_hours: number;
  };
  name: string;
  latestStats: {
    apy_24_hours: number;
    fees_24_hours: number;
    volume_24_hours: number;
  };
  totalReserve: Reserve[];
  lpFee: string;
}
