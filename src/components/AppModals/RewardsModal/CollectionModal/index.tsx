import React, { useState,useMemo } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import "./styles.scss";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";
import { userRewardPoints } from "@/store/types/token-type";
const DynamicCarouselContainer=dynamic(
    ()=>import("./CarouselContainer").then((mod)=>mod.CarouselContainer),
    {
        ssr:false
    }
)
export const CollectionModal=()=>{
    const {address}=useAccount();
    const {
        userRewardPointsArray
    }=useWalletConnectStore(useShallow((state)=>({
        userRewardPointsArray:state.userRewardPoints
    })))
    const pointsArray:userRewardPoints[] = useMemo(() => {
        return (
            Array.isArray(userRewardPointsArray) && userRewardPointsArray?.filter((item: userRewardPoints) => {
            return item.walletAddress === address;
          }) || []
        );
      }, [userRewardPointsArray, address]);
    const userNFTCollection:Record<string,number>[]=[
       {
        "Mariner": pointsArray[0]?.nftMariner ? 1:0,
       },
       {
        "Voyager":  pointsArray[0]?.nftVoyager ? 1:0,
       },
       {
        "Captain":  pointsArray[0]?.nftCaptain ? 1:0,
       },
       {
        "Skipper": pointsArray[0]?.nftSkipper ? 1:0,
       },
       {
        "Navigator": pointsArray[0]?.nftNavigator? 1:0, 
       }
    ]
    return (
        <Box className="collectionModal">
            <DynamicCarouselContainer/>
        <Box className="collectionStatusBox">
                <Box className="collectionHeader">
                    <span>NFT</span>
                    <span>Status</span>
                </Box>
        {
                    userNFTCollection.map((nft,index)=>{
                        return (
                            <Box className="collectionHeader" key={index}>
                                <span className="nftName">{Object.keys(nft)[0]}</span>
                                {nft[Object.keys(nft)[0]] ?
                                <Box className="ClaimedBox">
                                <span className="ClaimedText">Claimed</span>
                                </Box>
                                :
                                <Box>
                                    <span className="NotClaimedText">Not Claimed</span>
                                </Box>   
                    }         
                            </Box>
                        )
                    })
        }
        </Box>
        <Box className="rewardsButton" onClick={()=>{useWalletConnectStore.getState().handleCloseCollectionModal()}}>
        <span >Less Details</span>
        </Box>
        </Box>
    )
}