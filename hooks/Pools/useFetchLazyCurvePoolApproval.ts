import { GET_APPROVAL_STATUS } from "@/components/graphql/queries/getApprovalStatus";
import { convertUIFormatToBigInt } from "@/utils/number";
import { useLazyQuery } from "@apollo/client";

export interface LazyApprovalProps {
  address: `0x${string}` | undefined;
  contract: string;
  amount: string;
  tokenDecimal: number;
  tokenId: number;
  curveIndex: number;
}

const useFetchLazyCurvePoolApproval = () => {
  const [getApproval] = useLazyQuery(GET_APPROVAL_STATUS);

  /**
   * Function to fetch approval for token in lazy manner.
   * @param params Approval status fetch params
   * @returns Approval status of any token
   * need lazy fetch for this.
   */
  const fetchApproval = async (params: LazyApprovalProps) => {
    const result = await getApproval({
      variables: {
        walletAddress: params.address,
        contractAddress: params.contract,
        amount: convertUIFormatToBigInt(
          params.amount,
          Number(params.tokenDecimal ?? 18)
        ).toString(),
        tokenId: Number(params.tokenId ?? 1),
      },
    });

    if (!result || !result.data) {
      return {
        loading: result.loading || false,
        error: result.error || new Error("Failed to fetch approval status"),
        approval: true,
        config: null,
        curveIndex: params.curveIndex,
      };
    }

    // Once the data is fully available, return the necessary values
    return {
      loading: result.loading,
      error: result.error,
      approval: result.data.getApprovalStatusForWallet
        ? result.data.getApprovalStatusForWallet.approvalStatus
        : true, // default to true if not available
      config: result.data.getApprovalStatusForWallet
        ? result.data.getApprovalStatusForWallet.approvalConfig
        : null, // default to null if not available
      curveIndex: params.curveIndex,
    };
  };

  return {
    fetchApproval,
  };
};

export default useFetchLazyCurvePoolApproval;
