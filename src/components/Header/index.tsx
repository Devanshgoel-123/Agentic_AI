"use client";
import React, { act, useState } from "react";
import "./styles.scss";
import { useEffect } from "react";

import Link from "next/link";
import { motion } from "framer-motion";

import useTransferStore from "@/store/transfer-store";
import ConnectWalletButton from "../ConnectWalletButton";
import HeaderLink from "./HeaderLink";
import CustomIcon from "../common/CustomIcon";
import { EDDY_LOGO, REWARDS_BANNER_HEADER } from "@/utils/images";
import { MoreLink } from "./MoreLink";
import { MdOutlineSwapCalls } from "react-icons/md";
import { FaBalanceScale } from "react-icons/fa";
import { LuGift } from "react-icons/lu";
import { FaRegHourglass } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import useMediaQuery from "@mui/material/useMediaQuery";
import { closeSnackbar } from "notistack";
import { IoAnalyticsSharp } from "react-icons/io5";
import { FiGift } from "react-icons/fi";
import { usePathname } from "next/navigation";

const HeaderLinksData = [
  {
    text: "Swap",
    route: "/",
    icon: <MdOutlineSwapCalls />,
  },
  {
    text: "Aggregator",
    route: "/dust-aggregator",
    icon: <IoAnalyticsSharp />,
  },
];

const Header = () => {
  const { activeTransactionArray } = useTransferStore(
    useShallow((state) => ({
      activeTransactionArray: state.activeTransactionArray,
    }))
  );
  const [isDown, setIsDown] = useState<boolean>(false);
  const mobileDevice = useMediaQuery("(max-width: 700px)");
  const pathname=usePathname()
  const isAgent=pathname.includes("agent")
  return (
    <div className="HeaderSection">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="HeaderWrapper"
      >
        <div className="LogoContainer">
          <div className="Logo">
            <CustomIcon src={EDDY_LOGO} />
          </div>
          <span className="LogoText">Agentic AI</span>
        </div>
        <div className="HeaderContainer">
          {HeaderLinksData.map((item, index) => (
            <Link
              key={index}
              style={{ textDecoration: "none", height: "100%" }}
              href={item.route}
            >
              <HeaderLink
                text={item.text}
                route={item.route}
                icon={item.icon}
              />
            </Link>
          ))}
          <MoreLink />
        </div>

        <div className="HeaderButtonsContainer">
          <ConnectWalletButton />
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
