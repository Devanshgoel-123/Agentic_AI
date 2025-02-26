import { gql } from "@apollo/client";

export const GET_UNIV3_GRAPH = gql`
  query ($slug: String!, $reverseGraph: Boolean!) {
    getGraphData(
      graphDataInput: {
        slug: $slug
        surroundingTicks: 5000
        reverseGraph: $reverseGraph
      }
    ) {
      currentTick
      ticks {
        tickIdx
        liquidityActive
        liquidityLockedToken0
        liquidityLockedToken1
        isCurrent
      }
    }
  }
`;
