import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import useCurveStore from "@/store/curve-store";

import { GET_WITHDRAW_CURVE_QUOTE } from "@/components/graphql/queries/getWithdrawCurveQuote";

interface Props {
  slug: string;
  slippage: number;
  amount: string;
  isBalanced: boolean;
  selectedIndex: number;
}

const useFetchWithdrawCurveQuote = ({
  slug,
  slippage,
  amount,
  isBalanced,
  selectedIndex,
}: Props) => {
  const { loading, error, data } = useQuery(GET_WITHDRAW_CURVE_QUOTE, {
    variables: {
      slug: slug,
      slippage: slippage,
      lpTokenAmount: amount,
      withdrawType: {
        isBalanced: isBalanced,
        tokenId: isBalanced ? null : selectedIndex,
      },
    },
  });

  useEffect(() => {
    if (data && data.getCurveWithdrawQuote) {
      /**
       * if isBalanced store data in minAmountTokens
       * else store in minAmountOneToken.
       */
      if (isBalanced) {
        useCurveStore
          .getState()
          .setMinAmountTokens(data.getCurveWithdrawQuote.tokens);
      } else {
        useCurveStore
          .getState()
          .setMinAmountOneToken(data.getCurveWithdrawQuote.tokens[0]);
      }
    }
  }, [data, isBalanced]);

  return { loading, error };
};

export default useFetchWithdrawCurveQuote;
