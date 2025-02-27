import { useAccount } from "wagmi";
import { useFetchLazyPermitApprovalForToken } from "./useLazyFetchPermitAllowance";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { ApolloError } from "@apollo/client";
import { useShallow } from "zustand/react/shallow";
export const useFetchPermitApproval = () => {
  const { address } = useAccount();
  const { fetchApproval} = useFetchLazyPermitApprovalForToken();
  const { tokenSwapForPermit } = useDustAggregatorStore(
    useShallow((state) => ({
      tokenSwapForPermit: state.tokenSwapForPermit,
    }))
  );
  const [approvalStatuses, setApprovalStatuses] = useState<
    (
      | {
          loading: boolean;
          error: ApolloError | Error | undefined;
          approval: boolean;
          config: any;
          tokenAddress: string;
        }
      | null
    )[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchApprovalStatuses = async () => {
    if (!tokenSwapForPermit.length) {
      return;
    }
    const arrayTipo = await Promise.all(
      tokenSwapForPermit.map(async (item) => {
        const isInValid = !item.token;
        if (Number(item.amount) === 0 || isInValid) {
          return null;
        }
        
        const { loading, error, approval, config, tokenAddress } =
          await fetchApproval({
            token: item.token,
            amount: item.amount,
            poolFeeTier:item.poolFeeTier,
            usdValue:item.usdValue
          });
  
        return { loading, error, approval, config, tokenAddress };
      })
    );
    const filteredStatuses = arrayTipo.filter(Boolean);
    useDustAggregatorStore.getState().setApprovalStatus(filteredStatuses.filter((item)=>item?.approval===false));
    useDustAggregatorStore.getState().setInitialApprovalLength(filteredStatuses.filter((item)=>item?.approval===false).length);
    // setApprovalStatuses(filteredStatuses);
    setLoading(filteredStatuses.some((status) => status?.loading));  
  }; 
  
  useEffect(() => {
    if (!tokenSwapForPermit.length) {
      return;
    }
    fetchApprovalStatuses();
  }, [address, tokenSwapForPermit]);
  return {
    // approvalStatuses,
    loading,
    fetchApprovalStatuses,
  };
};
