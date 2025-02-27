import { useQuery } from "@apollo/client";

import { GET_WITHDRAW_UNIV3_QUOTE } from "@/components/graphql/queries/getRemoveLiquidityBalanceV3";
import { Token } from "@/store/types/token-type";
import useUniV3Store from "@/store/univ3-store";
import { useEffect } from "react";

interface Props {
  nftId: number;
  percentage: number;
  slug: string;
  slippage: number;
}

const useFetchRemoveLiquidityUniV3Quote = ({
  slug,
  slippage,
  nftId,
  percentage,
}: Props) => {
  const { loading, error, data } = useQuery(GET_WITHDRAW_UNIV3_QUOTE, {
    variables: {
      slug: slug,
      slippage: slippage,
      nftId: nftId,
      percentage: percentage,
    },
  });

  useEffect(() => {
    if (data && data.getWithdrawQuoteUniv3) {
      useUniV3Store
        .getState()
        .setToken0WithdrawAmount(data.getWithdrawQuoteUniv3.token0Amount);
      useUniV3Store
        .getState()
        .setToken1WithdrawAmount(data.getWithdrawQuoteUniv3.token1Amount);
      useUniV3Store
        .getState()
        .setMinWithdrawAmountToken0(data.getWithdrawQuoteUniv3.minAmountToken0);
      useUniV3Store
        .getState()
        .setMinWithdrawAmountToken1(data.getWithdrawQuoteUniv3.minAmountToken1);
      useUniV3Store
        .getState()
        .setWithdrawLiquidity(data.getWithdrawQuoteUniv3.liquidity);
    }
  }, [data]);

  return { loading, error };
};

export default useFetchRemoveLiquidityUniV3Quote;
