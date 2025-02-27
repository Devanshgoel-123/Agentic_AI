import { useLazyQuery, useQuery } from "@apollo/client";

import { GET_APPROVAL_STATUS } from "@/components/graphql/queries/getApprovalStatus";
import { convertUIFormatToBigInt } from "@/utils/number";
import { PoolContractType } from "@/store/types/pool-type";

interface Props {
  address: `0x${string}` | undefined;
  contractConfig: PoolContractType;
  amount: string;
  tokenDecimal: number;
  tokenId: number;
  isSkip?: boolean;
}

const useFetchPoolApprovalStatus = ({
  contractConfig,
  amount,
  tokenDecimal,
  tokenId,
  address,
  isSkip,
}: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_APPROVAL_STATUS, {
    variables: {
      contractAddress: contractConfig?.address,
      amount: convertUIFormatToBigInt(
        amount,
        Number(tokenDecimal ?? 18)
      ).toString(),
      tokenId: Number(tokenId ?? 1),
      walletAddress: !address || typeof address === undefined ? "" : address,
    },
    skip: !contractConfig?.address || !address || !Number(amount) || isSkip,
  });

  return {
    loading: loading,
    error: error,
    approval:
      data && data.getApprovalStatusForWallet
        ? data.getApprovalStatusForWallet.approvalStatus
        : true,
    config:
      data && data.getApprovalStatusForWallet
        ? data.getApprovalStatusForWallet.approvalConfig
        : true,
    refetch,
  };
};

export default useFetchPoolApprovalStatus;
