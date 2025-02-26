"use client";
import React, { useState } from "react";
import "./styles.scss";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";

import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import GradientText from "@/components/common/GradientText";
import EddyV3Label from "./EddyV3Label";
import { RouteContainer } from "./RouteContainer";
import { QuoteDetails } from "./QuoteDetails";
import { useFetchNoriPointsForSwap } from "@/hooks/Rewards/useFetchNoriPointsSwap";
import { formattedValueToDecimals } from "@/utils/number";
import Image from "next/image";
import { useLazyQuery } from "@apollo/client";
import { GET_TOKEN_DOLLAR_VALUE } from "@/components/graphql/queries/getDollarValueOfToken";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO, EDDY_LOGO_WHITE } from "@/utils/images";
const FeeContainer = dynamic(
  () => import("./FeeContainer").then((mod) => mod.FeeContainer),
  {
    ssr: false,
  }
);

export const RouteWidget = () => {
  const [showFeeBreakDown, setShowFeeBreakDown] = useState<boolean>(false);
  const [amountInUsd, setAmountInUsd] = useState<number>(0); 
  const [
    getDollarValue,
    { loading: dollarLoading, error: dollarError, data: dollarData, refetch },
  ] = useLazyQuery(GET_TOKEN_DOLLAR_VALUE);
  const {
    route,
    tokenOutAmount,
    estimatedReceived,
    minimumReceived,
    protocolFees,
    payChain,
    getChain,
    payToken,
    payTokenAmount,
    rewardPoints
  } = useTransferStore(
    useShallow((state) => ({
      route: state.route,
      tokenOutAmount: state.tokenOutAmount,
      estimatedReceived: state.estimatedReceived,
      minimumReceived: state.minimumReceived,
      protocolFees: state.protocolFees,
      payChain: state.payChain,
      getChain: state.getChain,
      payToken: state.payToken,
      payTokenAmount:state.tokenInAmount,
      rewardPoints:state.rewardPoints
    }))
  );

   
  const fetchTokenDollarValue=async (tokenId:number)=>{
    if(!tokenId) return;
    const {
      data: dollarUsdData,
      loading,
      error,
    } = await getDollarValue({
      variables: {
        tokenId: tokenId,
      },
    });
   
    if (dollarUsdData && !loading && !error) {
      const tokenValueUsd = dollarUsdData.getDollarValueForToken
        ? Number(dollarUsdData.getDollarValueForToken.price) /
          10 ** Math.abs(dollarUsdData.getDollarValueForToken.expo)
        : 0;
      const valueInUsd = Number(tokenValueUsd) *(Number(payTokenAmount))
      return valueInUsd
  }else{
    return 0;
  }
}
 useEffect(() => {
  const getAmount = async () => {
    if (payToken?.id) {
      const amount = await fetchTokenDollarValue(payToken.id);
      setAmountInUsd(amount || 0);
    }
  };
  getAmount();
}, [payToken, payTokenAmount]);

useFetchNoriPointsForSwap(payChain,getChain,amountInUsd)
  const handleOpenFeeBreakDown = () => {
    setShowFeeBreakDown(true);
  };

  const handleCloseFeeBreakDown = () => {
    setShowFeeBreakDown(false);
  };

  return (
    <motion.div
      className="RouteDetailsWrapper"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Box className="HeadingContainer">
        <Box className="HeadingText">
          <GradientText text="Route" />
        </Box>
        <EddyV3Label />
      </Box>
      <RouteContainer
        sourceChainRoute={route?.source}
        intermediate={route?.intermediates}
        destinationRoute={route?.destination}
      />
     { rewardPoints>0 && <div className="NoriPoints">
        <span className="NoriText">You will earn</span>
        <div className="PointsContainer">
         <Image height={30} width={30} className="EddyIcon" src={EDDY_LOGO_WHITE} alt="eddy_logo" loading="lazy"/>
         <span className="PointsText">{rewardPoints} Nori Points</span>
        </div>
      </div>}
      <QuoteDetails
        open={showFeeBreakDown}
        estimatedReceived={estimatedReceived}
        minReceived={minimumReceived}
        protocolFees={protocolFees}
        handleOpen={handleOpenFeeBreakDown}
        handleClose={handleCloseFeeBreakDown}
      />
      {payChain !== getChain && <FeeContainer />}
    </motion.div>
  );
};
