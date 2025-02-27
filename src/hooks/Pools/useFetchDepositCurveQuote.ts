import { GET_DEPOSIT_CURVE_QUOTE } from "@/components/graphql/queries/getDepositQuoteCurve";
import useCurveStore, { TokenInputObject } from "@/store/curve-store";
import { convertUIFormatToBigInt } from "@/utils/number";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

interface Props {
  poolId: string;
  slippage: number;
  tokenAmounts: TokenInputObject[];
}

const useFetchDepositCurveQuote = ({
  poolId,
  slippage,
  tokenAmounts,
}: Props) => {
  const { data, loading, error } = useQuery(GET_DEPOSIT_CURVE_QUOTE, {
    variables: {
      slug: poolId,
      slippage: slippage,
      tokens: useCurveStore
        .getState()
        .tokenInputs.map((el) => {
          if (el.token) {
            return {
              amount: convertUIFormatToBigInt(
                el.amount,
                Number(el.token.decimal)
              ).toString(),
              curveIndex: el.token.curveIndex,
            };
          }
          return null;
        })
        .filter(Boolean),
    },
    skip:
      !poolId ||
      !slippage ||
      useCurveStore.getState().tokenInputs.every((el) => !el.token),
  });

  useEffect(() => {
    if (data && data.getCurveDepositQuote) {
      useCurveStore
        .getState()
        .setTokenLpAmount(data.getCurveDepositQuote.lpTokenAmount);
      useCurveStore
        .getState()
        .setMinLpAmount(data.getCurveDepositQuote.minAmountLp);
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchDepositCurveQuote;
