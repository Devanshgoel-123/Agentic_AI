import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import useUniV2Store from "@/store/univ2-store";
import { useShallow } from "zustand/react/shallow";

import { GET_DEPOSIT_CONTRACT_CONFIG } from "@/components/graphql/queries/getDepositContractConfig";
import { convertUIFormatToBigInt } from "@/utils/number";

const useFetchDepositContractConfig = () => {
  const {
    tokenABalanceObject,
    tokenBBalanceObject,
    tokenAAmount,
    tokenBAmount,
    minAmountTokenA,
    minAmountTokenB,
  } = useUniV2Store(
    useShallow((state) => ({
      tokenABalanceObject: state.tokenABalanceObject,
      tokenBBalanceObject: state.tokenBBalanceObject,
      tokenAAmount: state.tokenAAmount,
      tokenBAmount: state.tokenBAmount,
      minAmountTokenA: state.minAmountTokenA,
      minAmountTokenB: state.minAmountTokenB,
    }))
  );

  const { loading, error, data } = useQuery(GET_DEPOSIT_CONTRACT_CONFIG, {
    variables: {
      tokenAId: tokenABalanceObject.token?.id,
      tokenBId: tokenBBalanceObject.token?.id,
      tokenAAmount: convertUIFormatToBigInt(
        tokenAAmount,
        Number(tokenABalanceObject.token?.decimal ?? 18)
      ).toString(),
      tokenBAmount: convertUIFormatToBigInt(
        tokenBAmount,
        Number(tokenBBalanceObject.token?.decimal ?? 18)
      ).toString(),
      minAmountTokenA: minAmountTokenA,
      minAmountTokenB: minAmountTokenB,
    },
    skip:
      Number(tokenAAmount) === 0 ||
      Number(tokenBAmount) === 0 ||
      Number(minAmountTokenA) === 0 ||
      Number(minAmountTokenB) === 0,
  });

  useEffect(() => {
    if (data && data.getDepositUniV2ContractConfig) {
      useUniV2Store.getState().setDepositContractConfig({
        address: data.getDepositUniV2ContractConfig.address,
        abi: data.getDepositUniV2ContractConfig.abi,
        functionName: data.getDepositUniV2ContractConfig.functionName,
        args: data.getDepositUniV2ContractConfig.args,
        value: data.getDepositUniV2ContractConfig.value,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchDepositContractConfig;
