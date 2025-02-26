import { gql } from "@apollo/client";

export const GET_BTC_GAS_QUOTE_DUST=gql`
query (
   $sourceChain: Int!
   $sourceTokens: [TokenSwap!]! 
   $destinationTokenId: Int!
   $destinationChain: Int!
   $intermediateTokenId: Int!
) {
  getQuoteForDustBTCTranxn(
     quoteInputDustBtc:{
     sourceChain:$sourceChain
     sourceTokens:$sourceTokens
     destinationTokenId:$destinationTokenId
     destinationChain:$destinationChain
     intermediateTokenId:$intermediateTokenId
}
  ) {
    outputGasFees
    minAmountOut
    inputGasFees
  }
}
`;