"use client";
import React, { useState } from "react";
import "./styles.scss";
import { IoInformationCircleSharp } from "react-icons/io5";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO_WHITE } from "@/utils/images";
import { LevelsContainer } from "./LevelsContainer";
import { PointsInfoContainer } from "./PointsInfoContainer";
import { AvatarContainer } from "./AvatarContainer";
import { useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import { Box } from "@mui/material";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
export const PointsContainer = () => {
  const { address } = useAccount();
  const mobileDevice = useMediaQuery("(max-width:600px)");
  const date: Date = new Date();

  if (!mobileDevice) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          height: "200px",
        }}
        transition={{
          delay: 0.3,
        }}
        animate={{
          opacity: 1,
          height: "auto",
        }}
        className="PointsContainer"
      >
        <div
          className={
            address === undefined
              ? "PointsWrapper InActive"
              : "PointsWrapper Active"
          }
        >
          <div className="HeadingContainer">
            <div className="HeadingWrapper">
              <span className="Heading">Rewards and Nori Points</span>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#121212",
                      border: "2px solid #1E1E1E",
                      fontFamily: "Manrope",
                    },
                  },
                }}
                title={
                  "Perform listed tasks and earn Nori points to claim Rewards"
                }
                
              >
                <div className="InfoIcon">
                  <IoInformationCircleSharp />
                </div>
              </Tooltip>
            </div>
            <div className="TimeContainer">
              <div className="Logo">
                <CustomIcon src={EDDY_LOGO_WHITE} />
              </div>
              <span className="TimeLabel">
                last updated : <span className="Bold">5 mins ago</span>
              </span>
            </div>
          </div>
          <LevelsContainer />
          <PointsInfoContainer />
        </div>
        <AvatarContainer className={address === undefined ? "InActive" : ""} />
      </motion.div>
    );
  } else {
    return (
      <div className="PointsContainer">
        <div className="PointsWrapper">
          <div className="HeadingContainer">
            <div className="HeadingWrapper">
              <span className="Heading">Rewards and Nori Points</span>
              <div
                className="InfoIcon"
              >
                <IoInformationCircleSharp />
              </div>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#121212",
                      border: "2px solid #1E1E1E",
                      fontFamily: "Manrope",
                    },
                  },
                }}
                title={
                  "Perform listed tasks and earn Nori points to claim Rewards"
                }
              >
                <div className="InfoIcon">
                  <IoInformationCircleSharp />
                </div>
              </Tooltip>
            </div>
            <div className="TimeContainer">
              <div className="Logo">
                <CustomIcon src={EDDY_LOGO_WHITE} />
              </div>
              {/* <span className="TimeLabel">
            last updated:<span className="Bold"> 9th Jan</span>
          </span> */}
            </div>
          </div>
          <AvatarContainer
            className={address === undefined ? "InActive" : ""}
          />
          <LevelsContainer />
          <PointsInfoContainer />
        </div>
      </div>
    );
  }
};
