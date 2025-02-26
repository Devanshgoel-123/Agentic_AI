"use client";
import React, { useState } from "react";
import "./styles.scss";
import Box from "@mui/material/Box";
import CustomIcon from "@/components/common/CustomIcon";
import mixpanel from "mixpanel-browser";
import { useAgentStore } from "@/store/agent-store";

interface Props {
  logo: string;
  name: string;
  chainId: number;
  currentChainId: number;
  getDefaultTokens: (chain: number) => void;
  setChainId: (chainId: number) => void;
  callBack: () => void;
  actionType:string;
}

export const ChainLabel = ({
  logo,
  name,
  currentChainId,
  chainId,
  getDefaultTokens,
  setChainId,
  callBack,
  actionType,
}: Props) => {
  const [showLine, setShowLine] = useState(false);
   const track_event_chain_click=()=>{
      if (chainId === currentChainId) return;
      setChainId(chainId);
    getDefaultTokens(chainId);
    actionType=="From"  ? 
    mixpanel.track("from_chain_click",{
      chain_name:`${name}`
    }):
    mixpanel.track("to_chain_click",{
      chain_name:`${name}`
    }) 
    callBack();
   }
  return (
    <Box
      className={`ChainLabel ${
        showLine || (currentChainId === chainId) ? "show-line" : ""
      }`}
      onClick={track_event_chain_click}
      onMouseOver={() => setShowLine(true)}
      onMouseOut={() => setShowLine(false)}
    >
      <Box className="ChainLogo">
        <CustomIcon src={logo} />
      </Box>
      <span className="ChainName">{name}</span>
    </Box>
  );
};
