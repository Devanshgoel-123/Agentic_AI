import { gql } from "@apollo/client";

export const GET_DEFAULT_BRIDGEABLE_TOKENS = gql`
  query ($chainId: Float!) {
    getAllDefaultBridgeableTokensForChain(
      getAllTokensForBridgingData: {
        chainId: $chainId
        isSwap: false
        isSrcTokenUnsupported: false
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
      unsupported
      isUniV3Supported
    }
  }
`;
