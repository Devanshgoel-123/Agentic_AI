"use client";
import React, { useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import useMediaQuery  from "@mui/material/useMediaQuery";

import CustomIcon from "../common/CustomIcon";
import SocialIcon from "./SocialIcon";
import NavigationLink from "./NavigationLink";

import { EDDY_LOGO, PIN_ACTIVE, PIN_LOGO } from "@/utils/images";
import { DISCORD_LINK, TWITTER_LINK, DOCS_LINK } from "@/utils/constants";

const socialsLinksData = [
  {
    name: "Twitter",
    icon: "",
    link: TWITTER_LINK,
  },
  {
    name: "Discord",
    icon: "",
    link: DISCORD_LINK,
  },
  {
    name: "Documentation",
    icon: "",
    link: DOCS_LINK,
  },
];

const navigationLinksData = [
  {
    text: "Swap",
    icon: "",
  },
  {
    text: "Pools",
    icon: "",
  },
  {
    text: "Rewards",
    icon: "",
  },
  {
    text: "Analytics",
    icon: "",
  },
];

const SideNavigation = () => {
  const [isExpand, setIsExpand] = useState(false);
  const [pin, setPin] = useState(false);
  const lgScreenSize = useMediaQuery("(min-width: 1024px)");
  const xlScreenSize = useMediaQuery("(min-width: 1280px)");

  /**
   * Expand side nav on hover in.
   * @returns void
   */
  const handleMouseHoverIn = () => {
    if (pin) return;
    setIsExpand(true);
  };

  /**
   * Collapse side nav on hover out.
   * @returns void
   */
  const handleMounseHoverOut = () => {
    if (pin) return;
    setIsExpand(false);
  };

  /**
   * Check sidenav collapsed size as per screen size.
   * @returns SideNav collapsed size.
   */
  const returnSizeOfSizeNavigation = () => {
    if (lgScreenSize && !xlScreenSize) return "54px";
    else return "72px";
  };

  /**
   * Check sidenav expanded size as per screen size.
   * @returns SideNav expanded size.
   */
  const returnSizeOfSizeNavigationExpanded = () => {
    if (lgScreenSize && !xlScreenSize) return "170px";
    else return "190px";
  };

  return (
    <Box
      className="SideNavigationWrapper"
      onMouseEnter={handleMouseHoverIn}
      onMouseLeave={handleMounseHoverOut}
    >
      <Box
        style={{
          width: isExpand
            ? returnSizeOfSizeNavigationExpanded()
            : returnSizeOfSizeNavigation(),
        }}
        className="SideNavigationContainer"
      >
        {isExpand && (
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="PinBtn"
            onClick={() => setPin((pin) => !pin)}
          >
            <CustomIcon src={pin ? PIN_ACTIVE : PIN_LOGO} />
          </motion.div>
        )}
        <Box className="LogoContainer">
          <Box className="EddyLogo">
            <CustomIcon src={EDDY_LOGO} />
          </Box>
          {isExpand && (
            <motion.span
              transition={{ delay: 0.4 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ display: isExpand ? "block" : "none" }}
            >
              Eddy Finance
            </motion.span>
          )}
        </Box>
        <Box
          className="LinksWrapper"
          style={{ width: isExpand ? "100%" : "auto" }}
        >
          {navigationLinksData.map((item, index) => (
            <NavigationLink key={index} {...item} isExpand={isExpand} />
          ))}
        </Box>
        <Box
          className="SocialsWrapper"
          style={{ width: isExpand ? "100%" : "auto" }}
        >
          {socialsLinksData.map((item, index) => (
            <SocialIcon key={index} {...item} isExpand={isExpand} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SideNavigation;
