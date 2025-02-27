import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import useCurveStore from "@/store/curve-store";
import useFetchLazyCurvePoolApproval, {
  LazyApprovalProps,
} from "./useFetchLazyCurvePoolApproval";
import { ApolloError } from "@apollo/client";

interface Props {
  contract: string;
}

const useFetchCurvePoolApproval = ({ contract }: Props) => {
  const { address } = useAccount();
  const { fetchApproval } = useFetchLazyCurvePoolApproval();
  const tokenInputs = useCurveStore.getState().tokenInputs;

  // State to store the resolved approval statuses
  const [approvalStatuses, setApprovalStatuses] = useState<
    ({
      loading: boolean;
      error: ApolloError | undefined | Error;
      approval: any;
      config: any;
      curveIndex: number;
    } | null)[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovalRef = useRef<
    (params: LazyApprovalProps) => Promise<
      | {
          loading: boolean;
          error: ApolloError | undefined;
          approval: any;
          config: any;
          curveIndex: number;
        }
      | {
          loading: boolean;
          error: Error;
          approval: boolean;
          config: null;
          curveIndex: number;
        }
    >
  >(fetchApproval);

  const setApprovalStatusesAfterCallBack = (
    param: ({
      loading: boolean;
      error: ApolloError | Error | undefined;
      approval: any;
      config: any;
      curveIndex: number;
    } | null)[]
  ) => {
    const filteredStatuses = param.filter(Boolean);
    setApprovalStatuses(filteredStatuses);
    setLoading(filteredStatuses.some((status) => status?.loading));
  };

  const fetchApprovalStatuses = () => {
    setLoading(true);

    return Promise.all(
      tokenInputs.map(async (item) => {
        const isInValid = !item.token;

        if (Number(item.amount) === 0 || isInValid) {
          return null;
        }
        const { loading, error, approval, config, curveIndex } =
          await fetchApprovalRef.current({
            address: address,
            tokenId: item.token?.id as number,
            tokenDecimal: item.token?.decimal as number,
            amount: item.amount,
            contract: contract,
            curveIndex: item.token?.curveIndex as number,
          });
        return { loading, error, approval, config, curveIndex };
      })
    );
  };

  useEffect(() => {
    /**
     * Fetch approval for token in curve in incremental manner.
     * store the approval status as per curve index.
     * no need to fetch approval is amount entered is 0
     * or no token exist for the index.
     */
    const fetchApprovalStatuses = async () => {
      setLoading(true);

      const statuses = await Promise.all(
        tokenInputs.map(async (item) => {
          const isInValid = !item.token;

          if (Number(item.amount) === 0 || isInValid) {
            return null;
          }
          const { loading, error, approval, config, curveIndex } =
            await fetchApprovalRef.current({
              address: address,
              tokenId: item.token?.id as number,
              tokenDecimal: item.token?.decimal as number,
              amount: item.amount,
              contract: contract,
              curveIndex: item.token?.curveIndex as number,
            });

          return { loading, error, approval, config, curveIndex };
        })
      );
      const filteredStatuses = statuses.filter(Boolean);
      setApprovalStatuses(filteredStatuses);
      setLoading(filteredStatuses.some((status) => status?.loading));
    };

    fetchApprovalStatuses();
  }, [address, tokenInputs, contract, fetchApprovalRef]);

  return {
    approvalStatuses,
    loading,
    fetchApprovalStatuses,
    setApprovalStatusesAfterCallBack,
  };
};

export default useFetchCurvePoolApproval;
