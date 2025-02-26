import { gql } from "@apollo/client";

export const GET_USER_CHATS = gql`
  query (
    $walletAddress: String!
    $chatId: Float!
  ) {
    getUserChatsWithAgent(
      getChatsInput: {
        walletAddress: $walletAddress
        chatId:$chatId
      }
    ) {
    quote
    query
    outputString
    toolCalled
    }
  }
`;