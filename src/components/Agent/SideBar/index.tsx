import React from "react";
import { EDDY_LOGO } from "@/utils/images";
import { useState,useEffect, } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { BsChatDotsFill } from "react-icons/bs";
import { SocialComponent } from "./Social";
import "./styles.scss";
import useFetchUserChatsWithAgent from "@/hooks/Agent/useFetchUserChatsWithAgent";
import { IoMdAdd } from "react-icons/io";
import { useAgentStore } from "@/store/agent-store";
import { useShallow } from "zustand/react/shallow";
import { UserChatSummary } from "@/store/types/pool-type";
import { TimeStampValue } from "@/utils/constants";
import { useMediaQuery } from "usehooks-ts";

export const Sidebar=()=>{
    const isXxlDevice=useMediaQuery("(min-width: 1280px)");
    const isXlDevice = useMediaQuery("(min-width: 1024px) and (max-width: 1279px)")
    const {
        userChatSummary,
        openArena
    }=useAgentStore(useShallow((state)=>({
        userChatSummary:state.userChatSummary,
        openArena:state.openArena
    })))
    const {
        refetch
      }=useFetchUserChatsWithAgent();

    const renderChatSummary=()=>{
        const charLimit = isXxlDevice ? 30 : isXlDevice ? 25 : 20;
        // const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
        // const todayChats = userChatSummary.filter((item: UserChatSummary) =>
        //     (currentTimeStamp - item.firstMessageDate) >= 0 &&
        //     (currentTimeStamp - item.firstMessageDate) < TimeStampValue.DAILY
        // );        
        // const yesterdayChats = userChatSummary.filter((item: UserChatSummary) => 
        //     (currentTimeStamp - item.firstMessageDate >= TimeStampValue.DAILY) && 
        //     (currentTimeStamp - item.firstMessageDate < 2 * TimeStampValue.DAILY)
        // );
        // const pastSevenDayChats = userChatSummary.filter((item: UserChatSummary) => 
        //     (currentTimeStamp - item.firstMessageDate >= 2 * TimeStampValue.DAILY) && 
        //     (currentTimeStamp - item.firstMessageDate < TimeStampValue.WEEKLY)
        // );
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const startOfSevenDays = new Date(yesterday);
        startOfSevenDays.setDate(yesterday.getDate() - 6); 
        const todayChats = userChatSummary.filter((item: UserChatSummary) => {
          const chatDate = new Date(item.firstMessageDate * 1000);
          return chatDate >= today;
        });
        const yesterdayChats = userChatSummary.filter((item: UserChatSummary) => {
          const chatDate = new Date(item.firstMessageDate * 1000);
          return chatDate >= yesterday && chatDate < today;
        });
        const pastSevenDayChats = userChatSummary.filter((item: UserChatSummary) => {
          const chatDate = new Date(item.firstMessageDate * 1000);
          return chatDate >= startOfSevenDays && chatDate < yesterday;
        });
        return (
            <div className="ChatHistorySideBar">
            {todayChats.length > 0 && <div className="PastChats">
            <span>Today</span>
               {
                todayChats.slice(0,4).map((item)=>{
                    return (
                        <span key={item.firstMessageDate} className="chatSummary" onClick={()=>{
                            useAgentStore.getState().handleOpenArena();
                            useAgentStore.setState({
                                activeChatId:item.chatId
                            })
                        }}>
                            {item.user_query.slice(0, 1).toUpperCase() +
                item.user_query.slice(1, charLimit).toLowerCase() +
                (item.user_query.length > charLimit ? "..." : "")}
                        </span>
                    )
                })
               }
            </div>}
           { yesterdayChats.length>0 && 
            <div className="PastChats">
            <span>Yesterday</span>
               {
                yesterdayChats.slice(0,4).map((item)=>{
                    return (
                        <span key={item.firstMessageDate} className="chatSummary" onClick={()=>{
                            useAgentStore.getState().handleOpenArena();
                            useAgentStore.setState({
                                activeChatId:item.chatId
                            })
                        }}>
                            {item.user_query.slice(0, 1).toUpperCase() +
                  item.user_query.slice(1, charLimit).toLowerCase() +
                  (item.user_query.length > charLimit ? "..." : "")}
                        </span>
                    )
                })
               }
            </div>
            }
            {pastSevenDayChats.length>0 &&
            <div className="PastChats">
            <span>Past 7 Days</span>
               {
                pastSevenDayChats.slice(0,4).map((item)=>{
                    return (
                        <span key={item.firstMessageDate} className="chatSummary" onClick={()=>{
                            useAgentStore.getState().handleOpenArena();
                            useAgentStore.setState({
                                activeChatId:item.chatId
                            })
                        }}>
                            {item.user_query.slice(0, 1).toUpperCase() +
                  item.user_query.slice(1, charLimit).toLowerCase() +
                  (item.user_query.length > charLimit ? "..." : "")}
                        </span>
                    )
                })
               }
            </div>
            }
            </div>
        )
    }
    return (
        <Box className="SideBarWrapper">
            <div className="TopContainer">
            <div className="SideBarHeader">
                <div >
                <Image src={EDDY_LOGO} height={25} width={25} alt="logo"/>
                </div>
           
            <span className="HeadingTextSidebar">The Assistant</span>
        </div>
        <div className="OptionContainer">
            <div className="OptionElement">
                <div className="optionElementLeft">
                <div className="SideBarIcon">
            <BsChatDotsFill />
            </div>
            <span>Chat</span>
                </div>
                <div className="PlusIcon" onClick={()=>{
                    useAgentStore.getState().clearCurrentValues()
                    useAgentStore.getState().setActiveChatId()
                    refetch()
                    if(!openArena){
                        useAgentStore.getState().handleOpenArena()
                    }
                }}>
                <IoMdAdd />
                </div>
                
            </div>
            
        </div>
        {renderChatSummary()}
        </div>
        <SocialComponent />
        </Box>
    )
}