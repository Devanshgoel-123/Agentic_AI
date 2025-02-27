import { SEND_REWARD_CLAIM_TRANSACTION } from "@/components/graphql/mutations/addClaimRewardTransaction";
import { useMutation } from "@apollo/client";
import { useAccount } from "wagmi";



export const useSendRewardClaimTransaction=()=>{
    const {address}=useAccount();
    const [claimReward]=useMutation(SEND_REWARD_CLAIM_TRANSACTION)

    const sendClaimTransaction=async(taskId:number,category_id:number)=>{
        if(!taskId || address===undefined) return;
        try{
            const result=await claimReward({
                variables:{
                    taskId:taskId,
                    walletAddress:address,
                    socialTask:category_id===1
                }
            })
            return result.data.claimRewardForTask
        } catch(err){
            console.log(err)
        }
    }
    return {sendClaimTransaction};
}