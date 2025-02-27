import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useTransferStore from "@/store/transfer-store";

import { GET_APPROVAL_STATUS } from "@/components/graphql/queries/getApprovalStatus";
import { convertUIFormatToBigInt } from "@/utils/number";

const useFetchApprovalStatus = () => {
  const { address } = useAccount();

  const { tokenInAmount, payToken, contractConfig } = useTransferStore(
    useShallow((state) => ({
      tokenInAmount: state.tokenInAmount,
      payToken: state.payToken,
      contractConfig: state.contractConfig,
    }))
  );

  const { loading, error, data, refetch } = useQuery(GET_APPROVAL_STATUS, {
    variables: {
      contractAddress: contractConfig?.address,
      amount: convertUIFormatToBigInt(
        tokenInAmount,
        Number(payToken?.decimal ?? 18)
      ).toString(),
      tokenId: Number(payToken?.id ?? 1),
      fetchPolicy: "no-cache",
      walletAddress: !address || typeof address === undefined ? "" : address,
    },
    skip:
      !contractConfig?.address ||
      !address ||
      !payToken ||
      !Number(tokenInAmount),
  });

  return {
    loading,
    error,
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

export default useFetchApprovalStatus;
