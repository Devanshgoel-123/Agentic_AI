import { gql } from "@apollo/client";

export const GET_AGENT_RESPONSE = gql`
  query (
    $userInput: String!
    $walletAddress: String!
    $btcWalletAddress: String
    $chatId: Float!
    $solanaWalletAddress:String
  ) {
    getAgentResponse(
      userInput: {
        input: $userInput
        walletAddress: $walletAddress
        btcWalletAddress: $btcWalletAddress
        chatId: $chatId
        solanaWalletAddress:$solanaWalletAddress
      }
    ) {
      outputString
      quote
      toolCalled
    }
  }
`;
