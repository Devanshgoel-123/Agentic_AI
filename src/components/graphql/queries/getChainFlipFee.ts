import { gql } from "@apollo/client";

export const GET_CHAIN_FLIP_QUOTE = gql`
  query ($fromTokenId: Float!, $toTokenId: Float!, $amount: String!) {
    getNetworkFeeChainFlip(
      networkFeeData: {
        fromTokenId: $fromTokenId
        toTokenId: $toTokenId
        amount: $amount
      }
    ) {
      chainFlipFee
      estimatedTime
    }
  }
`;
