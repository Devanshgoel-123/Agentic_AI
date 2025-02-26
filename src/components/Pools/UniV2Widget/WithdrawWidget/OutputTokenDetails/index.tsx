import React from "react";
import "./styles.scss";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import { Token } from "@/store/types/token-type";
import CustomIcon from "@/components/common/CustomIcon";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";

interface Props {
  amount: string;
  token: Token;
}

export const OutputTokenDetails = ({ token, amount }: Props) => {
  const { loading, data, error } = useFetchTokenDollarValue({
    tokenId: token.id,
  });

  /**
   * Return dollar value as per loading and error state
   * @returns JSX
   */
  const returnDollarValue = () => {
    if (loading || error) {
      return <CustomTextLoader text="$0.00" />;
    } else {
      return (
        "$" +
        `${(
          (Number(amount) / 10 ** Number(token?.decimal)) *
          Number(data)
        ).toFixed(4)}`
      );
    }
  };

  return (
    <div className="OutputToken">
      <div className="TokenDetails">
        <div className="TokenLogo">
          <CustomIcon src={token.tokenLogo} />
        </div>
        <span className="TokenAmount">
          {(Number(amount) / 10 ** token.decimal).toFixed(5)}
        </span>
        <span className="TokenName">{token.name}</span>
      </div>
      <div className="TokenDollar">{returnDollarValue()}</div>
    </div>
  );
};
