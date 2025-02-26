import { gql } from "@apollo/client";

export const GET_DEPOSIT_CURVE_QUOTE = gql`
  query ($slug: String!, $tokens: [CurveTokens!]!, $slippage: Float!) {
    getCurveDepositQuote(
      depositQuoteCurveInput: {
        slug: $slug
        tokens: $tokens
        slippage: $slippage
      }
    ) {
      minAmountLp
      lpTokenAmount
    }
  }
`;
