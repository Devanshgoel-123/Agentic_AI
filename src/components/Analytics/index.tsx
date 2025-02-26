"use client"
import React from "react";
import "./styles.scss";
import GradientText from "../common/GradientText";
import dynamic from "next/dynamic";
import useMediaQuery from "@mui/material/useMediaQuery"

const DynamicGraphContainer=dynamic(
  ()=>import("./GraphContainer").then((mod)=>mod.GraphContainer),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceholderContainer"></div>
  }
)

const DynamicAnalyticsTable=dynamic(
  ()=>import("./AnalyticsTable").then((mod)=>mod.AnalyticsTable),
  {
    ssr:false,
    loading:()=><div className="DynamicPlaceholderContainer"></div>
  }
)

export const Analytics = () => {
  const mobileDevice=useMediaQuery('(max-width:600px)')
  return (
    <div className="AnalyticsPageWrapper">
      <div className="GraphWrapper">
        <span className="Heading">
          <GradientText text="Eddy Analytics" />
        </span>
        <div className="GraphSection">
         <DynamicGraphContainer/>
        </div>
      </div>
      <div className={`${!mobileDevice? "AnalyticsTableWrapper": "AnalyticsTableMobileWrapper"}`}>
        <div className="Heading">
          <GradientText text="Top Pools" />
        </div>
        <DynamicAnalyticsTable />
      </div>
    </div>
  );
};
