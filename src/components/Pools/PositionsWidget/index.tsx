"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";

import "./styles.scss";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT, SEARCH_ICON } from "@/utils/images";
import { PositionsTable } from "./PositionsTable";

export const PositionsWidget = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="PositionsWidgetWrapper">
      <div className="PoolsHeader">
        <Link href={"/pools"}>
          <div className="BackBtn">
            {" "}
            <CustomIcon src={ARROW_LEFT} />
          </div>
        </Link>
        <span className="HeadingText">My Positions</span>
      </div>
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
        </div>
      </div>
      <PositionsTable query={query} />
    </div>
  );
};
