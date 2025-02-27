import { useQuery } from "@apollo/client";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";

import { GET_CHAIN_FLIP_QUOTE } from "@/components/graphql/queries/getChainFlipFee";
import { convertUIFormatToBigInt } from "@/utils/number";

const useFetchChainFlipQuote = () => {
  const { payToken, getToken } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
    }))
  );
  const { loading, error, data } = useQuery(GET_CHAIN_FLIP_QUOTE, {
    variables: {
      fromTokenId: Number(payToken?.id),
      toTokenId: Number(getToken?.id),
      amount: convertUIFormatToBigInt(
        "1",
        Number(payToken?.decimal ?? 18)
      ).toString(),
    },
    skip: !payToken || !getToken,
  });

  return {
    loading,
    error,
    data: {
      bridgeFee:
        data && data.getNetworkFeeChainFlip
          ? data.getNetworkFeeChainFlip.chainFlipFee
          : "0",
      estimatedTime:
        data && data.getNetworkFeeChainFlip
          ? data.getNetworkFeeChainFlip.estimatedTime
          : "0",
    },
  };
};

export default useFetchChainFlipQuote;
