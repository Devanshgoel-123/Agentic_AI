"use client"
import Box from "@mui/material/Box"
import "./styles.scss"
import useWalletConnectStore from "@/store/wallet-store"
import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { useAccount } from "wagmi"
import { userRewardPoints } from "@/store/types/token-type"
export const RewardPointsContainer = () => {
    const {address}=useAccount();
    const {
        userRewardPointsArray
    }=useWalletConnectStore(useShallow((state)=>({
        userRewardPointsArray:state.userRewardPoints
    })))
    const pointsArray = useMemo(() => {
        return (
            Array.isArray(userRewardPointsArray) && userRewardPointsArray?.filter((item: userRewardPoints) => {
            return item.walletAddress === address;
          }) || []
        );
      }, [userRewardPointsArray, address]);
    return ( 
       <Box className="RewardPointsContainer">
        <Box className="scoreContainer">
        <span className="eddyScore">Eddy Score</span>
        <span className="scoreText">{
        pointsArray.length>0 ? (pointsArray[0].totalPoints * (pointsArray[0].rewardsMulitplier || 1))>1000 
        ? (pointsArray[0].totalPoints * (pointsArray[0].rewardsMulitplier || 1)/1000).toFixed(2)+" K"
        : (pointsArray[0].totalPoints * (pointsArray[0].rewardsMulitplier || 1))
         : "0 K" }</span>
        </Box>
        <Box className="scoreContainer">
        <span className="eddyScore">Eddy Points</span>
        <span className="pointsText">
        {pointsArray.length>0 ? 
        pointsArray[0].totalPoints>1000 ? 
        (pointsArray[0]?.totalPoints/1000).toFixed(2)+" K": pointsArray[0].totalPoints
         : "0 K" 
        }
        </span>
        </Box>
        <Box className="multiplierContainer">
       <Box className="subMultiplierContainer">
        <span className="subMultiplierText">Multiplier</span>
        <span className="subMultiplierText2">{pointsArray.length>0 ? pointsArray[0].rewardsMulitplier || 1 : 0}x</span>
       </Box>
        <span className="multiplierText">NFT Multiplier applied to all your Eddy Points</span>
        </Box>
       </Box>
    )
}