import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  name: string;
  icon: string;
  link: string;
  isExpand: boolean;
}

const SocialIcon = ({ name, icon, link, isExpand }: Props) => {
  /**
   * Function to open external links.
   */
  const handleOpenLink = () => {
    window.open(link, "_blank");
  };

  return (
    <Box className="SocialIconContainer" onClick={handleOpenLink}>
      <Box className="SocialIcon">
        <CustomIcon src={icon} />
        {isExpand && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {name}
          </motion.span>
        )}
      </Box>
    </Box>
  );
};

export default SocialIcon;
