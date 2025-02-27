import { useQuery } from "@apollo/client";
import { GET_LPTOKEN_BALANCE } from "@/components/graphql/queries/getLpTokenBalance";
import { useEffect, useRef } from "react";

interface Props {
  walletAddress: `0x${string}` | undefined;
  lpTokenDecimal: number;
  poolId: string;
  isPolling: boolean;
  setterFunction: (val: string) => void;
  isSkip?: boolean;
}

const useFetchLpTokenBalance = ({
  poolId,
  walletAddress,
  lpTokenDecimal,
  isPolling,
  setterFunction,
  isSkip,
}: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_LPTOKEN_BALANCE, {
    variables: { slug: poolId, walletAddress: walletAddress },
    skip: !walletAddress || isSkip,
    pollInterval: isPolling ? 5000 : 0,
  });
  const setterFunctionRef = useRef<(val: string) => void>(setterFunction);
  useEffect(() => {
    if (data && data.getLpBalance) {
      setterFunctionRef.current(data.getLpBalance.lpBalance);
    }
  }, [data, setterFunctionRef]);

  return {
    data: data && data.getLpBalance ? data.getLpBalance.lpBalance : "0",
    loading,
    error,
    refetch,
  };
};

export default useFetchLpTokenBalance;
