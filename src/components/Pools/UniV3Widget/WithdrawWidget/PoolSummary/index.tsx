import React from "react";
import "./styles.scss";

import useUniV3Store from "@/store/univ3-store";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  formatNumberWithDecimals,
} from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";

interface Props {
  loading: boolean;
  token0: Token;
  token1: Token;
  token0Dollar: number;
  token1Dollar: number;
  depositedToken0: number;
  depositedToken1: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
}

export const PoolSummary = ({
  loading,
  token0,
  token1,
  token0Dollar,
  token1Dollar,
  depositedToken0,
  depositedToken1,
  collectedFeesToken0,
  collectedFeesToken1,
}: Props) => {
  /**
   * Total estimated value of returns for user.
   * @returns Token 0 + Token1 estimated value.
   */
  const returnTotalEstimatedValue = () => {
    const estValToken0 = Number(collectedFeesToken0) * Number(token0Dollar);
    const estValToken1 = Number(collectedFeesToken1) * Number(token1Dollar);
    return estValToken0 + estValToken1;
  };

  const returnLoaderAndText = (val: string) => {
    if (loading) {
      return <CustomTextLoader text="0.00" />;
    } else {
      return val;
    }
  };

  return (
    <div className="PoolSummaryWrapper">
      <span className="Label">Summary</span>
      <div className="InfoContainer">
        <span className="Label">Liquidity</span>
        <div className="InfoSection">
          <span className="Label">{token0.name}</span>
          <span className="Value">
            {" "}
            {formatNumberWithDecimals(Number(depositedToken0.toString()))}
          </span>
        </div>
        <div className="InfoSection">
          <span className="Label">{token1.name}</span>
          <span className="Value">
            {" "}
            {formatNumberWithDecimals(Number(depositedToken1.toString()))}
          </span>
        </div>
      </div>
      <div className="InfoContainer">
        <span className="Label">Fee Gains</span>
        <div className="InfoSection">
          <span className="Label">{token0.name}</span>
          <span className="Value">
            {" "}
            {formatNumberWithDecimals(Number(collectedFeesToken0.toString()))}
          </span>
        </div>
        <div className="InfoSection">
          <span className="Label">{token1.name}</span>
          <span className="Value">
            {" "}
            {formatNumberWithDecimals(Number(collectedFeesToken0.toString()))}
          </span>
        </div>
      </div>
      <div className="InfoContainer">
        <span className="Label">Totals</span>
        <div className="InfoSection">
          <div className="TokenInfo">
            <div className="TokenLogo">
              <CustomIcon src={token0.tokenLogo} />
            </div>
            <span className="TokenName">{token0.name}</span>
          </div>
          <span className="TokenValue">
            {" "}
            {returnLoaderAndText(
              formatNumberWithDecimals(
                Number(
                  convertBigIntToUIFormat(
                    useUniV3Store.getState().token0WithdrawAmount,
                    token0.decimal
                  )
                ) * Number(token0Dollar)
              )
            )}
          </span>
        </div>
        <div className="InfoSection">
          <div className="TokenInfo">
            <div className="TokenLogo">
              <CustomIcon src={token1.tokenLogo} />
            </div>
            <span className="TokenName">{token1.name}</span>
          </div>
          <span className="TokenValue">
            {" "}
            {returnLoaderAndText(
              formatNumberWithDecimals(
                Number(
                  convertBigIntToUIFormat(
                    useUniV3Store.getState().token1WithdrawAmount,
                    token1.decimal
                  )
                ) * Number(token1Dollar)
              )
            )}
          </span>
        </div>
      </div>
      <div className="FeeValueContainer">
        <span>Est. Value</span>
        <span>
          {" "}
          $
          {returnLoaderAndText(
            formatNumberWithDecimals(
              Number(
                formatNumberWithDecimals(
                  Number(
                    convertBigIntToUIFormat(
                      useUniV3Store.getState().token1WithdrawAmount,
                      token1.decimal
                    )
                  ) * Number(token1Dollar)
                )
              ) +
                Number(
                  formatNumberWithDecimals(
                    Number(
                      convertBigIntToUIFormat(
                        useUniV3Store.getState().token0WithdrawAmount,
                        token0.decimal
                      )
                    ) * Number(token0Dollar)
                  )
                )
            )
          )}
        </span>
      </div>
    </div>
  );
};
