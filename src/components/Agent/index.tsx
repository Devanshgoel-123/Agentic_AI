"use client"
import React from "react";
import { ChatBox } from "./AgentChatbox";
import "./styles.scss"
import { useAgentStore } from "@/store/agent-store";
import { useShallow } from "zustand/react/shallow";
import { AgentArena } from "./AgentArena";
import { Sidebar } from "./SideBar";
import { useAccount } from "wagmi";
import { ConnectWalletContainer } from "./ConnectWalletContainer";
import { useFetchUserChatSummary } from "@/hooks/Agent/useFetchUserChatSummary";
export const ChatAgent=()=>{
    const {
        data,
        loading
    }=useFetchUserChatSummary();
    const {
        address
    }=useAccount();
    const {
        openArena
    }=useAgentStore(useShallow((state)=>({
        openArena:state.openArena
    })))
       return (
        <div className="AgentUIWrapper">
        <Sidebar/>
        {!openArena ? <div className="ChatBoxWrapper">
            <ChatBox/>
        </div>
        :
        <div className="AgentArenaWrapper">
            {address===undefined && <ConnectWalletContainer/>} 
            <AgentArena/>
        </div>}
        </div>
       )
}