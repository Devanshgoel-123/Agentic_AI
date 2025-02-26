import { gql } from "@apollo/client";



export const SEND_SOCIAL_REWARD_CLAIM_TRANSACTION=gql`
mutation completeTaskForUser($taskId:Float! , $walletAddress:String!){
  completeTaskForUser(
   completeTaskParams:{
   taskId:$taskId,
   walletAddress:$walletAddress
   socialTask:true
}
  ){
   status
}
}
`