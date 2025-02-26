import React from "react";
import "./styles.scss";

import { DOCS_LINK } from "@/utils/constants";

export const PoolsInfo = () => {
  /**
   * Function to open external links.
   */
  const handleOpenLink = () => {
    window.open(DOCS_LINK, "_blank");
  };
  return (
    <div className="PoolsInfoWrapper">
      <div className="HeadingContainer">
        <span>How does Liquidity Pools work?</span>
      </div>
      <div className="InfoContainer">
        <div className="InfoCard">
          <div className="HeadingContainer">
            <div className="InfoIndex">1</div>
            <span>Deposit Liquidity</span>
          </div>
          <div className="InfoContent">
            <span>
              Select a liquidity pool that suits your preferences and supply a
              pair of assets in our AMM pools or any supported assets in
              StableSwap pools. In return, you&apos;ll receive LP tokens,
              representing your share of the liquidity provided.
            </span>
          </div>
        </div>
        <div className="InfoCard">
          <div className="HeadingContainer">
            <div className="InfoIndex">2</div>
            <span>Earn Fees</span>
          </div>
          <div className="InfoContent">
            <span>
              As transactions occur within the pool, fees are collected and
              added to your LP tokens&apos; value. This accrues daily, giving
              you real-time APY as your token holdings grow.
            </span>
          </div>
        </div>
        <div className="InfoCard">
          <div className="HeadingContainer">
            <div className="InfoIndex">3</div>
            <span>Claim Your Rewards</span>
          </div>
          <div className="InfoContent">
            <span>
              Boosted pool rewards are distributed every Sunday. If you&apos;ve
              contributed liquidity to these pools, simply visit the rewards
              page, select the relevant week, and claim your earnings with ease.
            </span>
          </div>
        </div>
      </div>
      <div className="InfoButton" onClick={handleOpenLink}>
        Read More
      </div>
    </div>
  );
};
