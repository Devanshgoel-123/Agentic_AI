import { CHECK_ELIGIBILITY_FOR_TASK } from "@/components/graphql/queries/getEligibilityForTask";
import { Eligibility } from "@/store/types/rewards";
import useWalletConnectStore from "@/store/wallet-store";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";


export const useCheckEligiblityForTask=(taskId:number,category_id:number)=>{
    const {address}=useAccount();
    const {data,error,loading}=useQuery(CHECK_ELIGIBILITY_FOR_TASK,{
        variables:{
            walletAddress:address,
            taskId:taskId,
            socialTask:category_id===1
        },
        skip:!taskId || (address===undefined),
        fetchPolicy:"no-cache"
    })
    const eligibility:Eligibility=data?.checkTaskEligibility
    return {
        eligibility,
        loading
    }
}