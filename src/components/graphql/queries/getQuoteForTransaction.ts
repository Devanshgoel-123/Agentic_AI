import { gql } from "@apollo/client";

export const GET_QUOTE_FOR_TRANSACTION = gql`
  query (
    $fromAmount: String!
    $fromChainId: Float!
    $toChainId: Float!
    $fromTokenId: Float!
    $toTokenId: Float!
    $slippage: Float!
    $walletAddress: String
    $btcWalletAddress: String
  ) {
    getQuoteForBridgeData(
      quoteInputData: {
        fromAmount: $fromAmount
        fromChainId: $fromChainId
        toChainId: $toChainId
        toTokenId: $toTokenId
        fromTokenId: $fromTokenId
        slippage: $slippage
        walletAddress: $walletAddress
        btcWalletAddress: $btcWalletAddress
      }
    ) {
      destChainGasFees
      estimatedRecievedAmount
      quoteAmount
      srcChainGasFees
      minimumReceived
      slippage
      zetaFees
      protocolFees
      isProtocolFeeZero
      estimatedTime
      route {
        source {
          chainImage
          tokenImage
          tokenName
          tokenChainId
        }
        intermediates {
          chainImage
          tokenImage
          tokenName
          tokenChainId
        }
        destination {
          chainImage
          tokenImage
          tokenName
          tokenChainId
        }
      }
      contractConfig {
        address
        abi
        args
        functionName
        to
        value
        data
      }
    }
  }
`;
