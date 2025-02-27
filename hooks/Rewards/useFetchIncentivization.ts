import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { GET_INCENTIVIZATION_DATA } from "@/components/graphql/queries/getIncentivizationData";
import { PoolContractType } from "@/store/types/pool-type";

interface Props {
  weekId: number;
}

export interface ValueType {
  address: string;
  index: number;
  value: string;
}

const useFetchIncentivization = ({ weekId }: Props) => {
  const { address } = useAccount();

  const { loading, error, data, refetch } = useQuery(GET_INCENTIVIZATION_DATA, {
    variables: {
      address: address,
      week: weekId,
    },
    skip: !address,
  });

  return {
    loading,
    error,
    value:
      data && data.getProofForAddress && data.getProofForAddress.value
        ? ({
            address: data.getProofForAddress.value[0],
            index: data.getProofForAddress.value[1],
            value: data.getProofForAddress.value[2],
          } as ValueType)
        : null,
    proofs:
      data && data.getProofForAddress && data.getProofForAddress.proof
        ? data.getProofForAddress.proof
        : null,
    contractConfig:
      data && data.getProofForAddress
        ? (data.getProofForAddress.contractConfig as PoolContractType)
        : undefined,
    refetch,
  };
};

export default useFetchIncentivization;
