import { useState, useRef, useEffect, useMemo } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import useHandleToast from "../common/useHandleToast";
import { PoolContractType } from "@/store/types/pool-type";
import { TokenInputObject } from "@/store/curve-store";
import { ApolloError } from "@apollo/client";
import {
  APPROVAL_PENDING,
  TRANSACTION_FAILED,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";

export interface ApprovalStatus {
  approval: boolean;
  config: PoolContractType;
  amount: string;
  chainId: number;
  curveIndex: number;
}

interface UseMultipleApprovalsProps {
  approvalStatuses: ({
    loading: boolean;
    error: ApolloError | undefined | Error;
    approval: any;
    config: any;
    curveIndex: number;
  } | null)[];
  tokenDetails: TokenInputObject[];
  address: `0x${string}` | undefined;
  poolChainId: number;
  finalCallback: () => void;
}

const useSendCurvePoolApproval = ({
  approvalStatuses,
  tokenDetails,
  address,
  poolChainId,
  finalCallback,
}: UseMultipleApprovalsProps) => {
  const contractConfigs = approvalStatuses
    .map((el) => {
      if (
        !el?.approval &&
        el?.config &&
        Number(tokenDetails[el.curveIndex].amount) !== 0
      ) {
        return el.config;
      }
    })
    .filter(Boolean) as PoolContractType[];
  const [index, setIndex] = useState(0);
  const { handleToast } = useHandleToast();
  const {
    data: hash,
    error: contractError,
    isPending,
    writeContract,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleToastRef =
    useRef<
      (
        heading: string,
        subHeading: string,
        type: string,
        hash?: string | undefined,
        chainId?: number | undefined
      ) => void
    >(handleToast);

  const transactionStatusObject = useMemo(() => {
    return {
      hash,
      isConfirming,
      isSuccess,
      contractError,
      isError,
      poolChainId,
    };
  }, [hash, isConfirming, isSuccess, contractError, isError, poolChainId]);

  /**
   * If any approval is false send transaction for next index.
   * @param index
   */
  const handleSendNextTransaction = (index: number) => {
    writeContract({
      address: contractConfigs[index].address as `0x${string}`,
      abi: contractConfigs[index].abi,
      functionName: contractConfigs[index].functionName,
      args: contractConfigs[index].args,
    });
  };

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        APPROVAL_PENDING.heading,
        APPROVAL_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        transactionStatusObject.poolChainId
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        transactionStatusObject.poolChainId
      );
      const nextIndex = index + 1;
      if (nextIndex < contractConfigs.length) {
        setIndex(nextIndex);
        setTimeout(() => {
          handleSendNextTransaction(nextIndex);
        }, 200);
      } else {
        finalCallback();
      }
    }
    if (
      transactionStatusObject.contractError ||
      transactionStatusObject.isError
    ) {
      if (
        transactionStatusObject.contractError?.message.includes(
          "User rejected the request."
        )
      ) {
        handleToastRef.current(
          TRANSACTION_REJECTED.heading,
          TRANSACTION_REJECTED.subHeading,
          TOAST_TYPE.ERROR
        );
      } else {
        handleToastRef.current(
          TRANSACTION_FAILED.heading,
          TRANSACTION_FAILED.subHeading,
          TOAST_TYPE.ERROR,
          transactionStatusObject.hash,
          transactionStatusObject.poolChainId
        );
      }
    }
  }, [transactionStatusObject, handleToastRef]);

  const startApprovals = () => {
    if (contractConfigs.length === 0) {
      return;
    }
    try {
      writeContract({
        address: contractConfigs[0].address as `0x${string}`,
        abi: contractConfigs[0].abi,
        functionName: contractConfigs[0].functionName,
        args: contractConfigs[0].args,
      });
    } catch (error) {
      console.log(error, contractError);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
    }
  };
  return {
    startApprovals,
    loading: isPending || isConfirming,
  };
};

export default useSendCurvePoolApproval;
