import { gql } from "@apollo/client";


export const GET_POOL_ANALYTICS_FOR_CHAIN=gql`
 query ($chainId:Float!){
  getPoolAnalyticsForChain(poolAnalyticsForChainParams: { chainId:$chainId }) {
    statsDiff {
      apy_24_hours
      fees_24_hours
      volume_24_hours
    }
    name
    tvl
    totalReserve{
    tokenImage
}
    lpFee
    latestStats {
      apy_24_hours
      fees_24_hours
      volume_24_hours
    }
  }
}
`