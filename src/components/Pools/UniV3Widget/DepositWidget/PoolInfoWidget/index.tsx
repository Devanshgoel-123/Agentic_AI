import React from "react";
import "./styles.scss";
import { PoolBalance } from "./PoolBalance";
import { PoolReservesData } from "@/store/types/pool-type";
import { Token } from "@/store/types/token-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";

interface Props {
  tvl: number;
  dailyVolume: number;
  reserves: PoolReservesData[];
  tokens: Token[];
  loading: boolean;
  error: any;
}

export const PoolInfoWidget = ({
  tvl,
  dailyVolume,
  reserves,
  tokens,
  loading,
  error,
}: Props) => {
  /**
   * Check loading state an error state and return JSX.
   * @param val Value to be displayed
   * @returns JSX after loading or error
   */
  const returnLoadingValue = (val: string | number) => {
    if (loading || error) {
      return <CustomTextLoader text={val.toString()} />;
    } else {
      return val;
    }
  };
  return (
    <div className="PoolInfoWidgetContainer">
      <div className="PoolInfo">
        <div className="PoolInfoBox">
          <span className="Label">TVL</span>
          <span className="Value">
            {returnLoadingValue("$" + `${Number(tvl).toLocaleString()}`)}
          </span>
        </div>
        <div className="PoolInfoBox">
          <span className="Label">Volume</span>
          <span className="Value">
            {returnLoadingValue(
              "$" + `${Number(dailyVolume).toLocaleString()}`
            )}
          </span>
        </div>
      </div>
      <PoolBalance tvl={tvl} tokens={tokens} reserves={reserves} />
    </div>
  );
};
