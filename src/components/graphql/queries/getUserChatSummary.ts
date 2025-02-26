import { gql } from "@apollo/client";


export const GET_USER_CHAT_SUMMARY=gql`
   query(
     $wallet_address:String!
){
     getUserChatSummaries(
     wallet_address:$wallet_address
     ){
     chatId
     user_query
     firstMessageDate
     }
}

`