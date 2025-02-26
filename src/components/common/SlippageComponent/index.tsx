"use client";
import React from "react";
import "./styles.scss";

import dynamic from "next/dynamic";

import useSlippageStore from "@/store/slippage-store";
import { TbSettings } from "react-icons/tb";

const DynamicSlippageBoard = dynamic(
  () => import("./SlippageBoard").then((mod) => mod.SlippageBoard),
  {
    ssr: false,
  }
);

import  Tooltip  from "@mui/material/Tooltip";

interface Props {
  ctaText: string;
  disableAutomatic?: boolean;
}

export const SlippageComponent = ({ ctaText, disableAutomatic }: Props) => {
  const { open, handleOpen, handleClose } = useSlippageStore();
  return (
    <>
      <Tooltip
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: "12px",
              bgcolor: "#121212",
              border: "1px solid #1E1E1E",
              fontFamily: "Manrope",
              color: "var(--text-grey)",
            },
          },
        }}
        title="Slippage settings"
      >
        <div className="SlippageIcon" onClick={handleOpen}>
          <TbSettings />
        </div>
      </Tooltip>

      {open && (
        <DynamicSlippageBoard
          open={open}
          ctaText={ctaText}
          handleCloseModal={handleClose}
          disableAutomatic={disableAutomatic}
        />
      )}
    </>
  );
};
