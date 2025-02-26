import React, { act, useEffect, useRef, useState } from "react";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import { Box } from "@mui/material";
import "./styles.scss";

export const ProgressContainerTracking = () => {
  const { activeTransaction } = useTransferStore(
    useShallow((state) => ({
      activeTransaction: state.activeTransaction,
    }))
  );

  const [progressWidth, setProgressWidth] = useState("0%");
  const progressRef = useRef<HTMLDivElement>(null); 
 
  useEffect(() => {
    if(activeTransaction===undefined) return;
    if (activeTransaction?.status === "SUCCESS") {
      setProgressWidth("100%");
      return;
    }
    const updateProgress = () => {
      const elapsedTime = Math.floor((Date.now() - activeTransaction?.createdAt) / 1000);
      const totalTime = Number(activeTransaction?.estimatedTime);
      const percentage = Math.min((elapsedTime / totalTime) * 100, 100); 
      setProgressWidth(`${percentage}`);
    };
    updateProgress();
    const intervalId = setInterval(updateProgress, 1000);
    return () => clearInterval(intervalId);
  }, [activeTransaction,progressWidth]); 
  if (!activeTransaction) return null;
  const elapsedTime = Math.floor((Date.now() - activeTransaction?.createdAt) / 1000);
  const remainingTime = Math.max(Number(activeTransaction?.estimatedTime) - elapsedTime, 0); 

  return (
    <Box className="ProgressContainerTracking">
      <span>{activeTransaction.status!=="SUCCESS" ? `Estimated Time: ${Math.floor(remainingTime / 60)}min` : "SUCCESS"}</span>
      <Box
        className="ProgressBarWrapper"
      >
        <div
      ref={progressRef}
       style={{
        width:`${progressWidth}%`
       }}
       className="ProgressBarFull"
       >

      </div>
      </Box>
      
    </Box>
  );
};