import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";
import useUniV3Store from "@/store/univ3-store";

import { convertUIFormatToBigInt } from "@/utils/number";
import { GET_DEPOSIT_UNIV3_CONTRACT_CONFIG } from "@/components/graphql/queries/getDepositContractConfigUniv3";
import { Token } from "@/store/types/token-type";

interface Props {
  token0: Token;
  token1: Token;
  contract: string;
  fee: string;
}

const useFetchUniV3DepositContractConfig = ({
  token0,
  token1,
  contract,
  fee,
}: Props) => {
  const { address } = useAccount();

  const {
    token0Amount,
    token1Amount,
    minAmountToken0,
    minAmountToken1,
    minTick,
    maxTick,
  } = useUniV3Store(
    useShallow((state) => ({
      token0Amount: state.token0Amount,
      token1Amount: state.token1Amount,
      minAmountToken0: state.minAmountToken0,
      minAmountToken1: state.minAmountToken1,
      minTick: state.minTick,
      maxTick: state.maxTick,
    }))
  );

  const { loading, error, data } = useQuery(GET_DEPOSIT_UNIV3_CONTRACT_CONFIG, {
    variables: {
      contract: contract,
      isToken0Native: token0.isNative,
      isToken1Native: token1.isNative,
      token0: token0.isNative ? token0.zrc20Address : token0.address,
      token1: token1.isNative ? token1.zrc20Address : token1.address,
      tickLower: minTick.toString(),
      tickUpper: maxTick.toString(),
      fee: fee,
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
      recipient: address,
    },
  });

  useEffect(() => {
    if (data && data.getDepositContractConfigUniV3) {
      useUniV3Store.getState().setDepositContractConfig({
        address: data.getDepositContractConfigUniV3.address,
        abi: data.getDepositContractConfigUniV3.abi,
        functionName: data.getDepositContractConfigUniV3.functionName,
        args: data.getDepositContractConfigUniV3.args,
        value: data.getDepositContractConfigUniV3.value,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchUniV3DepositContractConfig;
