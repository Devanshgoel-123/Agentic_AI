"use client";
import React from "react";
import "./styles.scss";

import Link from "next/link";
import { motion } from "framer-motion";

import CustomIcon from "../CustomIcon";
import { NOT_FOUND_IMAGE } from "@/utils/images";

export const CustomNotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="CustomNotFoundWrapper"
    >
      <div className="NotFoundLogo">
        <CustomIcon src={NOT_FOUND_IMAGE} />
      </div>
      <div className="HeadingContainer">
        <span>404 - Not Found</span>
        <span className="SubHeading">This page does not exist.</span>
      </div>
      <Link style={{ textDecoration: "none" }} href={"/"}>
        <span className="ActionBtn">Swap now</span>
      </Link>
    </motion.div>
  );
};
