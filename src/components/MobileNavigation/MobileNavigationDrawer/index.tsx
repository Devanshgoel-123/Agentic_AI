import React from "react";
import "./styles.scss";
import { motion } from "framer-motion";
import Link from "next/link";

import { usePathname } from "next/navigation";

import Drawer from "@mui/material/Drawer"
import CustomIcon from "@/components/common/CustomIcon";
import { CROSS_ICON, DUST_ICON, EDDY_LOGO } from "@/utils/images";

import GradientText from "@/components/common/GradientText";
import { DISCORD_LINK, DOCS_LINK, TWITTER_LINK } from "@/utils/constants";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlineHistory } from "react-icons/md";
interface Props {
  open: boolean;
  toggleDrawer: any;
}

const navLinksData = [
  {
    name: "Analytics",
    link: "/analytics",
    isComing: false,
    icon: <MdOutlineAnalytics />,
  },
  {
    name: "History",
    link: "/activity",
    icon: <MdOutlineHistory />,
  }
];

export const MobileNavigationDrawer = ({ open, toggleDrawer }: Props) => {
  const pathname = usePathname();
  /**
   * Function to open external links.
   */
  const handleOpenLink = (link: string) => {
    window.open(link, "_blank");
  };
  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <div className="DrawerWrapper">
        <div className="HeadingContainer">
          <div className="LogoContainer">
            <div className="Logo">
              <CustomIcon src={EDDY_LOGO} />
            </div>
            <span>Eddy Finance</span>
          </div>
          <div className="HeadingBtn" onClick={toggleDrawer(false)}>
            <CustomIcon src={CROSS_ICON} />
          </div>
        </div>
        <div className="DrawerNavigationContainer">
          {open &&
            navLinksData.map((el, index) => (
              <Link
                key={index}
                style={{ textDecoration: "none" }}
                href={el.link}
                onClick={toggleDrawer(false)}
              >
                <motion.div
                  style={{ textDecoration: "none" }}
                  transition={{ delay: 0.2 + index / 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="DrawerNavigation"
                >
                   <div
                    style={{ textDecoration: "none" }}
                    className={`LogoIcon ${
                      pathname === el.link ? "show-line" : ""
                    }`}
                  >
                    {el.icon}
                  </div>
                  {pathname === el.link ? (
                    <GradientText text={el.name} />
                  ) : (
                    <span className="LinkText">{el.name}</span>
                  )}
                  {el.isComing && (
                    <span className="ComingSoonLabel">Coming Soon</span>
                  )}
                </motion.div>
              </Link>
            ))}
        </div>
        <div className="SocialContainer">
          {open && (
            <>
              <motion.div
                transition={{ delay: 0.2 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="SocialIcon"
                onClick={() => {
                  toggleDrawer(false);

                  handleOpenLink(TWITTER_LINK);
                }}
              >
                <FaXTwitter />
              </motion.div>
              <motion.div
                transition={{ delay: 0.3 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="SocialIcon"
                onClick={() => {
                  toggleDrawer(false);

                  handleOpenLink(DISCORD_LINK);
                }}
              >
                <FaDiscord />
              </motion.div>
              <motion.div
                transition={{ delay: 0.4 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="SocialIcon"
                onClick={() => {
                  toggleDrawer(false);

                  handleOpenLink(DOCS_LINK);
                }}
              >
                <TiDocumentText />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};
