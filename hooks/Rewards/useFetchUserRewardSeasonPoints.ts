import { GET_REWARD_SEASON_POINTS_FOR_WALLET } from "@/components/graphql/queries/getUserRewardSeasonPoints";
import { useRewardsStore } from "@/store/rewards-store";
import useWalletConnectStore from "@/store/wallet-store";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";


export const useFetchUserRewardSeasonPoints=()=>{
    const { address }=useAccount();
    const {loading,error,data,refetch}=useQuery(GET_REWARD_SEASON_POINTS_FOR_WALLET,{
        variables:{
            walletAddress:address
        },
        skip:address===undefined ,
    })
    useEffect(()=>{
        if(data && data.getUserDetailsRewards){
            useRewardsStore.getState().setUserSeasonRewards(data.getUserDetailsRewards)
        }
    },[address,data])
    return {
        data,loading
    }
}