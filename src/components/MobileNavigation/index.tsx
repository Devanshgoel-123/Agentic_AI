"use client";

import React, { useEffect, useState } from "react";
import "./styles.scss";

import dynamic from "next/dynamic";
import Link from "next/link";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import CustomIcon from "../common/CustomIcon";
import { ARROW_DOWN } from "@/utils/images";
import GradientText from "../common/GradientText";
import Slide from "@mui/material/Slide";
import { TfiMoreAlt } from "react-icons/tfi";
import { MdOutlineSwapCalls } from "react-icons/md";
import { FaBalanceScale } from "react-icons/fa";
import { TiGift } from "react-icons/ti";

import { DUST_ICON } from "@/utils/images";
import { IoAnalyticsSharp } from "react-icons/io5";
<IoAnalyticsSharp />;
const MobileNavigationDrawer = dynamic(() =>
  import("./MobileNavigationDrawer").then((mod) => mod.MobileNavigationDrawer)
);

const HeaderLinksData = [
  {
    text: "Swap",
    route: "/",
    icon: <MdOutlineSwapCalls />,
  },
  {
    text: "Pools",
    route: "/pools",
    icon: <FaBalanceScale />,
  },
  {
    text: "Aggregator",
    route: "/dust-aggregator",
    icon: <IoAnalyticsSharp />,
  },
  {
    text: "Rewards",
    route: "/rewards",
    icon: <TiGift />,
  },
];

export const MobileNavigation = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [open, setOpen] = React.useState(false);

  /**
   * Toggle Drawer
   * @param newOpen New state of drawer
   * @returns
   */
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      setTouchStartY(touchY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;

      if (touchY < touchStartY) {
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [touchStartY]);

  return (
    <div
      style={{
        bottom: isVisible ? "0" : "-80px",
      }}
      className="MobileNavigation"
    >
      <div
        style={{ transform: isVisible ? "rotate(0deg)" : "rotate(180deg)" }}
        className="ArrowContainer"
      >
        <div className={`ArrowIcon ${isVisible ? "" : "BounceContainer"}`}>
          <CustomIcon src={ARROW_DOWN} />
        </div>
      </div>
      <Slide in={isVisible} direction="up">
        <div className="NavigationContainer">
          {HeaderLinksData.map((el, index) => (
            <Link
              key={index}
              style={{ textDecoration: "none" }}
              href={el.route}
            >
              <div className="NavigationLink">
                <div
                  className={`NavigationIcon ${
                    pathname === el.route ? "show-line" : ""
                  }`}
                >
                  {el.icon}
                </div>
                {pathname === el.route ? (
                  <GradientText text={el.text} />
                ) : (
                  <span className="NavigationText">{el.text}</span>
                )}
              </div>
            </Link>
          ))}

          <div className="NavigationLink" onClick={toggleDrawer(true)}>
            <div className={`NavigationIcon`}>
              <TfiMoreAlt />
            </div>
            <span className="NavigationText">More</span>
          </div>
        </div>
      </Slide>

      <MobileNavigationDrawer open={open} toggleDrawer={toggleDrawer} />
    </div>
  );
};
