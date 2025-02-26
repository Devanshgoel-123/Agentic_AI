import { gql } from "@apollo/client";



export const GET_HISTORICAL_TVL=gql`
query{
  getHistoricalTvl{
    tvlHistorical {
      totalLiquidityUSD
      date
    }
    tvl
  }
}
`