"use client";
import React, { useState } from "react";
import "./styles.scss";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import useFetchIncentivization from "@/hooks/Rewards/useFetchIncentivization";

import GradientText from "../common/GradientText";
import CustomIcon from "../common/CustomIcon";
import { CLAIM_LIQUIDITY, CLAIM_VOLUME } from "@/utils/images";
import { CustomSpinner } from "../common/CustomSpinner";
import { MdError } from "react-icons/md";
import { HiEmojiSad } from "react-icons/hi";
import { FiInfo } from "react-icons/fi";

const DynamicWeekDropdown = dynamic(
  () => import("./WeekDropdown").then((mod) => mod.WeekDropdown),
  {
    ssr: false,
  }
);

const IncentivesHeadingContainer = dynamic(
  () =>
    import("./IncentivesHeadingContainer").then(
      (mod) => mod.IncentivesHeadingContainer
    ),
  {
    ssr: false,
  }
);

const CURRENT_WEEK = "1";

export const IncentivesWidget = () => {
  const [week, setWeek] = useState(CURRENT_WEEK);
  const { loading, error, value, proofs, contractConfig } =
    useFetchIncentivization({ weekId: Number(week) });

  const returnValueDetails = () => {
    if (loading) {
      return (
        <>
          <motion.span
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ClaimState"
          >
            Checking eligibility...
          </motion.span>
          <span className="ClaimValue">
            <CustomSpinner size={"20"} color="#7BF179" />
          </span>
        </>
      );
    } else if (error) {
      return (
        <>
          <motion.span
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ClaimState"
          >
            Error in fetching eligibility
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ClaimValue"
          >
            <MdError />
          </motion.span>
        </>
      );
    } else {
      if (value && proofs) {
        return (
          <>
            <motion.span
              transition={{ delay: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ClaimState"
            >
              Your Claimable Zeta
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ClaimValue"
            >
              {(Number(value.value) / 10 ** 18).toFixed(4)}
            </motion.span>
          </>
        );
      } else {
        return (
          <>
            <motion.span
              transition={{ delay: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ClaimState"
            >
              Not eligible. Stay tuned for next week
            </motion.span>
            <span className="ClaimValue">
              <HiEmojiSad />
            </span>
          </>
        );
      }
    }
  };

  const openDetailsPage = () => {
    window.open(
      "https://x.com/eddy_protocol/status/1891521552299991359",
      "_blank"
    );
  };

  return (
    <div className="IncentivesWidgetWrapper">
      <IncentivesHeadingContainer
        loading={loading}
        error={error}
        value={value}
        proofs={proofs}
        contract={contractConfig}
      />
      <motion.div
        transition={{ delay: 0.2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="IncentivesContainer"
      >
        <DynamicWeekDropdown week={week} setWeek={setWeek} />
        <div className="ClaimDetails">{returnValueDetails()}</div>
        <div className="VolumeDetailsContainer">
          <div className="VolumeDetails">
            <div className="VolumeType">Liquidity</div>
            <div className="VolumeHeadingContainer">
              <div className="VolumeIcon">
                <CustomIcon src={CLAIM_LIQUIDITY} />
              </div>
              <span className="VolumeHeading">
                <GradientText text="Trading Volume" />
              </span>
              <span className="VolumeInfo">
                Participate in the rewards program by trading volumes on Solana
                chain. List of tasks are: Solana to Base bridge minimum $20
                Swap/Bridge to/from Solana minimum $10 Swap/Bridge to/from
                Solana a minimum of $50 Swap/Bridge from Solana minimum $100
                Keep at least $10 worth of SOL on UniV3 pools for at least 1
                week.
              </span>
              <span className="VolumeLink" onClick={openDetailsPage}>
                <FiInfo />
                <span className="Underline">
                  For more Information click here
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
