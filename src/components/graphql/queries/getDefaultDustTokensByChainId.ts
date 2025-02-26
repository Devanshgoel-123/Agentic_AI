import { gql } from "@apollo/client";

export const GET_DEFAULT_BRIDGEABLE_DUST_TOKENS = gql`
  query ($chainId: Float!, $chainType: String!) {
    getAllBridgableTokensForChainDustAggregator(
      getAllTokensForChainDust: {
        chainId: $chainId
        chainType:$chainType
      }
    ) {
      id
      isBridge
      isNative
      isStable
      pythId
      address
      zrc20Address
      tokenLogo
      name
      chain {
        chainId
        chainLogo
        name
      }
      decimal
      isDefault
      curveIndex
      feeTier
      intermediateToken
    }
  }
`;
