import { gql } from "@apollo/client";


export const GET_QUOTE_FOR_DUST_TRANSACTION=gql`
query(
   $destinationToken:TokenInput!
   $walletAddress:String!
   $sourceChain:Int!
   $destinationChain:Int!
){
   getQuoteForDustBridgeData(
      quoteDustInputData:{
      destinationToken: $destinationToken
      walletAddress: $walletAddress
      sourceChain: $sourceChain
      destinationChain: $destinationChain
}
   ){
    contractConfig{
      address
      abi
      functionName
      to
}
    message
    permit2Address
}
}
`