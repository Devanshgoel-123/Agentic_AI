"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useBoolean } from "usehooks-ts";
import { TfiMoreAlt } from "react-icons/tfi";

const DynamicMoreDropdown = dynamic(
  () => import("./MoreDropdown").then((mod) => mod.MoreDropdown),
  {
    ssr: false,
  }
);

export const MoreLink = () => {
  const ref = useRef(null);
  const [showLine, setShowLine] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(ref.current);

  useEffect(() => {
    setAnchorEl(ref.current);
  }, [ref, setAnchorEl]);

  const {
    value: showDropdown,
    setTrue,
    setFalse: handleCloseDropdown,
  } = useBoolean(false);

  const handleOpenDropdown = () => {
    setAnchorEl(ref.current);
    setTrue();
  };
  const pathname = usePathname();
  const isActive = pathname === "/analytics" || pathname === "/activity"
  return (
    <>
      <div
        ref={ref}
        className={`HeaderLinkMore ${isActive ? "Green" : ""}`}
        onMouseOver={() => setShowLine(true)}
        onMouseOut={() => setShowLine(false)}
        onClick={handleOpenDropdown}
      >
        <div className={`MoreIcon ${showDropdown ? "Green" : ""}`}>
          <TfiMoreAlt />
        </div>
        <span className={isActive || showDropdown ? "Green" : ""}>More</span>
      </div>
      <DynamicMoreDropdown
        anchorEL={anchorEl}
        open={showDropdown}
        handleClose={handleCloseDropdown}
      />
    </>
  );
};
