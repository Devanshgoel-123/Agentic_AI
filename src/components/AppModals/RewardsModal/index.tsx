"use client";
import React, { forwardRef, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
import useWalletConnectStore from "@/store/wallet-store";
import "./styles.scss";
import { useFetchUserRewardPoints } from "@/hooks/Rewards/useFetchUserRewardPoints";
import "../../CrossChainWidget/ButtonsContainer/styles.scss";
import { CustomContentProps, SnackbarContent, useSnackbar } from "notistack";
import { RxCross1 } from "react-icons/rx";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
const DynamicRewardsPointsContainer = dynamic(
    () => import("./RewardPointsContainer").then((mod) => mod.RewardPointsContainer),
    {
        ssr: false,
        loading: () => <div className="DynamicPlaceholder"></div>,
    }
)
const DynamicProgressBar = dynamic(
    () => import("./ProgressBar").then((mod) => mod.ProgressBar),
    {
        ssr: false,
        loading: () => <div className="DynamicPlaceholder"></div>,
    }
)
const DynamicButtonsContainer = dynamic(
    () => import("./ButtonsContainer").then((mod) => mod.RewardsButtonContainer),
    {
        ssr: false,
        loading: () => <div className="DynamicPlaceholder"></div>,
    }
)
const DynamicCollectionModal=dynamic(
    ()=>(import("./CollectionModal").then((mod)=>mod.CollectionModal)),
    {
        ssr:false,
        loading: () => <div className="DynamicPlaceholder"></div>,
    }
)
const RewardsModal=forwardRef<HTMLDivElement,CustomContentProps>(
 ({id},ref)=>{
    const {closeSnackbar}=useSnackbar();
    const {
        openCollectionModal,
    }=useWalletConnectStore(useShallow((state)=>({
        openCollectionModal:state.openCollectionModal
    })))
    const {loading}=useFetchUserRewardPoints();
    useEffect(()=>{
      const userPoints = localStorage.getItem("userRewardPointsStorage");
      let parsedUserPoints;
      if(userPoints!==null){
        try {
          parsedUserPoints = userPoints ? JSON.parse(userPoints) : null;
        } catch (e) {
          parsedUserPoints = null;
        }
        if (!Array.isArray(parsedUserPoints?.state.userRewardPoints)) {
          localStorage.removeItem("userRewardPointsStorage");
          useWalletConnectStore.getState().setUserRewardPoints({});
        }
      }else{
        useWalletConnectStore.getState().setUserRewardPoints({});
      }
  },[])
    return (
      <SnackbarContent ref={ref} className="RewardsModalWrapper">
        {!loading ? (
          <motion.div
            initial={{ opacity: 0, minHeight: "300px" }}
            animate={{ opacity: 1, height: "auto" }}
            className="RewardsModal"
          >
            <Box className="modalHeader">
              <span className="textHeading GradientText">
                Eddy Rewards Points
              </span>
              <RxCross1
                className="crossIcon GradientText"
                onClick={() => {
                  closeSnackbar(id);
                }}
              />
            </Box>
            <DynamicRewardsPointsContainer />
            <DynamicProgressBar />
            {!openCollectionModal && <DynamicButtonsContainer />}
            {openCollectionModal && <DynamicCollectionModal />}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, minHeight: "100px" }}
            animate={{ opacity: 1, height: "auto", top: "100px" }}
            className="RewardsLoader"
          >
            <CustomTextLoader text="Fetching Your Reward Points" />
          </motion.div>
        )}
      </SnackbarContent>
    );
  }
);

RewardsModal.displayName = "Rewards Modal";

export default RewardsModal;
