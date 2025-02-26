import React from "react";
import "./styles.scss";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { formatNumberWithDecimals } from "@/utils/number";

interface Props {
  tokenImage: string;
  tokenName: string;
  tokenDecimal: number;
  reserveAmount: string;
  tokenId: number;
  index: number;
}

export const PoolTokenBalance = ({
  tokenImage,
  tokenName,
  reserveAmount,
  tokenDecimal,
  tokenId,
  index,
}: Props) => {
  const { data, loading, error } = useFetchTokenDollarValue({
    tokenId: tokenId,
  });
  const returnReserveAmountInDollar = () => {
    if (loading || error) {
      return <CustomTextLoader text="$0.00" />;
    } else {
      return (
        "$" +
        `${formatNumberWithDecimals(
          (Number(reserveAmount) / 10 ** tokenDecimal) * Number(data),
          true
        )}`
      );
    }
  };
  return (
    <div
      style={{
        justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
      }}
      className="PoolTokenBalanceInfo"
    >
      <span className="Amount">{returnReserveAmountInDollar()}</span>
      <div className="TokenInfo">
        <div className="Logo">
          <CustomIcon src={tokenImage} />
        </div>
        <span className="TokenName">{tokenName}</span>
      </div>
    </div>
  );
};
