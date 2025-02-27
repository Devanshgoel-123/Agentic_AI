import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import { convertUIFormatToBigInt } from "@/utils/number";
import useCurveStore from "@/store/curve-store";
import { GET_WITHDRAW_CURVE_CONTRACT_CONFIG } from "@/components/graphql/queries/getWithdrawCurveContractConfig";

interface Props {
  contract: string;
  isBalanced: boolean;
  isDiPool: boolean;
  lpTokenDecimal: number;
}

const useFetchCurveWithdrawContractConfig = ({
  contract,
  isBalanced,
  isDiPool,
  lpTokenDecimal,
}: Props) => {
  const { loading, error, data } = useQuery(
    GET_WITHDRAW_CURVE_CONTRACT_CONFIG,
    {
      variables: {
        contract: contract,
        minTokenAmounts: isBalanced
          ? /**
             * is isBalanced send minAmountTokens which contains
             * min amounts for all the tokens in the pool.
             */
            useCurveStore
              .getState()
              .minAmountTokens.map((el) => {
                if (el.token) {
                  return {
                    amount: el.minAmount,
                    curveIndex: el.token.curveIndex,
                    tokenId: el.token.id,
                  };
                } else return null;
              })
              .filter(Boolean)
          : /**
             * else send minAmountOneToken which contains
             * min amount of selected token.
             */
            useCurveStore.getState().minAmountOneToken && [
              {
                amount: useCurveStore.getState().minAmountOneToken
                  ?.minAmount as string,
                curveIndex:
                  useCurveStore.getState().minAmountOneToken?.curveIndex,
                tokenId: useCurveStore.getState().minAmountOneToken?.token.id,
              },
            ],
        amount: convertUIFormatToBigInt(
          useCurveStore.getState().tokenLpInput,
          Number(lpTokenDecimal)
        ).toString(),
        isBalanced: isBalanced,
        isDiPool: isDiPool,
      },
      skip:
        !contract ||
        (isBalanced && useCurveStore.getState().minAmountTokens.length === 0) ||
        (!isBalanced && !useCurveStore.getState().minAmountOneToken),
    }
  );

  useEffect(() => {
    if (data && data.getCurveWithdrawContractConfig) {
      useCurveStore.getState().setWithdrawContractConfig({
        address: data.getCurveWithdrawContractConfig.address,
        abi: data.getCurveWithdrawContractConfig.abi,
        functionName: data.getCurveWithdrawContractConfig.functionName,
        args: data.getCurveWithdrawContractConfig.args,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchCurveWithdrawContractConfig;
