import { GET_QUOTE_FOR_DUST_TRANSACTION } from "@/components/graphql/queries/getQuoteForDustTransaction";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { Token } from "@/store/types/token-type"
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ContractConfig } from "@/store/types/token-type";
import { ChainIds } from "@/utils/enums";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
interface Props{
    destinationToken:Token;
    isRefetch?: boolean;
    sourceChain: number;
    destinationChain:number;
    isSkip:boolean;
}

export const useFetchQuoteDustForTransaction=({
    destinationToken,
    isRefetch,
    isSkip,
    sourceChain,
    destinationChain
}:Props)=>{
    const {address}=useAccount();
    
    const {
        loading,
        data,
        error
    }=useQuery(
        GET_QUOTE_FOR_DUST_TRANSACTION,
        {
            variables:{
                destinationToken:destinationToken,
                walletAddress: destinationChain!==ChainIds.BITCOIN ? address as string : (useWalletConnectStore.getState().btcWalletAddress===undefined ? useWalletConnectStore.getState().destinationAddress : useWalletConnectStore.getState().btcWalletAddress) as string,
                sourceChain:sourceChain,
                destinationChain:destinationChain
            },
            skip:isSkip,
            fetchPolicy: isRefetch ? "no-cache" : "cache-first",
        }
    )
    
    useEffect(()=>{
        if (data && data.getQuoteForDustBridgeData){
            const config:ContractConfig={
                address:data.getQuoteForDustBridgeData.contractConfig.address,
                abi:data.getQuoteForDustBridgeData.contractConfig.abi,
                functionName:data.getQuoteForDustBridgeData.contractConfig.functionName,
                message:data.getQuoteForDustBridgeData.message,
            }
            useDustAggregatorStore.getState().setContractConfig(config)
        }
    },[data])
    return {loading,error}
}
