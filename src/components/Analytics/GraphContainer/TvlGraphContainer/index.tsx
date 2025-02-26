
"use client"
import React, { act, useState } from "react";
import "./styles.scss";
import useFetchTvlData from "@/hooks/Analytics/useFetchTvlData";
import  {LineChart} from "@mui/x-charts/LineChart";
import { areaElementClasses, legendClasses, lineElementClasses } from "@mui/x-charts";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { formatDisplayText } from "@/utils/number";
import dynamic from "next/dynamic";

const DynamicCustomSpinner = dynamic(() =>
  import("@/components/common/CustomSpinner").then((mod) => mod.CustomSpinner)
);

export const TvlGraphContainer = () => {
  const {tvlDataArray,tvlValue,loading}=useFetchTvlData();
  const [activeId,setActiveId]=useState<number>(-1);
  if(loading){
    return <div className="GraphContainerLoading">
      <DynamicCustomSpinner size={"30"} color="#323227" />
      </div>
  }

  return (
    <div className="GraphContainer">
        <div className="GraphDetails">
          <div className="GraphInfo">
            <span className="GraphName">Eddy Liquidity</span>
            <span className="ActiveValue">{formatDisplayText(tvlValue,2)}</span>
          </div>
        </div>
        <div className="GraphCanvas">
         <LineChart
         dataset={tvlDataArray}
         sx={{
          [`& .${legendClasses.root}`]: {
            display: 'none',
          },
          [`& .${areaElementClasses.root}`]: {
            fill: '#7bf179',
            stroke:'#7bf179',
            strokeOpacity:1,
            fillOpacity:0.6
          },
          [`& .${lineElementClasses.root}`]: {
            stroke:'#7bf179',
            strokeWidth:1.5,
            strokeLinejoin:"bevel"
          }
         }}
         series={[
          {
            dataKey:'tvl',
            area:true,
            showMark:false,
            label:'TVL',
          }
         ]}
         
         leftAxis={{
          tickLabelStyle:{
            fontSize:10,
           fill:'#ffffff',
           fontWeight:700,
           fontFamily:"Manrope",
           lineHeight:18,
           opacity:0.5,
          transform:"translateX(10px)"
          },
         tickLabelInterval: (value:number,index:number)=>value%1000000===0 && value!=0,
         tickNumber:3,
         tickLabelPlacement:"tick"
         }}
         height={250}
         margin={{
          top:30,
          left:15,
          right:0,
          bottom:20
        }}
        yAxis={[
          {
            scaleType:"linear",
            dataKey:"tvl",
            valueFormatter(value, context) {
              const answer=formatDisplayText(value,0)
              return answer.slice(1)
            },
          }
         ]}
         xAxis={[
          {
            scaleType:'time',
            dataKey:"date",
            label:"Date",
            valueFormatter(value,context){
              const date = new Date(value * 1000); 
              const month = date.toLocaleString("default", { month: "short" }); 
              const day = date.getUTCDate(); 
              const year = date.getUTCFullYear(); 
              const formattedDate = `${month} ${day}, ${year}`;
              return formattedDate
            }
          }
         ]}
         onHighlightChange={(item)=>{
          item?.dataIndex ? setActiveId(item.dataIndex):setActiveId(-1)
         }}
         bottomAxis={{
          tickLabelStyle: {
            fontSize: 10,
            fill: "#ffffff",
            fontWeight: 700,
            fontFamily: "Manrope",
            lineHeight: 15,
            opacity: 0.5,
            transform:"translateX(20px) translateY(-5px) Rotate(0deg)",
            overflow:"hidden"
          },
          tickLabelInterval: (value: number, index: number) =>{
           return index%2===0
          }
        }}
       >   

          </LineChart>     
        </div>
  </div>
  );
};
 