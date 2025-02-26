import React, { useEffect } from "react";
import "./styles.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import { PoolData } from "@/store/types/pool-type";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import dynamic from "next/dynamic";
import { FaSort } from "react-icons/fa6";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  data: PoolData[];
  loading: boolean;
  setSortByTVL: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAscending: React.Dispatch<React.SetStateAction<boolean>>;
  error: any;
}

const DynamicPoolRow = dynamic(
  () => import("./PoolRow").then((mod) => mod.PoolRow),
  {
    ssr: false,
  }
);

export const PoolsTable = ({ data, loading, error }: Props) => {
  const mobileDevice = useMediaQuery("(max-width:600px)");
  const [sortOrder, setSortOrder] = useState<{ [key: string]: "asc" | "desc" }>(
    {
      tvl: "desc",
      apy: "desc",
    }
  );
  const [poolData, setSortedPoolData] = useState<PoolData[]>([]);

  useEffect(() => {
    if (data) {
      setSortedPoolData(data);
    }
  }, [data]);

  const returnPoolsData = () => {
    if (loading) {
      return (
        <div className="LoadingContainer">
          <CustomSpinner size="20" color="#909090" />
        </div>
      );
    } else if (error) {
      return (
        <div className="LoadingContainer">
          <CustomSpinner size="20" color="#909090" />
        </div>
      );
    } else {
      return poolData.map((item, index) => (
        <DynamicPoolRow
          key={index}
          name={item.name}
          tvl={item.tvl}
          apy={item.apy}
          lpFee={item.lpFee}
          slug={item.slug}
          poolType={item.poolType}
          boostInfo={item.boostInfo}
          tokens={item.tokens}
          index={index}
          lpSymbol={item.lpSymbol}
          lpTokenImage={item.lpTokenImage}
        />
      ));
    }
  };

  /**
   * function to sort the values of the analytics table
   * @param type type of the header to sort values accordingly
   */
  const handleSortingData = (type: string) => {
    const currentOrder = sortOrder[type];
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    setSortOrder({ ...sortOrder, [type]: newOrder });
    const sortedData = [...poolData].sort((a, b) => {
      if (type === "apy") {
        const apyA = a.apy || 0;
        const apyB = b.apy || 0;
        return newOrder === "asc" ? apyA - apyB : apyB - apyA;
      } else if (type === "tvl") {
        return newOrder === "asc" ? a.tvl - b.tvl : b.tvl - a.tvl;
      }
      return 0;
    });
    setSortedPoolData(sortedData);
  };
  return (
    <div className="PoolsTable">
      {!mobileDevice ? (
        <div className="TableHeader">
          <div className="Header">Pool</div>
          <div
            className="Header"
            onClick={() => {
              handleSortingData("tvl");
            }}
          >
            TVL
            <span className="SortIcon">
              <FaSort />
            </span>
          </div>
          <div
            className="Header"
            onClick={() => {
              handleSortingData("apy");
            }}
          >
            APY
            <span className="SortIcon">
              <FaSort />
            </span>
          </div>
        </div>
      ) : (
        <div className="TableMobileHeader">
          <div
            onClick={() => {
              handleSortingData("tvl");
            }}
          >
            <span>TVL</span>
            <span className="HeaderLabel">24h</span>
            <span className="SortIconMobile">
              <FaSort />
            </span>
          </div>
          <div
            onClick={() => {
              handleSortingData("apy");
            }}
          >
            <span>APY</span>
            <span className="HeaderLabel">24h</span>
            <span className="SortIconMobile">
              <FaSort />
            </span>
          </div>
        </div>
      )}
      <motion.div
        transition={{ delay: 0.2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="TableBody"
      >
        {returnPoolsData()}
      </motion.div>
    </div>
  );
};
