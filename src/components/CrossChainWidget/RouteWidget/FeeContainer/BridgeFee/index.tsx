import React from "react";
import "./styles.scss";

import Box from "@mui/material/Box";
import CustomIcon from "@/components/common/CustomIcon";
import { CLOCK_ICON, ERROR_ICON, TIMER_LOGO } from "@/utils/images";

import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { motion } from "framer-motion";

interface Props {
  bridgeName: string;
  isEddy: boolean;
  totalGas: string;
  estimatedTime: string;
  loading?: boolean;
  error?: any;
  eddyFee?: string;
}

export const BridgeFee = ({
  bridgeName,
  isEddy,
  totalGas,
  estimatedTime,
  loading,
  error,
  eddyFee = "0",
}: Props) => {
  /**
   *
   * @returns Gas fee state as per loading and error
   */
  const returnBridgeFee = () => {
    if (loading) {
      return <CustomTextLoader text="0.00" />;
    } else if (error) {
      return "- -";
    } else {
      return totalGas;
    }
  };

  /**
   *
   * @returns Estimated time fee state as per loading and error
   */
  const returnEstimatedTime = () => {
    if (loading) {
      return (
        <>
          <Box className="TimeIcon">
            <CustomIcon src={CLOCK_ICON} />
          </Box>
          <span className="TimeValue">
            <CustomTextLoader text="0min" />
          </span>
        </>
      );
    } else if (error) {
      return <span className="notsupportedLabel">Not Supported</span>;
    } else {
      return (
        <>
          <Box className="TimeIcon">
            <CustomIcon src={CLOCK_ICON} />
          </Box>
          <span className="TimeValue">{`${estimatedTime}min`}</span>
        </>
      );
    }
  };

  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: Number(eddyFee) > Number(totalGas) && !error ? "none" : "flex",
        background: isEddy
          ? "linear-gradient(106.18deg, rgba(88, 88, 88, 0.04) -108.53%, #121212 86.85%)"
          : "var(--paper-black-dark)",
      }}
      className="BridgeFeeContainer"
    >
      <Box className="BridgeFeeHeadingContainer">
        <span className="BridgeName">{bridgeName}</span>
        {isEddy && <Box className="CheapestLabel">cheapest</Box>}
        {error && (
          <Box className="ErrorIcon">
            <CustomIcon src={ERROR_ICON} />
          </Box>
        )}
      </Box>
      <Box className="GasFeeWrapper">
        <Box className="GasFeeContainer">
          <Box className="GasFeeDetails">
            <span className="GasFeeLabel">Gas Fees</span>
            <span className="GasFeeValue">${returnBridgeFee()}</span>
          </Box>
        </Box>
        <Box className="EstTimeContainer">{returnEstimatedTime()}</Box>
      </Box>
    </motion.div>
  );
};
