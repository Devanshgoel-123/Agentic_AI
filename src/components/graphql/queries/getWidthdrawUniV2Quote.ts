import { gql } from "@apollo/client";

export const GET_WITHDRAW_UNIV2_QUOTE = gql`
  query ($slug: String!, $lpTokenAmount: String!, $slippage: Float!) {
    getWithdrawQuote(
      withdrawQuoteUniswapInput: {
        slug: $slug
        lpTokenAmount: $lpTokenAmount
        slippage: $slippage
      }
    ) {
      token1Amount
      token2Amount
      minAmountToken1
      minAmountToken2
      token1 {
        name
        tokenLogo
        decimal
        id
        address
        zrc20Address
        pythId
        isBridge
        isCurve
        isNative
        chain {
          chainId
          chainLogo
          name
        }
      }
      token2 {
        name
        tokenLogo
        decimal
        id
        address
        zrc20Address
        pythId
        isBridge
        isCurve
        isNative
        chain {
          chainId
          chainLogo
          name
        }
      }
    }
  }
`;
