import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import { useShallow } from "zustand/react/shallow";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";
import useCurveStore from "@/store/curve-store";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";

interface Props {
  selectedTokenId: number;
  token: Token;
  setSelectedTokenId: (id: number) => void;
}

export const SingleWithdrawTokenDetails = ({
  token,
  selectedTokenId,
  setSelectedTokenId,
}: Props) => {
  const { minAmountOneToken } = useCurveStore(
    useShallow((state) => ({
      minAmountOneToken: state.minAmountOneToken,
    }))
  );
  const { data } = useFetchTokenDollarValue({
    tokenId: token.id,
  });

  const returnAmount = () => {
    if (minAmountOneToken && minAmountOneToken.token.id === token.id) {
      return (
        Number(minAmountOneToken.amount) /
        10 ** Number(token.decimal)
      ).toFixed(4);
    } else {
      return 0.0;
    }
  };

  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="OutputToken"
    >
      <div className="TokenDetails">
        <div
          style={{
            border:
              selectedTokenId === token.id
                ? "1px solid #7BF179"
                : "1px solid #383838",
          }}
          className="CustomRadioButton"
          onClick={() => {
            setSelectedTokenId(token.id);
          }}
        >
          <div
            style={{
              transform: selectedTokenId === token.id ? "scale(1)" : "scale(0)",
            }}
            className="RadioCircle"
          ></div>
        </div>
        <div className="TokenLogo">
          <CustomIcon src={token.tokenLogo} />
        </div>
        <span className="TokenAmount">{returnAmount()}</span>
        <span className="TokenName">{token.name}</span>
      </div>
      <div className="TokenDollar">
        ${(Number(returnAmount()) * Number(data)).toFixed(4)}
      </div>
    </motion.div>
  );
};
