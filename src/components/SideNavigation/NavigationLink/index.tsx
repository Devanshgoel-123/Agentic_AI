"use client";
import React, { useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  text: string;
  icon: string;
  isExpand: boolean;
}

const NavigationLink = ({ text, icon, isExpand }: Props) => {
  const [showLine, setShowLine] = useState(false);
  return (
    <Box
      className="NavigationLinkContainer"
      onMouseOver={() => setShowLine(true)}
      onMouseOut={() => setShowLine(false)}
    >
      <Box
        style={{
          background: showLine
            ? "linear-gradient(48.71deg, rgba(48, 48, 48, 0.8) -31.53%, #121212 69.13%), #7BF179"
            : "var(--paper-black-medium)",
        }}
        className={`LinkIcon ${showLine ? "show-line" : ""}`}
      >
        <CustomIcon src={icon} />
      </Box>
      {isExpand && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {text}
        </motion.span>
      )}
    </Box>
  );
};

export default NavigationLink;
