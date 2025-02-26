import React from "react";
import Box from "@mui/material/Box"
import "./styles.scss";
import useWalletConnectStore from "@/store/wallet-store";
export const RewardsButtonContainer=()=>{
    
    return (
        <Box className="rewardsButton" onClick={()=>{
            useWalletConnectStore.getState().handleOpenCollectionModal()
        }}>
        <span >More Details</span>
        </Box>
    )
}

