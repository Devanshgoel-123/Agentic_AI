"use client";
import React, { useState } from "react";
import "./styles.scss";

import Link from "next/link";

import { usePathname } from "next/navigation";
import useFetchSinglePoolData from "@/hooks/Pools/useFetchSinglePoolData";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import { DepositWidget } from "./DepositWidget";
import { PoolInfoWidget } from "./PoolInfoWidget";
import { WithdrawWidget } from "./WithdrawWidget";
import { useAccount } from "wagmi";
import useFetchLpTokenBalance from "@/hooks/Pools/useFetchLpTokenBalance";
import { UniV2PoolLabel } from "../PoolsWidget/PoolsTable/PoolRow/UniV2PoolLabel";

export const UniV2Widget = () => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const { address } = useAccount();
  const path = usePathname();
  const id = path.split("/").pop();

  const { data, loading, error } = useFetchSinglePoolData({
    poolId: id as string,
  });

  const {
    data: lpTokenData,
    loading: lpTokenLoading,
    error: lpTokenError,
    refetch,
  } = useFetchLpTokenBalance({
    poolId: id as string,
    walletAddress: address,
    lpTokenDecimal: data.lpTokenDecimals,
    setterFunction: () => {},
    isPolling: false,
  });

  return (
    <div className="UniV2WidgetWrapper">
      <div className="HeadingContainer">
        <Link href={"/pools"}>
          <div className="BackBtn">
            <CustomIcon src={ARROW_LEFT} />
          </div>
        </Link>
        <span className="Heading">{data.name}</span>
        <UniV2PoolLabel />
      </div>
      <div className="PoolActionsWrapper">
        <PoolInfoWidget
          tvl={data.tvl}
          apy={data.apy}
          boostedAPYData={data.boostInfo}
          dailyVolume={data.dailyVolume}
          poolFee={data.lpFee}
          reserves={data.totalReserve}
          tokens={data.tokens}
          lpTokenImage={data.lpTokenImage}
          lpTokenName={data.lpSymbol}
          lpTokenValue={(
            Number(lpTokenData) /
            10 ** data.lpTokenDecimals
          ).toFixed(4)}
          loading={loading}
          error={error}
        />
        <div className="PoolActionsContainer">
          <div className="PoolInputsWrapper">
            <div className="PoolTabContainer">
              <div
                style={{
                  background:
                    activeTab === "deposit"
                      ? "linear-gradient(104.9deg, rgba(88, 88, 88, 0.5) -76.37%, #121212 97.95%), linear-gradient(93.04deg, #7BF179 -54.58%, rgba(71, 139, 70, 0) 99.98%)"
                      : "#121212",
                }}
                className={`PoolsTabActive ${
                  activeTab === "deposit" ? "show-line" : ""
                }`}
                onClick={() => setActiveTab("deposit")}
              >
                Deposit
              </div>
              <div
                style={{
                  background:
                    activeTab === "withdraw"
                      ? "linear-gradient(104.9deg, rgba(88, 88, 88, 0.5) -76.37%, #121212 97.95%), linear-gradient(93.04deg, #7BF179 -54.58%, rgba(71, 139, 70, 0) 99.98%)"
                      : "#121212",
                }}
                className={`PoolsTabActive ${
                  activeTab === "withdraw" ? "show-line" : ""
                }`}
                onClick={() => setActiveTab("withdraw")}
              >
                Withdraw
              </div>
            </div>
            {activeTab === "deposit" && (
              <DepositWidget
                poolName={data.name}
                poolChainId={data.chainId}
                tokens={data.tokens}
                lpTokenAddress={data.lpTokenAddress}
                lpSymbol={data.lpSymbol}
                lpTokenImage={data.lpTokenImage}
                slug={id as string}
                refetchLpTokenBalance={refetch}
              />
            )}
            {activeTab === "withdraw" && (
              <WithdrawWidget
                poolName={data.name}
                poolChainId={data.chainId}
                lpTokenName={data.lpSymbol}
                lpTokenImage={data.lpTokenImage}
                lpTokenAddress={data.lpTokenAddress}
                lpTokenDecimal={data.lpTokenDecimals}
                tokens={data.tokens}
                slug={id as string}
                refetchLpTokenBalance={refetch}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
