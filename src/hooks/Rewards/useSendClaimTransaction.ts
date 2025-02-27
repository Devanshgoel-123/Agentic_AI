import { useEffect, useMemo, useRef, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import useHandleToast from "../common/useHandleToast";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { PoolContractType } from "@/store/types/pool-type";

interface Props {
  contract: PoolContractType | undefined;
  chainId: number;
}

const useSendClaimTransaction = ({ contract, chainId }: Props) => {
  /**
   * !Important
   * Keep all the wagmi queries in disabled state
   * at first. Wagmi state will be enable only when
   * enableQuery -> true.
   * Once transaction is executed it is very important to disable it again
   * to prevent wagmi running in the background.
   */
  const [enableQuery, setEnableQuery] = useState(false);
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
    query: {
      enabled: enableQuery,
      retry: false,
    },
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
    };
  }, [hash, isConfirming, isSuccess, contractError, isError]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        chainId
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        chainId
      );
      setTimeout(() => {
        /**
         * Disable wagmi state when transaction is completed.
         */
        setEnableQuery(false);
      }, 200);
    }
    if (
      transactionStatusObject.contractError ||
      transactionStatusObject.isError
    ) {
      setEnableQuery(false);
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
          chainId
        );
      }
    }
  }, [transactionStatusObject, handleToastRef]);

  const sendClaimTransaction = () => {
    try {
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract({
        address: contract?.address as `0x${string}`,
        abi: contract?.abi,
        functionName: contract?.functionName,
        args: contract?.args,
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
    sendClaimTransaction,
    loading: isPending || isConfirming,
  };
};

export default useSendClaimTransaction;
