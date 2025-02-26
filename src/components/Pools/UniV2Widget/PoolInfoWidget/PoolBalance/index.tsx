import React from "react";
import "./styles.scss";

import Tooltip from "@mui/material/Tooltip"
import { Token } from "@/store/types/token-type";
import { PoolReservesData } from "@/store/types/pool-type";
import { PoolTokenBalance } from "./PoolTokenBalance";
import { BalanceBar } from "./BalanceBar";
import { POOL_BALANCE_COLORS } from "@/utils/constants";

interface Props {
  tvl: number;
  reserves: PoolReservesData[];
  tokens: Token[];
}

export const PoolBalance = ({ tvl, tokens, reserves }: Props) => {
  return (
    <div className="PoolsBalancesContainer">
      <span className="Label">Pool Balances</span>
      <div className="PoolsBreakDownContainer">
        {reserves &&
          reserves.length > 0 &&
          reserves.map((item, index) => (
            <PoolTokenBalance
              key={index}
              tokenImage={item.tokenImage}
              tokenName={item.tokenName}
              reserveAmount={item.reserves}
              tokenDecimal={item.tokenDecimal}
              tokenId={
                tokens.length > 0
                  ? tokens.filter(
                      (el) =>
                        el.name.toLowerCase() ===
                          item.tokenName.toLowerCase() ||
                        el.name
                          .toLowerCase()
                          .includes(item.tokenName.toLowerCase())
                    )[0].id
                  : 0
              }
            />
          ))}
      </div>
      <div className="BalanceBreakdown">
        {reserves &&
          reserves.length > 0 &&
          reserves.map((item, index) => (
            <BalanceBar
              key={index}
              tvl={tvl}
              tokenName={item.tokenName}
              tokenDecimal={item.tokenDecimal}
              reserveAmount={item.reserves}
              color={POOL_BALANCE_COLORS[index]}
              tokenId={
                tokens.length > 0
                  ? tokens.filter(
                      (el) =>
                        el.name.toLowerCase() ===
                          item.tokenName.toLowerCase() ||
                        el.name
                          .toLowerCase()
                          .includes(item.tokenName.toLowerCase())
                    )[0].id
                  : 0
              }
            />
          ))}
      </div>
    </div>
  );
};
