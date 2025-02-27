import { GET_AGENT_RESPONSE } from "@/components/graphql/queries/getAgentResponse";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useAgentStore } from "@/store/agent-store";
import { useWallet } from "@solana/wallet-adapter-react";
const useFetchAgentResponse=(userInput:string)=>{
    const {address}=useAccount();
    const { publicKey } = useWallet();
    const {
        btcWalletAddress,
        destinationAddress
    }=useWalletConnectStore(useShallow((state)=>({
        btcWalletAddress:state.btcWalletAddress,
        destinationAddress:state.destinationAddress
    })))

    const {
        chatId
    }=useAgentStore(useShallow((state)=>({
        chatId:state.activeChatId
    })))
    const {data,loading,refetch}=useQuery(GET_AGENT_RESPONSE,{
        variables:{
            input:userInput,
            walletAddress:address,
            btcWalletAddress:btcWalletAddress || "",
            solanaWalletAddress:publicKey || "",
            chatId:chatId
        },
        skip:userInput==="" || address===undefined,
        fetchPolicy:"no-cache"
    })
    useEffect(()=>{
        if (data?.getAgentResponse) {
            useAgentStore.getState().setActiveResponse({
                outputString: data.getAgentResponse.outputString,
                quote: data.getAgentResponse.quote,
                toolCalled:data.getAgentResponse.toolCalled
            });
        }
    },[data])
    return {
        response:data?.getAgentResponse,
        loading,
    }
}

export default useFetchAgentResponse