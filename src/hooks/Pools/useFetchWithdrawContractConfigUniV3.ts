import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";
import useUniV3Store from "@/store/univ3-store";

import { GET_WITHDRAW_UNIV3_CONTRACT_CONFIG } from "@/components/graphql/queries/getUniV3WithdrawContractConfig";

interface Props {
  contract: string;
  nftId: string;
}

const useFetchWithdrawContractConfigUniV3 = ({ contract, nftId }: Props) => {
  const { address } = useAccount();

  const { minAmountToken0, minAmountToken1, liquidity } = useUniV3Store(
    useShallow((state) => ({
      minAmountToken0: state.minWithdrawAmountToken0,
      minAmountToken1: state.minWithdrawAmountToken1,
      liquidity: state.withdrawLiquidity,
    }))
  );

  const { loading, error, data } = useQuery(
    GET_WITHDRAW_UNIV3_CONTRACT_CONFIG,
    {
      variables: {
        contract: contract,
        nftId: nftId,
        liquidity: liquidity,
        amount0Min: minAmountToken0,
        amount1Min: minAmountToken1,
        recipient: address,
      },
      skip: !address,
    }
  );

  useEffect(() => {
    if (data && data.getWithdrawContractConfigUniV3) {
      useUniV3Store.getState().setWithdrawContractConfig({
        address: data.getWithdrawContractConfigUniV3.address,
        abi: data.getWithdrawContractConfigUniV3.abi,
        functionName: data.getWithdrawContractConfigUniV3.functionName,
        args: data.getWithdrawContractConfigUniV3.args,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchWithdrawContractConfigUniV3;
