import React from "react";
import "./styles.scss";

import Link from "next/link";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { DISCORD_LINK, DOCS_LINK, TWITTER_LINK } from "@/utils/constants";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlineHistory } from "react-icons/md";
import CustomIcon from "@/components/common/CustomIcon";
import { DUST_ICON } from "@/utils/images";
import { closeSnackbar } from "notistack";
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
    isComing: false,
    icon: <MdOutlineHistory />,
  },
];

interface Props {
  anchorEL: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export const MoreDropdown = ({ open, anchorEL, handleClose }: Props) => {
  /**
   * Function to open external links.
   */
  const handleOpenLink = (link: string) => {
    window.open(link, "_blank");
  };
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEL}
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: "auto" } } }}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem>
        <Box className="DropdownContainer">
          <Box className="NavigationLinkContainer">
            {navLinksData.map((item, index) => (
              <Link
                key={index}
                style={{ textDecoration: "none" }}
                href={item.link}
              >
                <div className="NavigationLink">
                  <Box className="Icon">{item.icon}</Box>
                  <span>{item.name}</span>
                  {item.isComing && (
                    <span className="ComingSoonLabel">Coming Soon</span>
                  )}
                </div>
              </Link>
            ))}
          </Box>
          <hr />
          <Box className="SocialLinkContainer">
            <Box
              className="SocialLink"
              onClick={() => {
                handleOpenLink(TWITTER_LINK);
              }}
            >
              <Box className="Icon">
                <FaXTwitter />
              </Box>
              <span>Twitter</span>
            </Box>
            <Box
              className="SocialLink"
              onClick={() => {
                handleOpenLink(DISCORD_LINK);
              }}
            >
              <Box className="Icon">
                <FaDiscord />
              </Box>
              <span>Discord</span>
            </Box>
            <Box
              className="SocialLink"
              onClick={() => {
                handleOpenLink(DOCS_LINK);
              }}
            >
              <Box className="Icon">
                <TiDocumentText />
              </Box>
              <span>Documentation</span>
            </Box>
          </Box>
        </Box>
      </MenuItem>
    </Menu>
  );
};
