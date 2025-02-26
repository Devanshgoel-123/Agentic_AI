import { gql } from "@apollo/client";

export const GET_POSITIONS_FOR_WALLET = gql`
  query ($owner: String!) {
    getPositionData(positionDataInput: { owner: $owner }) {
      postionManagerAddress
      positions {
        token0Amount
        token1Amount
        poolSlug
        liquidity
        id
        poolName
        tickLower {
          tickIdx
        }
        tickUpper {
          tickIdx
        }
        collectedToken0
        depositedToken0
        lpFee
        poolType
        depositedToken1
        token0PriceLower
        token1PriceLower
        token0PriceUpper
        token1PriceUpper
        collectedFeesToken0
        collectedFeesToken1
        withdrawnToken0
        withdrawnToken1
        collectedToken1
        pool {
          id
          tick
        }
        isInRange
        token0 {
          id
          name
          tokenLogo
          chain {
            name
            chainId
            chainLogo
          }
          address
          pythId
          decimal
          isNative
          isStable
          curveIndex
        }
        token1 {
          id
          name
          tokenLogo
          chain {
            name
            chainId
            chainLogo
          }
          address
          pythId
          decimal
          isNative
          isStable
          curveIndex
        }
        lpFee
        poolType
        unclaimedFeesToken0
        unclaimedFeesToken1
      }
    }
  }
`;
