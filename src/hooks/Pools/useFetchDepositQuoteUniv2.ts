import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import useUniV2Store from "@/store/univ2-store";
import { GET_DEPOSIT_UNIV2_QUOTE } from "@/components/graphql/queries/getDepositUniV2Quote";

interface Props {
  slug: string;
  tokenId: number;
  slippage: number;
  amount: string;
  setterFunction: (val: string) => void;
  isSkip?: boolean;
}

const useFetchDepositQuoteUniv2 = ({
  slug,
  tokenId,
  slippage,
  amount,
  setterFunction,
  isSkip,
}: Props) => {
  const { loading, error, data } = useQuery(GET_DEPOSIT_UNIV2_QUOTE, {
    variables: { slug: slug, tokenId: tokenId, slippage: slippage, amount },
    skip: !amount || Number(amount) === 0 || !tokenId || isSkip,
  });

  const setterFunctionRef = useRef<(val: string) => void>(setterFunction);

  useEffect(() => {
    if (data && data.getDepositQuote) {
      useUniV2Store.getState().setMinAmountLp(data.getDepositQuote.minAmountLp);
      useUniV2Store
        .getState()
        .setLpTokenAmount(data.getDepositQuote.lpTokenAmount);
      useUniV2Store
        .getState()
        .setMinAmountTokenA(data.getDepositQuote.minAmountToken1);
      useUniV2Store
        .getState()
        .setMinAmountTokenB(data.getDepositQuote.minAmountToken2);
      setterFunctionRef.current(data.getDepositQuote.tokenAmount);
    }
  }, [data, setterFunctionRef]);

  return {
    loading,
    error,
  };
};

export default useFetchDepositQuoteUniv2;
