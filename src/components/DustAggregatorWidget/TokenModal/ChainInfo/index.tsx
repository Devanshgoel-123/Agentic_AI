import React, { act, use, useEffect, useState } from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { CHAIN_IDS } from "@/utils/constants";

interface Props {
  actionType: string;
  logo: string;
  name: string;
  chainId: number;
  currentChain: number;
  callBackFn: () => void;
  setterFunction: (chain: number) => void;
}

export const ChainInfo = ({
  logo,
  chainId,
  name,
  actionType,
  currentChain,
  callBackFn,
  setterFunction,
}: Props) => {
  const [showLine, setShowLine] = useState(false);
   
    if(chainId===CHAIN_IDS.SOLANA){
      return
    }
  
    if(actionType==="source" && chainId===CHAIN_IDS.BITCOIN_MAINNET ){
      return
    }

const handleSetActiveChain = () => {
    setterFunction(chainId);
    if(actionType==="source"){
      useDustAggregatorStore.getState().clearSourceChainToken()
      useDustAggregatorStore.getState().clearTokenSwapForPermit()
      useDustAggregatorStore.getState().setClearTotalDustValue()
      useDustAggregatorStore.getState().setSourceGasAmount("0")
      useDustAggregatorStore.getState().setSourceChainGasFeesUsd("0")
    }
    callBackFn();
    
  };
  
  return (
    <div
      onMouseOver={() => setShowLine(true)}
      onMouseOut={() => setShowLine(false)}
      className={`ChainInfo ${
        showLine || currentChain === chainId ? "show-line" : ""
      }`}
      onClick={handleSetActiveChain}
    >
      <div className="ChainLogo">
        <CustomIcon src={logo} />
      </div>
      <span className="ChainName">{name}</span>
    </div>
  );
};
