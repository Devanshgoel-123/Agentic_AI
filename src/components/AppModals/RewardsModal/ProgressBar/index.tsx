import Box from "@mui/material/Box"
import "./styles.scss"
import useWalletConnectStore from "@/store/wallet-store"
import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react";
import { userRewardPoints } from "@/store/types/token-type";
import { useAccount } from "wagmi";
export const ProgressBar = () => {
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
    const nftConfig: Record<string,number>[] = useMemo(() => [
        { 
          "value": pointsArray[0]?.nftCaptain || 0 
        },
        { 
          "value": pointsArray[0]?.nftMariner || 0
        },
        {  
          "value":  pointsArray[0]?.nftVoyager || 0 
        },
        { 
          "value":  pointsArray[0]?.nftNavigator || 0 
        },
        {
          "value":  pointsArray[0]?.nftSkipper|| 0 
        }
      ], [pointsArray]);
       const count=nftConfig.filter((nft)=>nft["value"]>0).length;
    return (
        <Box className="progressContainer">
            <Box className="progressBarFull">
                <Box className="progressBarPartial" width={`${count*20}%`}></Box>
            </Box>
            <Box className="holdingsContainer">
                <span className="holdingsText">NFTs Claimed :</span>
                <Box className="countContainer">
                <span className="">{count}/</span>
                <span className="totalCountText">5</span>
                </Box>
                
            </Box>
        </Box>
    )
}