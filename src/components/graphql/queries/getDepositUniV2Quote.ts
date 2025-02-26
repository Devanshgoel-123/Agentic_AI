import { gql } from "@apollo/client";

export const GET_DEPOSIT_UNIV2_QUOTE = gql`
  query (
    $slug: String!
    $tokenId: Float!
    $slippage: Float!
    $amount: String!
  ) {
    getDepositQuote(
      depositQuoteUniswapInput: {
        slug: $slug
        tokenId: $tokenId
        slippage: $slippage
        amount: $amount
      }
    ) {
      minAmountLp
      tokenAmount
      lpTokenAmount
      minAmountToken1
      minAmountToken2
    }
  }
`;
