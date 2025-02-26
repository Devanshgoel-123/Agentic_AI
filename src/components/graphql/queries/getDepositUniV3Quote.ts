import { gql } from "@apollo/client";

export const GET_DEPOSIT_UNIV3_QUOTE = gql`
  query (
    $slug: String!
    $tokenId: Float!
    $slippage: Float!
    $amountToDeposit: String!
    $recipient: String!
    $tickLower: Float!
    $tickUpper: Float!
    $currentTick: Float!
  ) {
    getDepositQuoteUniv3(
      depositQuoteUniv3Input: {
        slug: $slug
        tokenId: $tokenId
        slippage: $slippage
        amountToDeposit: $amountToDeposit
        recipient: $recipient
        tickLower: $tickLower
        tickUpper: $tickUpper
        currentTick: $currentTick
      }
    ) {
      otherTokenAmount
      minAmountToken0
      minAmountToken1
    }
  }
`;
