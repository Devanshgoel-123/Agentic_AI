import { gql } from "@apollo/client";

export const GET_DEEP_LINK_DATA = gql`
  query (
    $sourceChain: Float!
    $sourceToken: String!
    $destinationChain: Float!
    $destinationToken: String!
  ) {
    getTokenDataFromAddress(
      tokenFromAddressInput: {
        sourceChain: $sourceChain
        sourceToken: $sourceToken
        destinationChain: $destinationChain
        destinationToken: $destinationToken
      }
    ) {
      sourceToken {
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
      destinationToken {
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
      sourceGasTokenID
      destinationGasTokenID
      destinationChainGasToken {
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
      sourceChainGasToken {
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
  }
`;
