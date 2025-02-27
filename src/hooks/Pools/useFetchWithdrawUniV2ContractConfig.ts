import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import useUniV2Store from "@/store/univ2-store";

import { convertUIFormatToBigInt } from "@/utils/number";
import { GET_WITHDRAW_CONTRACT_CONFIG } from "@/components/graphql/queries/getWithdrawUniV2ContractConfig";

interface Props {
  lpTokenDecimal: number;
}

const useFetchWithdrawUniV2ContractConfig = ({ lpTokenDecimal }: Props) => {
  const { loading, error, data } = useQuery(GET_WITHDRAW_CONTRACT_CONFIG, {
    variables: {
      tokenAId: useUniV2Store.getState().minAmountTokenAObject.token?.id,
      tokenBId: useUniV2Store.getState().minAmountTokenBObject.token?.id,
      tokenLPAmount: convertUIFormatToBigInt(
        useUniV2Store.getState().tokenLpInput,
        Number(lpTokenDecimal)
      ).toString(),
      minAmountTokenA: useUniV2Store.getState().minAmountTokenAObject.amount,
      minAmountTokenB: useUniV2Store.getState().minAmountTokenBObject.amount,
    },
    skip:
      Number(useUniV2Store.getState().tokenLpInput) === 0 ||
      !useUniV2Store.getState().minAmountTokenAObject ||
      !useUniV2Store.getState().minAmountTokenBObject ||
      Number(useUniV2Store.getState().minAmountTokenAObject.amount) === 0 ||
      Number(useUniV2Store.getState().minAmountTokenBObject.amount) === 0,
  });

  useEffect(() => {
    if (data && data.getWidthUniV2ContractConfig) {
      useUniV2Store.getState().setWithdrawContractConfig({
        address: data.getWidthUniV2ContractConfig.address,
        abi: data.getWidthUniV2ContractConfig.abi,
        functionName: data.getWidthUniV2ContractConfig.functionName,
        args: data.getWidthUniV2ContractConfig.args,
        value: data.getWidthUniV2ContractConfig.value,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchWithdrawUniV2ContractConfig;
