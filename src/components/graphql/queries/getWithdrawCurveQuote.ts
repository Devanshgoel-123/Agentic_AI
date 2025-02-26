import { gql } from "@apollo/client";

export const GET_WITHDRAW_CURVE_QUOTE = gql`
  query (
    $slug: String!
    $lpTokenAmount: String!
    $slippage: Float!
    $withdrawType: CurveWithdrawType!
  ) {
    getCurveWithdrawQuote(
      withdrawQuoteCurveInput: {
        slug: $slug
        lpTokenAmount: $lpTokenAmount
        slippage: $slippage
        withdrawType: $withdrawType
      }
    ) {
      tokens {
        curveIndex
        amount
        minAmount
        token {
          id
          name
          tokenLogo
          decimal
          isNative
          curveIndex
          chain {
            chainId
            name
            chainLogo
          }
        }
      }
    }
  }
`;
