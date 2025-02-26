import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

interface Props {
  amount: string;
  token: Token;
}

export const DepositTokenInfo = ({ amount, token }: Props) => {
  const { data } = useFetchTokenDollarValue({
    tokenId: token.id,
  });
  return (
    <div className="DepositTokenInputWrapper">
      <div className="TokenInputContainer">
        <div className="InputContainer">
          <span className="Token-Input">{amount}</span>
          <div className="DollarValue">
            ${(Number(data) * Number(amount)).toFixed(4)}
          </div>
        </div>
        <div className="TokenInfoContainer">
          <div className="TokenLogo">
            <CustomIcon src={token?.tokenLogo} />
            <div className="ChainLogo">
              <CustomIcon src={token?.chain.chainLogo} />
            </div>
          </div>
          <div className="TokenName">{token.name}</div>
        </div>
      </div>
    </div>
  );
};
