import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { IoCaretDown } from "react-icons/io5";
import { IoCaretUp } from "react-icons/io5";
import { PoolAnalyticsData } from "@/store/types/pool-type";
import { formatDisplayText } from "@/utils/number";
import useMediaQuery from "@mui/material/useMediaQuery"
import { motion } from "framer-motion";
import { MultiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/MultiTokenLogo";
import { DiTokenLogo } from "@/components/Pools/PoolsWidget/PoolsTable/PoolRow/DiTokenLogo";

export const PoolRow = ({
  statsDiff,
  name,
  latestStats,
  totalReserve,
  lpFee,
  tvl,
}: PoolAnalyticsData) => {
  const mobileDevice = useMediaQuery("(max-width:600px)");
  const getColor = (value: number) => (value < 0 ? "red" : "green");

  return !mobileDevice ? (
    <div className="AnalyticsPoolRow">
      <div className="PoolInfo">
        <div className="PoolTokenLogoContainer">
          {totalReserve.map((item, index) => {
            return (
              <div className="PoolTokenLogo" key={index}>
                <CustomIcon src={item.tokenImage} />
              </div>
            );
          })}
        </div>
        <div className="PoolInfoContainer">
          <span className="PoolName">{name}</span>
          <div className="PoolLabels">
            <span className="PoolPageBtn">Pool Fee : {lpFee}%</span>
          </div>
        </div>
      </div>
      <div className="PoolLiquidity">
        <span className="Value">{formatDisplayText(tvl, 2)}</span>
      </div>
      <div className="PoolFee">
        <span className="Value">${latestStats.fees_24_hours.toFixed(2)}</span>
      </div>
      <div className="PoolVolume">
        <span className="Value">
          {formatDisplayText(latestStats.volume_24_hours, 2)}
        </span>
        <span
          className="PoolPageBtn"
        >
          {Math.abs(statsDiff.volume_24_hours).toFixed(2)}%
          {/* {statsDiff.volume_24_hours < 0 ? <IoCaretDown /> : <IoCaretUp />} */}
        </span>
      </div>
    </div>
  ) : (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="PoolRowMobile"
    >
      <div className="Poolheader">
        <div className="PoolDetailsContainer">
          <div className="TokenLogoContainer">
            {totalReserve.length === 2 && (
              <DiTokenLogo
                tokenLogos={totalReserve.map((item) => item.tokenImage)}
              />
            )}
            {totalReserve.length === 4 && (
              <MultiTokenLogo
                tokenLogos={totalReserve.map((item) => item.tokenImage)}
              />
            )}
          </div>
          <div className="TokenDetailsContainer">
            <div className="PoolName">{name}</div>
          </div>
        </div>
        <div className="MobilePoolInfo">
          <div className="FeeLabel">Fee {lpFee}%</div>
        </div>
      </div>
      <div className="RowContainer">
        <div className="PoolTVLContainer">
          <span className="Label">TVL</span>
          <span className="TVLValue">{formatDisplayText(tvl, 2)}</span>
        </div>
        <div className="APYContainer">
          <span className="Label">Fees</span>
          <div className="FeesContainer">
            <span className="APYValue">
              {formatDisplayText(latestStats.fees_24_hours, 2)}
            </span>
            <span
              className="Value"
              style={{
                color: "#ffffff",
                display: "flex",
                alignItems: "flex-end",
                fontSize: "10px",
                paddingTop: "2px",
                opacity:0.5
              }}
            >
              {Math.abs(statsDiff.fees_24_hours).toFixed(2)}%
              {/* {statsDiff.fees_24_hours < 0 ? <IoCaretDown /> : <IoCaretUp />} */}
            </span>
          </div>
        </div>
        <div className="APYContainer">
          <span className="Label">Volume</span>
          <div className="APYValueContainer">
            <span className="APYValue">
              {formatDisplayText(latestStats.volume_24_hours, 2)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
