"use client";
import React from "react";
import "./styles.scss";

import Link from "next/link";

import CustomIcon from "../CustomIcon";
import { COMING_SOON } from "@/utils/images";
import { motion } from "framer-motion";

export const ComingSoonWidget = () => {
  return (
    <div className="ComingSoonWidgetWrapper">
      <div className="HeadingContainer">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ComingSoonLogo"
        >
          <CustomIcon src={COMING_SOON} />
        </motion.div>
        <div className="Heading">Coming Soon</div>
      </div>
      <div className="SubHeading">Stay Tuned</div>
      <Link style={{ textDecoration: "none" }} href={"/"}>
        <div className="BackBtn">Back to Swap</div>
      </Link>
    </div>
  );
};
