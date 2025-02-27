import { useQuery } from "@apollo/client";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";

import { GET_THORSWAP_QUOTE } from "@/components/graphql/queries/getThorswapFee";

const useFetchThorswapQuote = () => {
  const { payToken, getToken } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
    }))
  );
  const { loading, error, data } = useQuery(GET_THORSWAP_QUOTE, {
    variables: {
      fromTokenId: Number(payToken?.id),
      toTokenId: Number(getToken?.id),
      amount: 1,
    },
    skip: !payToken || !getToken,
  });

  return {
    loading,
    error,
    data: {
      bridgeFee:
        data && data.getNetworkFeeThorSwap
          ? data.getNetworkFeeThorSwap.thorSwapFee
          : "0",
      estimatedTime:
        data && data.getNetworkFeeThorSwap
          ? data.getNetworkFeeThorSwap.estimatedTime
          : "0",
    },
  };
};

export default useFetchThorswapQuote;
