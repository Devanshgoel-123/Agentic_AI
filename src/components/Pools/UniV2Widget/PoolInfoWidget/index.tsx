import React from "react";
import "./styles.scss";

import CustomIcon from "@/components/common/CustomIcon";
import { BoostAPYData, PoolReservesData } from "@/store/types/pool-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { PoolBalance } from "./PoolBalance";
import { Token } from "@/store/types/token-type";
import Tooltip from "@mui/material/Tooltip"
import { INFO_ICON } from "@/utils/images";

interface Props {
  tvl: number;
  apy: number;
  boostedAPYData: BoostAPYData[];
  dailyVolume: number;
  poolFee: number;
  reserves: PoolReservesData[];
  tokens: Token[];
  lpTokenValue: string;
  lpTokenImage: string;
  lpTokenName: string;
  loading: boolean;
  error: any;
}

export const PoolInfoWidget = ({
  tvl,
  apy,
  boostedAPYData,
  dailyVolume,
  poolFee,
  reserves,
  tokens,
  lpTokenImage,
  lpTokenName,
  lpTokenValue,
  loading,
  error,
}: Props) => {
  const returnBoostedAPYData = () => {
    if (
      boostedAPYData.length > 0 &&
      boostedAPYData.some((item) => item.tokenName)
    ) {
      return boostedAPYData.map((item, index) => (
        <Tooltip
          key={index}
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "10px",
                bgcolor: "#121212",
                border: "2px solid #1E1E1E",
                fontFamily: "Manrope",
              },
            },
          }}
          title="Earn extra rewards. Eddy Finance distributes 5,335.44 ZETA weekly as liquidity incentives on this boosted pool."
        >
          <div key={index} className="BoostedAPY">
            <div className="BoostedToken">
              <CustomIcon src={item.tokenImage} />
            </div>
            <span className="BoostedValue">+{item.boost.toFixed(2)}%</span>
          </div>
        </Tooltip>
      ));
    }
  };

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
    <div className="PoolsInfoContainer">
      <div className="PoolLpTokenContainer">
        <span className="Label">Your holdings</span>
        <div className="LpTokenInfo">
          <div className="LpTokenValue">{lpTokenValue}</div>
          <div className="LpTokenLogo">
            <CustomIcon src={lpTokenImage} />
          </div>
          <div className="LpTokenValue">{lpTokenName}</div>
        </div>
      </div>
      <div className="PoolDetailContainer">
        <div className="PoolDetailLabel">
          <span className="Label">TVL</span>
          <div className="DetailValue">
            <span className="Value">
              {returnLoadingValue("$" + `${Number(tvl).toLocaleString()}`)}
            </span>
          </div>
        </div>
        <div className="PoolDetailLabel">
          <span className="Label">APY</span>
          <div className="DetailValue">
            <span className="Value">
              {returnLoadingValue(apy.toFixed(2) + "%")}
            </span>
            {returnBoostedAPYData()}
          </div>
        </div>
        <div className="PoolDetailLabel">
          <span className="Label">24h volume</span>
          <div className="DetailValue">
            <span className="Value">
              {returnLoadingValue("$" + dailyVolume.toLocaleString())}
            </span>
          </div>
        </div>
        <div className="PoolDetailLabel">
          <span className="Label">Pool Fee</span>
          <div className="DetailValue">
            <span className="Value">{returnLoadingValue(`${poolFee}%`)}</span>
          </div>
        </div>
      </div>
      <PoolBalance tvl={tvl} tokens={tokens} reserves={reserves} />
    </div>
  );
};
