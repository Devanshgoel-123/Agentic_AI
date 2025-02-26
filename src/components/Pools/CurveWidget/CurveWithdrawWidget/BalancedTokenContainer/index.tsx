import React, { Fragment } from "react";
import useCurveStore, { MinTokenAmountObject } from "@/store/curve-store";

import { WithdrawTokenDetails } from "../WithdrawTokenDetails";

interface Props {
  minAmountTokens: MinTokenAmountObject[];
}

export const BalancedTokenContainer = ({ minAmountTokens }: Props) => {
  return (
    <Fragment>
      {minAmountTokens.length > 0 &&
        minAmountTokens.map((el, index) => (
          <WithdrawTokenDetails key={index} token={el} />
        ))}
    </Fragment>
  );
};
