import { gql } from "@apollo/client";


export const CHECK_ELIGIBILITY_FOR_TASK=gql`
  query checkTaskEligibility($taskId:Float! , $walletAddress:String!, $socialTask:Boolean!){
  checkTaskEligibility(
   checkTaskEligibleParams:{
   taskId:$taskId,
   walletAddress:$walletAddress,
   socialTask:$socialTask
}
  ){
   eligible 
   claimed
   socialTaskDone
}
}
`