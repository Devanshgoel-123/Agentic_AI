"use client";
import React, { useState } from "react";
import "./styles.scss";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { closeSnackbar } from "notistack";

interface Props {
  text: string;
  route: string;
  icon: JSX.Element;
}

const HeaderLink = ({ text, route, icon }: Props) => {
  const pathname = usePathname();
  const [showLine, setShowLine] = useState(false);
  return (
    <Box
      className={
        pathname === route ||
        (pathname.includes(route.substring(1)) && route !== "/")
          ? "HeaderLink"
          : `HeaderLink-InActive ${showLine ? "show-line" : ""}`
      }
      onMouseOver={() => setShowLine(true)}
      onMouseOut={() => setShowLine(false)}
    >
      <Box className="HeaderIcon">{icon}</Box>
      {text}
    </Box>
  );
};

export default HeaderLink;
