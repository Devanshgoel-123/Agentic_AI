import { gql, useQuery } from "@apollo/client";

export const GET_NORI_POINTS_SWAP = gql`
  query CheckRewardPoints($fromChainId: Float!, $toChainId: Float!, $dollarValueTrade: Float!) {
    checkRewardPointsForSolanaSwap(
      checkRewardPointsForSolanaParams: {
        fromChainId: $fromChainId,
        toChainId: $toChainId,
        dollarValueTrade: $dollarValueTrade
      }
    ) {
      points
    }
  }
`;