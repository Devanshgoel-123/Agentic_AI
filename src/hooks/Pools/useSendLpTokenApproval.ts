import { useEffect, useMemo, useRef, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import useFetchLpTokenApprovalStatus from "./useFetchLpTokenApprovalStatus";
import useHandleToast from "../common/useHandleToast";

import {
  APPROVAL_PENDING,
  TRANSACTION_FAILED,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { PoolContractType } from "@/store/types/pool-type";

interface Props {
  contractConfig: PoolContractType;
  amount: string;
  lpTokenAddress: string;
  lpTokenDecimal: number;
  chainId: number;
  address: `0x${string}` | undefined;
  callBackFunction: () => void;
}

const useSendLpTokenApproval = ({
  address,
  amount,
  contractConfig,
  lpTokenAddress,
  lpTokenDecimal,
  chainId,
  callBackFunction,
}: Props) => {
  /**
   * !Important
   * Keep all the wagmi queries in disabled state
   * at first. Wagmi state will be enable only when
   * enableQuery -> true.
   * Once transaction is executed it is very important to disable it again
   * to prevent wagmi running in the background.
   */
  const [enableQuery, setEnableQuery] = useState(false);
  const {
    loading,
    error,
    approval: approval,
    config,
    refetch,
  } = useFetchLpTokenApprovalStatus({
    address: address,
    amount: amount,
    contractConfig: contractConfig,
    lpTokenDecimal: lpTokenDecimal,
    lpTokenAddress: lpTokenAddress,
    poolChainId: chainId,
  });

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

  const callBackFunctionRef = useRef<() => void>(callBackFunction);
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
      chainId,
    };
  }, [hash, isConfirming, isSuccess, contractError, isError, chainId]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        APPROVAL_PENDING.heading,
        APPROVAL_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        transactionStatusObject.chainId
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        transactionStatusObject.chainId
      );
      /**
       * Disable wagmi state when transaction is completed.
       */
      setEnableQuery(() => false);
      setTimeout(() => {
        callBackFunctionRef.current();
      }, 200);
    }
    if (
      transactionStatusObject.contractError ||
      transactionStatusObject.isError
    ) {
      setEnableQuery(() => false);
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
          transactionStatusObject.chainId
        );
      }
    }
  }, [transactionStatusObject, callBackFunctionRef, handleToastRef]);

  const sendApprovalTransaction = () => {
    if (!config) return;
    /**
     * Enable wagmi state before transaction.
     */
    setEnableQuery(() => true);
    try {
      writeContract({
        address: config.address,
        abi: config.abi,
        functionName: config.functionName,
        args: config.args,
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
    approval,
    sendApprovalTransaction,
    loading: loading || isPending || isConfirming,
    refetch,
  };
};

export default useSendLpTokenApproval;
