"use client";
import React, { Suspense,useState } from "react";
import "./styles.scss";
import Link from "next/link";
import dynamic from "next/dynamic";

import useFetchAllPoolsForChainId from "@/hooks/Pools/useFetchAllPoolsForChainId";

import CustomIcon from "@/components/common/CustomIcon";
import { SEARCH_ICON } from "@/utils/images";
import { PoolsTable } from "./PoolsTable";
import { SinglePoolResponse } from "@/store/types/pool-type";
import { POSITIONS_ROUTE } from "@/utils/route";
import { FilterWidget } from "./PoolsTable/FilterWidget";
import { POOL_TYPE } from "@/utils/enums";



const DynamicPoolsInfo = dynamic(
  () => import("./PoolsInfo").then((mod) => mod.PoolsInfo),
  {
    ssr: false,
  }
);

export const PoolsWidget = () => {
  const [query, setQuery] = useState("");
  const [poolType, setPoolType] = useState(POOL_TYPE.UNI_V3 as string);
  const [sortByTVL, setSortByTVL] = useState<boolean>(true);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const { loading, error, data } = useFetchAllPoolsForChainId({
    sortByTVL: sortByTVL,
    isAscending: isAscending,
  });

  const updatePoolType = (type: string) => {
    setPoolType(type);
  };

  return (
    <div className="PoolsWidgetWrapper">
      <div className="MobilePoolsHeader">Liquidity Pools</div>
      <div className="PoolsHeadingContainer">
        <div className="SearchWrapper">
          <div className="SearchContainer">
            <div className="SearchIcon">
              <CustomIcon src={SEARCH_ICON} />
            </div>
            <input
              placeholder={"Search pools"}
              className="SearchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
            />
          </div>
          <div className="FilterContainer">
            <FilterWidget
              handleSetPoolType={updatePoolType}
              poolType={poolType}
            />
          </div>
        </div>
        <Link
          style={{
            textDecoration: "none",
          }}
          href={POSITIONS_ROUTE}
        >
          <div className="ManageButton">My Positions</div>
        </Link>
      </div>
      
      <PoolsTable
        data={data
          .filter((item: SinglePoolResponse) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
          .filter((item: SinglePoolResponse) =>
            !poolType ? true : item.poolType === poolType
          )}
        loading={loading}
        setSortByTVL={setSortByTVL}
        setIsAscending={setIsAscending}
        error={error}
      />
      <DynamicPoolsInfo />
    </div>
  );
};
