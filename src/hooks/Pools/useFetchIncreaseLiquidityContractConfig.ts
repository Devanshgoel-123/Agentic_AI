import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useUniV3Store from "@/store/univ3-store";

import { convertUIFormatToBigInt } from "@/utils/number";
import { Token } from "@/store/types/token-type";
import { GET_INCREASE_LIQUIDITY_UNIV3_CONTRACT_CONFIG } from "@/components/graphql/queries/getUniV3IncreaseLiquidityContractConfig";

interface Props {
  token0: Token;
  token1: Token;
  nftId: string;
  contract: string;
  isSkip: boolean;
}

const useFetchIncreaseLiquidityContractConfig = ({
  token0,
  token1,
  nftId,
  contract,
  isSkip,
}: Props) => {
  const { token0Amount, token1Amount, minAmountToken0, minAmountToken1 } =
    useUniV3Store(
      useShallow((state) => ({
        token0Amount: state.token0Amount,
        token1Amount: state.token1Amount,
        minAmountToken0: state.minAmountToken0,
        minAmountToken1: state.minAmountToken1,
      }))
    );

  const { loading, error, data } = useQuery(
    GET_INCREASE_LIQUIDITY_UNIV3_CONTRACT_CONFIG,
    {
      variables: {
        contract: contract,
        nftId: nftId,
        amount0Desired: convertUIFormatToBigInt(
          token0Amount,
          Number(token0.decimal ?? 18)
        ).toString(),
        amount1Desired: convertUIFormatToBigInt(
          token1Amount,
          Number(token1.decimal ?? 18)
        ).toString(),
        amount0Min: minAmountToken0,
        amount1Min: minAmountToken1,
      },
      skip: isSkip,
    }
  );

  useEffect(() => {
    if (data && data.getIncreaseLiquidityContractConfigUniV3) {
      useUniV3Store.getState().setIncreaseLiquidityContractConfig({
        address: data.getIncreaseLiquidityContractConfigUniV3.address,
        abi: data.getIncreaseLiquidityContractConfigUniV3.abi,
        functionName: data.getIncreaseLiquidityContractConfigUniV3.functionName,
        args: data.getIncreaseLiquidityContractConfigUniV3.args,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchIncreaseLiquidityContractConfig;
