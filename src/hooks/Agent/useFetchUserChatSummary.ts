import { GET_USER_CHAT_SUMMARY } from "@/components/graphql/queries/getUserChatSummary";
import { useAgentStore } from "@/store/agent-store";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";


export const useFetchUserChatSummary=()=>{
  const {address}=useAccount()
  const {data,loading,error}=useQuery(GET_USER_CHAT_SUMMARY,{
    variables:{
        wallet_address:address
    },
    skip:address===undefined,
    fetchPolicy:"network-only",
    onCompleted:()=>{
      console.log("completed")
    }
  })
  useEffect(()=>{
    if(data && data.getUserChatSummaries){
        useAgentStore.getState().setUserChatSummary(data.getUserChatSummaries || [])
        useAgentStore.setState({
          activeChatId:data.getUserChatSummaries[0]?.chatId+1 || 1
        })
    }
  },[data])
  return {
    data:data?.getUserChatSummaries,
    loading,
  }
}