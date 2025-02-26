import { gql } from "@apollo/client";

export const GET_THORSWAP_QUOTE = gql`
  query ($fromTokenId: Float!, $toTokenId: Float!, $amount: Float!) {
    getNetworkFeeThorSwap(
      thorSwapFeeData: {
        fromTokenId: $fromTokenId
        toTokenId: $toTokenId
        amount: $amount
      }
    ) {
      thorSwapFee
      estimatedTime
    }
  }
`;
