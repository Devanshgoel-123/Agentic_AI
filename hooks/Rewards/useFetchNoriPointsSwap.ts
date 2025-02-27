import { GET_NORI_POINTS_SWAP } from "@/components/graphql/queries/getNoriPointsForSwap";
import useTransferStore from "@/store/transfer-store";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export const useFetchNoriPointsForSwap=(fromChainId:number,toChainId:number,dollarValueTrade:number)=>{
    const {data,loading,error}=useQuery(GET_NORI_POINTS_SWAP,{
        variables:{
            fromChainId:fromChainId,
            toChainId:toChainId,
            dollarValueTrade:dollarValueTrade
        },
        skip: !fromChainId || !toChainId || !dollarValueTrade
    })
    let points=data?.checkRewardPointsForSolanaSwap?.points || 0;
    useEffect(()=>{
        useTransferStore.getState().setRewardPoints(points)
    },[data])
   return {
    points,
    loading
   }
    
}