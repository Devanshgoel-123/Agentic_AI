import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect, useMemo, useRef, useState } from "react";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import useFetchApprovalStatus from "./useFetchApprovalStatus";
import useHandleToast from "../common/useHandleToast";
import mixpanel from "mixpanel-browser";

import {
  APPROVAL_PENDING,
  TRANSACTION_FAILED,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";

interface Props {
  callBackFunction: () => void;
}

const useSendApprovalTransaction = ({ callBackFunction }: Props) => {
  /**
   * !Important
   * Keep all the wagmi queries in disabled state
   * at first. Wagmi state will be enable only when
   * enableQuery -> true.
   * Once transaction is executed it is very important to disable it again
   * to prevent wagmi running in the background.
   */
  const [enableQuery, setEnableQuery] = useState(false);
  const { loading, error, approval, config, refetch } =
    useFetchApprovalStatus();
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

  const {
    payToken,
    getToken,
  } = useTransferStore(
    useShallow((state) => ({ 
      payToken: state.payToken,
      getToken: state.getToken,
    }))
  );

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
    };
  }, [hash, isConfirming, isSuccess, contractError, isError]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        APPROVAL_PENDING.heading,
        APPROVAL_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        useTransferStore.getState().payChain
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        useTransferStore.getState().payChain
      );
      setTimeout(() => {
        /**
         * Disable wagmi state when transaction is completed.
         */
        setEnableQuery(false);
        callBackFunctionRef.current();
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
          useTransferStore.getState().payChain
        );
      }
    }
  }, [transactionStatusObject, callBackFunctionRef, handleToastRef]);

  const sendApprovalTransaction = () => {
    try {
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract({
        address: config.address,
        abi: config.abi,
        functionName: config.functionName,
        args: config.args,
      });
      mixpanel.track("widget_swap_button_click",{
        traxnType:"Approve",
        from:`${payToken?.name}`,
        to:`${getToken?.name}`
      })
    } catch (error) {
      console.log(error, contractError);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      throw new Error(`Error in writing contract interactions: ${error}`)
    }
  };

  return {
    approval,
    sendApprovalTransaction,
    loading: loading || isPending || isConfirming,
    refetch,
  };
};

export default useSendApprovalTransaction;
