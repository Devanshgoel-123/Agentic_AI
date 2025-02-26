import { gql } from "@apollo/client";

export const GET_WITHDRAW_UNIV3_QUOTE = gql`
  query (
    $nftId: Float!
    $percentage: Float!
    $slippage: Float!
    $slug: String!
  ) {
    getWithdrawQuoteUniv3(
      withdrawQuoteUniv3Input: {
        nftId: $nftId
        percentage: $percentage
        slippage: $slippage
        slug: $slug
      }
    ) {
      token0Amount
      token1Amount
      minAmountToken0
      minAmountToken1
      liquidity
    }
  }
`;
