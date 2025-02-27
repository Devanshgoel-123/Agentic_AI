import { GET_AGENT_RESPONSE } from "@/components/graphql/queries/getAgentResponse";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { act, useEffect } from "react";
import { useAgentStore } from "@/store/agent-store";
import { GET_USER_CHATS } from "@/components/graphql/queries/getUserChats";
import { userChatWithAgent } from "@/store/types/agent-type";
import { useState } from "react";
const useFetchUserChatsWithAgent=()=>{
    const {address}=useAccount();
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const {
        btcWalletAddress,
        destinationAddress
    }=useWalletConnectStore(useShallow((state)=>({
        btcWalletAddress:state.btcWalletAddress,
        destinationAddress:state.destinationAddress
    })))
    const {
        activeChatId,
        activeChat,
        activeResponse
    }=useAgentStore(useShallow((state)=>({
        activeChatId:state.activeChatId,
        activeChat:state.activeChat,
        activeResponse:state.activeResponse
    })))
    const {data,loading,refetch}=useQuery(GET_USER_CHATS,{
        variables:{
            walletAddress:address,
            chatId:activeChatId
        },
        skip:!activeChatId || address===undefined,
        fetchPolicy: "network-only",
        onCompleted:()=>{
            console.log("query completed")
            setShouldRefetch(false);
        }
    })
    const manualRefetch = () => {
        setShouldRefetch(true);
        return refetch();
      };
    
      useEffect(() => {
        if (shouldRefetch) {
          refetch();
        }
      }, [shouldRefetch, refetch]);
      useEffect(() => {
        if (activeChatId) {
          refetch();
        }
      }, [activeChatId, refetch]);
    let response:userChatWithAgent[]=data?.getUserChatsWithAgent || [{
        outputString:"",
        query:"",
        quote:"",
        toolCalled:false
    }]
    return {
        response:response,
        loading,
        refetch: manualRefetch
    }
}

export default useFetchUserChatsWithAgent