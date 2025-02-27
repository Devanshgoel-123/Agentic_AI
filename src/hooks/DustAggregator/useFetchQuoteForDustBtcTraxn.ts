import { GET_BTC_GAS_QUOTE_DUST } from "@/components/graphql/queries/getGasQuoteForBtcDust";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { ChainIds } from "@/utils/enums";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { CHAIN_IDS } from "@/utils/constants";
import { useEffect } from "react";
interface sourceTokenAddressType{
    tokenAddress:string;
    amount:string
}
interface Props{
    sourceChain: number;
    sourceTokenAddress:sourceTokenAddressType[];
    destinationChain: number;
}

export const useFetchQuoteForDustBtcTransaction=({
    sourceChain,
    sourceTokenAddress,
    destinationChain
}:Props)=>{
    const {address}=useAccount();
    const {
        btcWalletAddress,
        destinationAddress
    }=useWalletConnectStore(useShallow((state)=>({
        btcWalletAddress:state.btcWalletAddress,
        destinationAddress:state.destinationAddress
    })))
   const {
    intermediateToken
   }=useDustAggregatorStore(useShallow((state)=>({
    intermediateToken:state.sourceChainIntermediateToken
   })))
    const {
        loading,
        data,
        error
    }=useQuery(
        GET_BTC_GAS_QUOTE_DUST,
        {
            variables:{
                sourceChain:sourceChain,
                sourceTokens:sourceTokenAddress,
                destinationTokenId:useDustAggregatorStore.getState().destinationToken?.id as number,
                destinationChain:useDustAggregatorStore.getState().destinationChain as number,
                intermediateTokenId:useDustAggregatorStore.getState().sourceChainIntermediateToken?.id as number
            },
            skip:sourceTokenAddress.length===0 || (destinationChain===ChainIds.BITCOIN ? (btcWalletAddress===undefined && destinationAddress===undefined) : address===undefined) || (intermediateToken===undefined && sourceChain!==CHAIN_IDS.ZETACHAIN) || useDustAggregatorStore.getState().destinationChainGasToken===undefined||destinationChain===undefined,
        }
    )
    useEffect(()=>{
        if(data && data.getQuoteForDustBTCTranxn){
            useDustAggregatorStore.getState().setMinAmountOut(data.getQuoteForDustBTCTranxn.minAmountOut)
            useDustAggregatorStore.getState().setSourceGasAmount(data.getQuoteForDustBTCTranxn.inputGasFees)
            useDustAggregatorStore.setState({
                gasFeesDestination:data.getQuoteForDustBTCTranxn.outputGasFees,
            })
        }
    },[data])
    return {loading,error}
}
