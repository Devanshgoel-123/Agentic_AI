import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import useUniV3Store from "@/store/univ3-store";

import { GET_COLLECT_FEE_UNIV3_CONTRACT_CONFIG } from "@/components/graphql/queries/getCollectFeeContractConfig";

interface Props {
  contract: string;
  nftId: string;
  isSkip: boolean;
}

const useFetchWithdrawCollectFeeContractConfig = ({
  contract,
  nftId,
  isSkip,
}: Props) => {
  const { address } = useAccount();

  const { loading, error, data } = useQuery(
    GET_COLLECT_FEE_UNIV3_CONTRACT_CONFIG,
    {
      variables: {
        contract: contract,
        nftId: nftId,
        recipient: address,
      },
      skip: !address || isSkip,
    }
  );

  useEffect(() => {
    if (data && data.getCollectFeeContractConfigUniV3) {
      useUniV3Store.getState().setWithdrawCollectFeeContractConfig({
        address: data.getCollectFeeContractConfigUniV3.address,
        abi: data.getCollectFeeContractConfigUniV3.abi,
        functionName: data.getCollectFeeContractConfigUniV3.functionName,
        args: data.getCollectFeeContractConfigUniV3.args,
      });
    }
  }, [data]);

  return {
    loading,
    error,
  };
};

export default useFetchWithdrawCollectFeeContractConfig;
