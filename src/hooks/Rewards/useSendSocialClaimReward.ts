import { SEND_SOCIAL_REWARD_CLAIM_TRANSACTION } from "@/components/graphql/mutations/addClaimSocialReward";
import { useMutation } from "@apollo/client";
import { useAccount } from "wagmi";


interface Status{
    status:boolean
}
export const useSendSocialRewardClaimTransaction=()=>{
    const {address}=useAccount();
    const [claimReward]=useMutation(SEND_SOCIAL_REWARD_CLAIM_TRANSACTION)

    const sendSocialClaimTransaction=async(taskId:number):Promise<Status>=>{
        if(!taskId || address===undefined) return {status:false};
        try{
            const result=await claimReward({
                variables:{
                    taskId:taskId,
                    walletAddress:address,
                   socialTask:true
                }
            })
            if(result.data!==null){
                return {
                    status:result.data.completeTaskForUser.status
                }
            }
            return {status:false}
        } catch(err){
            console.log(err)
            return {status:false}
            
        }
    }
    return {sendSocialClaimTransaction};
}