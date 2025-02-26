import React from "react";
import "./styles.scss";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";

interface Props {
  amount: string;
  token: Token | undefined;
}

export const WithdrawTokenInfo = ({ token, amount }: Props) => {
  const { data } = useFetchTokenDollarValue({
    tokenId: token?.id as number,
  });
  return (
    <div className="TokenInputWrapper">
      <div className="TokenInputContainer">
        <div className="InputContainer">
          <span className="Token-Input">
            {(Number(amount) / 10 ** (token?.decimal as number)).toFixed(4)}
          </span>
          <div className="DollarValue">
            $
            {(
              (Number(amount) / 10 ** (token?.decimal as number)) *
              Number(data)
            ).toFixed(4)}
          </div>
        </div>
        <div className="TokenInfoContainer">
          <div className="TokenLogo">
            <CustomIcon src={token?.tokenLogo as string} />
            <div className="ChainLogo">
              <CustomIcon src={token?.chain.chainLogo as string} />
            </div>
          </div>
          <div className="TokenName">{token?.name}</div>
        </div>
      </div>
    </div>
  );
};
