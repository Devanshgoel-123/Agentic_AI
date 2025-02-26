import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import { MinTokenAmountObject } from "@/store/curve-store";
import CustomIcon from "@/components/common/CustomIcon";

interface Props {
  token: MinTokenAmountObject;
}

export const WithdrawTokenDetails = ({ token }: Props) => {
  const { data } = useFetchTokenDollarValue({
    tokenId: token.token.id,
  });
  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="BalanceOutputToken"
    >
      <div className="TokenDetails">
        <div className="TokenLogo">
          <CustomIcon src={token.token.tokenLogo} />
        </div>
        <span className="TokenAmount">
          {(Number(token.amount) / 10 ** Number(token.token.decimal)).toFixed(
            4
          )}
        </span>
        <span className="TokenName">{token.token.name}</span>
      </div>
      <div className="TokenDollar">
        $
        {(
          (Number(token.amount) / 10 ** Number(token.token.decimal)) *
          Number(data)
        ).toFixed(4)}
      </div>
    </motion.div>
  );
};
