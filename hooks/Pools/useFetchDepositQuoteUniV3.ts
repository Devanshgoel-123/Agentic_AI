import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import useUniV3Store from "@/store/univ3-store";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";

import { GET_DEPOSIT_UNIV3_QUOTE } from "@/components/graphql/queries/getDepositUniV3Quote";

interface Props {
  slug: string;
  tokenId: number;
  slippage: number;
  amount: string;
  setterFunction: (val: string) => void;
  isSkip?: boolean;
}

const useFetchDepositQuoteUniV3 = ({
  slug,
  tokenId,
  slippage,
  amount,
  setterFunction,
  isSkip,
}: Props) => {
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const { loading, error, data } = useQuery(GET_DEPOSIT_UNIV3_QUOTE, {
    variables: {
      slug: slug,
      tokenId: tokenId,
      slippage: slippage,
      amountToDeposit: amount,
      recipient: address,
      tickLower: Boolean(searchParams.get("current"))
        ? Number(searchParams.get("tickLower"))
        : useUniV3Store.getState().minTick,
      tickUpper: Boolean(searchParams.get("current"))
        ? Number(searchParams.get("tickUpper"))
        : useUniV3Store.getState().maxTick,
      currentTick: useUniV3Store.getState().currentTick,
    },
    skip: !amount || Number(amount) === 0 || !tokenId || isSkip,
  });

  const setterFunctionRef = useRef<(val: string) => void>(setterFunction);

  useEffect(() => {
    if (data && data.getDepositQuoteUniv3) {
      useUniV3Store
        .getState()
        .setMinAmountToken0(data.getDepositQuoteUniv3.minAmountToken0);
      useUniV3Store
        .getState()
        .setMinAmountToken1(data.getDepositQuoteUniv3.minAmountToken1);
      setterFunctionRef.current(data.getDepositQuoteUniv3.otherTokenAmount);
    }
  }, [data, setterFunctionRef]);

  return {
    loading,
    error,
  };
};

export default useFetchDepositQuoteUniV3;
