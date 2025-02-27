import { useAccount} from "wagmi";
import {  TokenSwap } from "@/store/types/token-type";
import { GET_APPROVAL_STATUS } from "@/components/graphql/queries/getApprovalStatus";
import {  useLazyQuery } from "@apollo/client";
import {BigNumber } from "v5n";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useEffect } from "react";
import { PERMIT2_ADDRESS } from "@uniswap/permit2-sdk";



export const useFetchLazyPermitApprovalForToken = () => {
  const [getApproval,{
    refetch
  }]=useLazyQuery(GET_APPROVAL_STATUS);
  const { address } = useAccount();
  const fetchApproval = async (params: TokenSwap) => {
    const currentToken=useDustAggregatorStore.getState().sourceTokens.filter((item)=>{
      return item.address===params.token
    })
    const result = await getApproval({
      variables: {
        walletAddress:address as string,
        contractAddress:PERMIT2_ADDRESS as `0x${string}`,
        amount:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        tokenId: Number(currentToken[0].id ?? 1),
      },
      fetchPolicy:"no-cache"
    });
    if (!result || !result.data) {
       const resultObject={
        loading: (result.loading || false),
        error: result.error || new Error("Failed to fetch approval status"),
        approval: false,
        config: null,
        tokenAddress: params.token
       }
       return resultObject;
    }
   const resultObject={
    loading: result.loading || false,
    error: result.error || new Error("fetched correctly"),
    approval: result.data.getApprovalStatusForWallet
    ? result.data.getApprovalStatusForWallet.approvalStatus
    : false, 
  config: result.data.getApprovalStatusForWallet
    ? result.data.getApprovalStatusForWallet.approvalConfig
    : null, 
    tokenAddress:params.token
   }
  
    return resultObject
  };

  return {
    fetchApproval,
    refetch
  };
};
