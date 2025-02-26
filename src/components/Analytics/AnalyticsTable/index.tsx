"use client"
import React, { useState,useEffect } from "react";
import "./styles.scss";
import { FaSort } from "react-icons/fa";
import { PoolRow } from "./PoolRow";
import useFetchPoolAnalyticsForChain from "@/hooks/Analytics/useFetchPoolAnalyticsForChain";
import { motion } from "framer-motion";
import {PoolAnalyticsData} from "@/store/types/pool-type";
import useMediaQuery from "@mui/material/useMediaQuery"
import dynamic from "next/dynamic";
const DynamicCustomSpinner = dynamic(() =>
  import("@/components/common/CustomSpinner").then((mod) => mod.CustomSpinner)
);



export const AnalyticsTable = () => {
  const [sortedPoolData,setSortedPoolData]=useState<PoolAnalyticsData[]>([]);
  const { data, loading } = useFetchPoolAnalyticsForChain();
  const [sortOrder, setSortOrder] = useState<{ [key: string]: "asc" | "desc" }>({
    tvl: "desc",
    fees: "desc",
    volume: "desc",
  });
  useEffect(() => {
    if (data?.getPoolAnalyticsForChain) {
      setSortedPoolData(data.getPoolAnalyticsForChain);
    }
  }, [data]);
  const mobileDevice=useMediaQuery('(max-width:600px)')
  if (loading) {
    return <div className="GraphContainerLoading">
     <DynamicCustomSpinner size={"30"} color="#323227" />
    </div>;
  }
/**
 * function to sort the values of the analytics table
 * @param type type of the header to sort values accordingly
 */
  const handleSortingData=(type:string)=>{
    const sortedData = [...sortedPoolData];
    const currentOrder = sortOrder[type];
    const newOrder = currentOrder === "asc" ? "desc" : "asc";

    setSortOrder({ ...sortOrder, [type]: newOrder });
    if (type==="fees"){
      setSortedPoolData(sortedData.sort((a,b)=> {
        const feesA = a.latestStats?.fees_24_hours || 0;
        const feesB = b.latestStats?.fees_24_hours || 0;
        return newOrder === "asc" ? feesA - feesB : feesB - feesA;
      }))
    }else if(type==="volume"){
      setSortedPoolData(sortedData.sort((a,b)=> {
        const volumeA = a.latestStats?.volume_24_hours|| 0;
        const volumeB = b.latestStats?.volume_24_hours || 0;
        return newOrder === "asc" ? volumeA - volumeB : volumeB - volumeA;
      }))
    }else{
      setSortedPoolData(sortedData.sort((a,b)=> {
        const tvlA = a.tvl|| 0;
        const tvlB = b.tvl || 0;
        return newOrder === "asc" ? tvlA - tvlB : tvlB - tvlA;
      }))
    }
  }

{
  return !mobileDevice ? (
    <motion.div 
    transition={{ delay: 0.2 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="AnalyticsTable">
        <div className="TableHeader">
          <div className="Header">
            <span className="HeaderText">Pools</span>
          </div>
          <div className="Header" onClick={()=>{
               handleSortingData("tvl")
            }}>
            <span className="HeaderText">TVL</span>
            <span className="SortIcon" >
              <FaSort />
            </span>
          </div>
          <div className="Header"  onClick={()=>{
               handleSortingData("fees")
            }}>
            <span className="HeaderText">Fees</span>
            <span className="HeaderLabel" >24h</span>
            <span className="SortIcon">
              <FaSort />
            </span>
          </div>
          <div className="Header"  onClick={()=>{
               handleSortingData("volume")
            }}>
            <span className="HeaderText">Volume</span>
            <span className="HeaderLabel" >24h</span>
            <span className="SortIcon">
              <FaSort />
            </span>
          </div>
        </div>
        <div className="TableBody">
          {
            sortedPoolData.filter((item:PoolAnalyticsData)=> item.statsDiff !=null && item.latestStats!=null).map((item: PoolAnalyticsData) => (
              <PoolRow
                __typename={item.__typename}
                key={`${item.tvl}-${item.name}-${item.statsDiff.volume_24_hours}`} 
                latestStats={item.latestStats}
                name={item.name}
                statsDiff={item.statsDiff}
                totalReserve={item.totalReserve}
                lpFee={item.lpFee}
                tvl={item.tvl}
              />
            ))}
        </div>
      </motion.div>
    ) 
    :
    <motion.div
    transition={{ delay: 0.2 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="TableMobile"
    >
      <div className="TableMobileHeader">
      <div onClick={()=>{
               handleSortingData("volume")
            }}>
      <span>Volume</span>
      <span className="HeaderLabel">24h</span>
      <span className="SortIconMobile" >
              <FaSort />
      </span>
      </div>
      <div onClick={()=>{
               handleSortingData("fees")
        }}>
      <span>Fees</span>
      <span className="HeaderLabel" >24h</span>
            <span className="SortIconMobile" >
              <FaSort />
            </span>
      </div>
      </div>
      <div className="TableBody">
          {
            sortedPoolData.filter((item:PoolAnalyticsData)=> item.statsDiff !=null && item.latestStats!=null).map((item: PoolAnalyticsData) => (
              <PoolRow
                __typename={item.__typename}
                key={`${item.tvl}-${item.name}-${item.statsDiff.volume_24_hours}`} 
                latestStats={item.latestStats}
                name={item.name}
                statsDiff={item.statsDiff}
                totalReserve={item.totalReserve}
                lpFee={item.lpFee}
                tvl={item.tvl}
              />
            ))}
        </div>
    </motion.div>
     
}
  
};
