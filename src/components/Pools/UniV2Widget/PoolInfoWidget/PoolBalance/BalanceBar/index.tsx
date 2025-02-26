import React from "react";
import "./styles.scss";

import Tooltip from "@mui/material/Tooltip"
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

interface Props {
  tokenName: string;
  reserveAmount: string;
  tokenDecimal: number;
  tokenId: number;
  tvl: number;
  color: string;
}

export const BalanceBar = ({
  tvl,
  tokenName,
  reserveAmount,
  tokenDecimal,
  tokenId,
  color,
}: Props) => {
  const { data, loading, error } = useFetchTokenDollarValue({
    tokenId: tokenId,
  });

  const returnReservesBreakdown = () => {
    if (loading || error) return "0";
    else {
      return `${
        (((Number(reserveAmount) / 10 ** tokenDecimal) * Number(data)) /
          Number(tvl)) *
        100
      }%`;
    }
  };
  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#121212",
            border: "2px solid #1E1E1E",
            fontFamily: "Manrope",
          },
        },
      }}
      title={tokenName}
    >
      <div
        style={{
          width: returnReservesBreakdown(),
          backgroundColor: color,
        }}
        className="Breakdown"
      ></div>
    </Tooltip>
  );
};
