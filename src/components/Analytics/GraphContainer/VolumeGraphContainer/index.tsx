"use client";
import React, { useState } from "react";
import "./styles.scss";
import { BarChart} from "@mui/x-charts";
import useFetchTradingVolumeAnalytics from "@/hooks/Analytics/useFetchTradingVolumeData";
import { legendClasses } from "@mui/x-charts";
import Fade  from "@mui/material/Fade";
import { formatDisplayText } from "@/utils/number";
import { useMediaQuery } from "usehooks-ts";
import dynamic from "next/dynamic";

const DynamicCustomSpinner = dynamic(() =>
  import("@/components/common/CustomSpinner").then((mod) => mod.CustomSpinner)
);

export const VolumeGraphContainer = () => {
  const [timeStamp, setTimeStamp] = useState<string>("week");
  const { dataArray,totalVolume, loading } = useFetchTradingVolumeAnalytics(`${timeStamp}`);
  const [activeId, setActiveId] = useState<number>(-1);
  const mobileDevice=useMediaQuery('(max-width: 600px)');
  if (loading) {
    return (
      <div className="GraphContainerLoading">
        <DynamicCustomSpinner size={"30"} color="#323227" />
      </div>
    );
  }
  return (
    <div className="GraphContainer">
      {dataArray.length > 0 && (
        <>
          <Fade in={true}>
            <div>
              <div className="GraphDetails">
                <div className="GraphInfo">
                  <span className="GraphName">Eddy Volume</span>
                  <span className="ActiveValue">
                    {activeId === -1
                      ? formatDisplayText(totalVolume,2)
                      : formatDisplayText(dataArray[activeId].volume,2)}
                  </span>
                </div>
                <div className="GraphControls">
                  {!mobileDevice && <div
                    className={`ControlsButton ${
                      timeStamp === "day" ? "active" : ""
                    }`}
                    onClick={() => setTimeStamp("day")}
                  >
                    D
                  </div>}
                  <div
                    className={`ControlsButton ${
                      timeStamp === "week" ? "active" : ""
                    }`}
                    onClick={() => setTimeStamp("week")}
                  >
                    W
                  </div>
                  <div
                    className={`ControlsButton ${
                      timeStamp === "month" ? "active" : ""
                    }`}
                    onClick={() => setTimeStamp("month")}
                  >
                    M
                  </div>
                </div>
              </div>
              <div className="GraphCanvas">
                <BarChart
                  dataset={dataArray}
                  series={[
                    {
                      dataKey: "volume",
                      label: "Volume",
                    },
                  ]}
                  sx={{
                    [`& .${legendClasses.root}`]: {
                      display: "none",
                    },
                  }}
                  colors={["#7bf179"]}
                  borderRadius={2}
                  height={250}
                  margin={{
                    top: 30,
                    left: 30,
                    right: 0,
                    bottom: 20,
                  }}
                  leftAxis={{
                    tickLabelStyle: {
                      fontSize: 10,
                      fill: "#ffffff",
                      fontWeight: 700,
                      fontFamily: "Manrope",
                      lineHeight: 18,
                      opacity: 0.5,
                      transform: "translateX(0px)",
                      
                    },
                    tickLabelInterval: (value: number, index: number) =>
                      value % 1000000 === 0 && value != 0,
                  }}
                  yAxis={[
                    {
                      scaleType: "linear",
                      dataKey: "volume",
                      valueFormatter(value, context) {
                        return context.location === "tick"
                          ? `${value / 1000000}M`
                          : `${value}`;
                      },
                    },
                  ]}
                  onHighlightChange={(item) => {
                    item?.dataIndex
                      ? setActiveId(item?.dataIndex)
                      : setActiveId(-1);
                  }}
                  xAxis={[
                    {
                      scaleType: "band",
                      dataKey: "date",
                      label: "Date",
                      valueFormatter(value, context) {
                        if (!value || isNaN(new Date(value).getTime())) {
                          return "";
                      }
                        const [year, month, day] = value.split("-").map(Number);
                        const date = new Date(Date.UTC(year, month - 1, day));
                        const formattedDate = `${date.toLocaleString("default", { month: "short" })} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
                        const formattedDateMonthly=`${date.toLocaleString("default", { month: "short" })} ${date.getUTCFullYear()}`;
                        return timeStamp==="month"?formattedDateMonthly : formattedDate;
                      },
                    },
                  ]}
                  bottomAxis={{
                    tickLabelStyle: {
                      fontSize: 10,
                      fill: "#ffffff",
                      fontWeight: 700,
                      fontFamily: "Manrope",
                      lineHeight: 18,
                      opacity: 0.5,
                      transform:"translateX(30px) translateY(-5px)"
                    },
                    tickLabelInterval: (value, index: number) =>{
                      if (timeStamp === "week") {
                        return index % 18 === 0;
                      } else if (timeStamp === "day") {
                        return index % 35 === 0;  
                      } else {
                        return index % 5 === 0;
                      }
                    }
                  }}
                />
              </div>
            </div>
          </Fade>
        </>
      )}
    </div>
  );
};
