import { gql } from "@apollo/client";

export const GET_TRADING_VOLUME_ANALYTICS=gql`
query ($type:String!) {
  getTradingVolumeAnalytics(tradingVolumeAnalytics: {
    type: $type
  }) {
    transactions
    day
    uaw
    volume
  }
}
`