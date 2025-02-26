import { gql } from "@apollo/client";



export const SEND_REWARD_CLAIM_TRANSACTION=gql`
mutation claimRewardForTask($taskId:Float! , $walletAddress:String!, $socialTask:Boolean!){
  claimRewardForTask(
   claimRewardParams:{
   taskId:$taskId,
   walletAddress:$walletAddress,
   socialTask:$socialTask
}
  ){
   status
}
}
`