import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box"
import { motion } from "framer-motion";
import "./styles.scss";
import { TOAST_TYPE } from "@/utils/enums";
import useHandleToast from "@/hooks/common/useHandleToast";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { THRESHOLD_EXCEEDED } from "@/utils/toasts";
export const ThresholdContainer=()=>{
    const [threshold,setThreshold]=useState<string>("")
  /**
   * Function to set the threshold Value.
   * @param e Capture event.
   */
const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const value=e.target.value;
    setThreshold(value)
    if(Number(value)<50 && value!==""){
    useDustAggregatorStore.getState().setTokenThreshold(value);
    const updatedTokenSwapForPermit=useDustAggregatorStore.getState().tokenSwapForPermit.filter((item)=>Number(item.usdValue)<Number(useDustAggregatorStore.getState().threshold));
    const filteredTokenAddresses = updatedTokenSwapForPermit.map(item => item.token);
    const updatedSourceTokens = useDustAggregatorStore.getState().sourceTokens.filter((token) => filteredTokenAddresses.includes(token.address));
    const totalUsdValue = updatedTokenSwapForPermit.reduce(
      (sum, item) => sum + (Number(item.usdValue) || 0),
      0
    );
    useDustAggregatorStore.setState({
      tokenSwapForPermit:updatedTokenSwapForPermit,
      sourceTokens:updatedSourceTokens,
      totalDustValue:totalUsdValue
    })
    }
 if(value===""){
  useDustAggregatorStore.getState().setTokenThreshold("50")
 }
}
 const {handleToast}=useHandleToast();
const handleToastRef = useRef<
      (
        heading: string,
        subHeading: string,
        type: string,
        hash?: string | undefined,
        chainId?: number | undefined
      ) => void
    >(handleToast);
    useEffect(()=>{
      if(Number(threshold)>50){
        handleToastRef.current(
          THRESHOLD_EXCEEDED.heading,
          THRESHOLD_EXCEEDED.subHeading,
          TOAST_TYPE.INFO
        );
        setTimeout(()=>{
          setThreshold("")
        },500)
      }
    },[threshold])
  return (
    <Box className="TokenThresholdContainer">
      <Box className="ContainerLabelThreshold">Token Value Threshold</Box>
      <div className="InputBox">
      <input
        value={threshold ?? ""}
        placeholder="Enter Amount"
        className="Threshold-Input"
        onChange={handleChange}
        
      />
      <div>
      <span className="usdText">
        USD
      </span>
    </div>

      </div>
      
        <div className="StatusContainer">
            <motion.span
              transition={{ delay: 0.1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ color: "#1e1e1e" }}
              className="Status"
            >
            </motion.span>
        </div>
    </Box>
  );
}

