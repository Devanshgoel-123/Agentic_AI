import React from "react";
import "./styles.scss";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  tokenId: number;
  tokenLogo: string;
  amount: string;
  decimal: number;
  name: string;
}

export const OutputTokenDetails = ({
  tokenId,
  tokenLogo,
  amount,
  decimal,
  name,
}: Props) => {
  const { data } = useFetchTokenDollarValue({
    tokenId: tokenId,
  });
  return (
    <div className="OutputToken">
      <div className="TokenDetails">
        <div className="TokenLogo">
          <CustomIcon src={tokenLogo} />
        </div>
        <span className="TokenAmount">
          {(Number(amount) / 10 ** Number(decimal)).toFixed(4)}
        </span>
        <span className="TokenName">{name}</span>
      </div>
      <div className="TokenDollar">
        ${((Number(amount) / 10 ** Number(decimal)) * Number(data)).toFixed(4)}
      </div>
    </div>
  );
};
