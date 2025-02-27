import { create } from "zustand";
import { ContractConfig, Token } from "./types/token-type";
import { TokenRoute } from "./types/transaction-type";
import { UserChatSummary } from "./types/pool-type";
import { ActiveTransactionResponse } from "./types/agent-type";
export interface Response{
  outputString:string;
  quote:string;
  toolCalled?:boolean;
}

interface AgentStore{
  openArena:boolean;
  handleCloseArena:()=>void;
  handleOpenArena:()=>void;
  activeChat:string;
  sendingTransaction:boolean;
  userChatSummary:UserChatSummary[];
  disable:boolean;
  userChats:string[];
  setActiveChat:(chat:string)=>void;
  activeChatId:number;
  activeResponse:Response;
  agentResponses:Response[];
  setActiveResponse:(response:Response)=>void;
  clearCurrentValues:()=>void;
  activeTransactionHashResponse:ActiveTransactionResponse;
  setActiveChatId:()=>void;
  setUserChatSummary:(userChatSummary:UserChatSummary[])=>void;
  showTransactionHash:boolean;
  handleShowTransactionHash:(value:boolean)=>void;
  setActiveTransactionHashResponse:(response:ActiveTransactionResponse)=>void;
}

export const useAgentStore=create<AgentStore>((set,get)=>({
    openArena:false,
    activeResponse:{
      outputString:"",
      quote:"",
      toolCalled:false
    },
    activeTransactionHashResponse:{
      outputString:"",
      quote:"",
      query:"",
      activeTransactionHash:""
    },
    disable:false,
    sendingTransaction:false,
    showTransactionHash:false,
    activeChatId:1,
    userChatSummary:[],
    agentResponses:[],
    userChats:[],
    handleOpenArena:()=>{
        set((state)=>({
            openArena:true
        }))
    },
    handleCloseArena:()=>{
        set((state)=>({
            openArena:true
        }))
    },
    activeChat:"",
    setActiveChat:(chat:string)=>{
    set((state)=>{
      return {
        activeChat:chat,
        userChats:[...state.userChats,chat]
      }
    })
    },
    setActiveResponse:(response:Response)=>{
        set((state)=>({
              activeResponse:response,
              agentResponses:response!==undefined && response.quote==="" && response.outputString==="" ? [...state.agentResponses,response] : state.agentResponses
        }))
    },
      setActiveChatId:()=>{
        set((state)=>({
          activeChatId:state.activeChatId+1
        }))
      },
      clearCurrentValues:()=>{
        set((state)=>({
          activeChat:"",
          activeResponse:{
            outputString:"",
            quote:"",
            toolCalled:false
          }
      }))
      },
      setUserChatSummary:(chatSummary:UserChatSummary[])=>{
        set((state)=>({
          userChatSummary:chatSummary
        }))
      },
      handleShowTransactionHash:(value:boolean)=>{
        set((state)=>({
          showTransactionHash:value
        }))
      },
    setActiveTransactionHashResponse:(response:ActiveTransactionResponse)=>{
      set((state)=>({
        activeTransactionHashResponse:response
      }))
    }
}))