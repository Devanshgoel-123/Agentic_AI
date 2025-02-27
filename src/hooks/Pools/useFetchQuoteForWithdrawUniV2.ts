import { useEffect } from "react";
import useUniV2Store from "@/store/univ2-store";
import { useQuery } from "@apollo/client";

import { GET_WITHDRAW_UNIV2_QUOTE } from "@/components/graphql/queries/getWidthdrawUniV2Quote";

interface Props {
  slug: string;
  slippage: number;
  amount: string;
}

const useFetchQuoteForWithdrawUniV2 = ({ slug, slippage, amount }: Props) => {
  const { loading, error, data } = useQuery(GET_WITHDRAW_UNIV2_QUOTE, {
    variables: { slug: slug, slippage: slippage, lpTokenAmount: amount },
  });

  useEffect(() => {
    if (data && data.getWithdrawQuote) {
      /**
       * Token B should always be gas token in case of gas pools
       * else any order with work.
       */
      if (data.getWithdrawQuote.token1.isNative) {
        useUniV2Store
          .getState()
          .setMinAmountAObject(
            data.getWithdrawQuote.minAmountToken2,
            data.getWithdrawQuote.token2
          );
        useUniV2Store
          .getState()
          .setMinAmountBObject(
            data.getWithdrawQuote.minAmountToken1,
            data.getWithdrawQuote.token1
          );
      } else {
        useUniV2Store
          .getState()
          .setMinAmountAObject(
            data.getWithdrawQuote.minAmountToken1,
            data.getWithdrawQuote.token1
          );
        useUniV2Store
          .getState()
          .setMinAmountBObject(
            data.getWithdrawQuote.minAmountToken2,
            data.getWithdrawQuote.token2
          );
      }
    }
  }, [data]);

  return { loading, error };
};

export default useFetchQuoteForWithdrawUniV2;
