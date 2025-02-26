import React from "react";
import "./styles.scss";
import dynamic from "next/dynamic";

const DynamicTvlGraphContainer=dynamic(
  ()=>import("./TvlGraphContainer").then((mod)=>mod.TvlGraphContainer),
  {
    ssr:false,
    loading:()=><Placeholder/>
  }
)

const DynamicVolumeGraphContainer=dynamic(
  ()=>import("./VolumeGraphContainer").then((mod)=>mod.VolumeGraphContainer),
  {
    ssr:false,
    loading:()=><Placeholder/>
  }
)

const Placeholder = () => (
  <div className="DynamicPlaceholderContainer"></div>
);

export const GraphContainer = () => {
  return (
   <>
   <DynamicTvlGraphContainer/>
   <DynamicVolumeGraphContainer/>
   </>
  );
};
