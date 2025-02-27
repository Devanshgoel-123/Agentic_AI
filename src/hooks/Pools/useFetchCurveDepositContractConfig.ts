import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import { GET_DEPOSIT_CURVE_CONTRACT_CONFIG } from "@/components/graphql/queries/getDepositCurveContractConfig";
import { convertUIFormatToBigInt } from "@/utils/number";
import useCurveStore from "@/store/curve-store";

interface Props {
  contract: string;
}

const useFetchCurveDepositContractConfig = ({ contract }: Props) => {
  const { loading, error, data } = useQuery(GET_DEPOSIT_CURVE_CONTRACT_CONFIG, {
    variables: {
      contract: contract,
      tokenAmounts: useCurveStore
        .getState()
        .tokenInputs.map((el) => {
          if (el.token) {
            return {
              amount: convertUIFormatToBigInt(
                el.amount,
                Number(el.token.decimal)
              ).toString(),
              curveIndex: el.token.curveIndex,
              tokenId: el.token.id,
            };
          } else return null;
        })
        .filter(Boolean),
      minLpAmount: useCurveStore.getState().minLpAmount,
    },
    skip:
      !contract ||
      useCurveStore
        .getState()
        .tokenInputs.every((el) => Number(el.amount) === 0 && !el.token) ||
      Number(useCurveStore.getState().minLpAmount) === 0,
  });

  useEffect(() => {
    if (data && data.getCurveDepositContractConfig) {
      useCurveStore.getState().setDepositContractConfig({
        address: data.getCurveDepositContractConfig.address,
        abi: data.getCurveDepositContractConfig.abi,
        functionName: data.getCurveDepositContractConfig.functionName,
        args: data.getCurveDepositContractConfig.args,
        value: data.getCurveDepositContractConfig.value,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchCurveDepositContractConfig;
