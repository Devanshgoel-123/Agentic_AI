import { useQuery } from "@apollo/client";
import { convertUIFormatToBigInt } from "@/utils/number";
import { PoolContractType } from "@/store/types/pool-type";
import { GET_LPTOKEN_APPROVAL_STATUS } from "@/components/graphql/queries/getLpTokenApprovalStatus";

interface Props {
  address: `0x${string}` | undefined;
  contractConfig: PoolContractType;
  amount: string;
  lpTokenDecimal: number;
  lpTokenAddress: string;
  poolChainId: number;
}

const useFetchLpTokenApprovalStatus = ({
  contractConfig,
  amount,
  lpTokenAddress,
  lpTokenDecimal,
  address,
  poolChainId,
}: Props) => {
  const { loading, error, data, refetch } = useQuery(
    GET_LPTOKEN_APPROVAL_STATUS,
    {
      variables: {
        contractAddress: contractConfig?.address,
        amount: convertUIFormatToBigInt(
          amount,
          Number(lpTokenDecimal ?? 18)
        ).toString(),
        lpTokenAddress: lpTokenAddress,
        walletAddress: !address || typeof address === undefined ? "" : address,
        poolChainId: poolChainId,
      },
      skip: !contractConfig?.address || !address || !Number(amount),
    }
  );

  return {
    loading,
    error,
    approval:
      data && data.getLpTokenApprovalStatus
        ? data.getLpTokenApprovalStatus.approvalStatus
        : true,
    config:
      data && data.getLpTokenApprovalStatus
        ? data.getLpTokenApprovalStatus.approvalConfig
        : true,
    refetch,
  };
};

export default useFetchLpTokenApprovalStatus;
