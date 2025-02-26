import { gql } from "@apollo/client";

export const GET_BRIDGEABLE_TOKENS = gql`
  query (
    $chainId: Float!
    $isSwap: Boolean!
    $isSrcTokenUnsupported: Boolean!
  ) {
    getAllBridgableTokensForChain(
      getAllTokensForBridingData: {
        chainId: $chainId
        isSwap: $isSwap
        isSrcTokenUnsupported: $isSrcTokenUnsupported
      }
    ) {
      id
      isBridge
      isNative
      isStable
      isDefault
      address
      zrc20Address
      name
      tokenLogo
      pythId
      chain {
        chainId
        chainLogo
        name
      }
      decimal
      curveIndex
      unsupported
      isUniV3Supported
    }
  }
`;
