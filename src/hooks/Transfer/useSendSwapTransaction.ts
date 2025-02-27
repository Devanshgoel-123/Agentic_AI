import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import useTransferStore from "@/store/transfer-store";
import useHandleToast from "../common/useHandleToast";
import useSaveTransferTransaction from "./useSaveTransferTransaction";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAgentStore } from "@/store/agent-store";
import { estimateGas } from "@wagmi/core";
import { Abi, encodeFunctionData } from "viem";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";
import { config } from "@/config";
import mixpanel from "mixpanel-browser";

interface Props {
  callBackFn: () => void;
}
const useSendSwapTransaction = ({ callBackFn }: Props) => {
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
  const { handleSubmitTransaction } = useSaveTransferTransaction();
  const { address } = useAccount();

  const { payToken, getToken } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      getToken: state.getToken,
      contractConfig: state.contractConfig,
    }))
  );
  const {
    activeChat,
    activeResponse
  }=useAgentStore(useShallow((state)=>({
    activeChat:state.activeChat,
    activeResponse:state.activeResponse
  })))
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
    },
  });

  const callBackFunctionRef = useRef<() => void>(callBackFn);
  const handleSubmitTransactionRef = useRef<
    (hash: string, address: string) => Promise<void>
  >(handleSubmitTransaction);
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

  const payTokenRef = useRef(payToken);

  useEffect(() => {
    payTokenRef.current = payToken;
  }, [payToken]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        Number(useTransferStore.getState().payChain)
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleSubmitTransactionRef.current(
        transactionStatusObject.hash as string,
        address as string
      );
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash: transactionStatusObject.hash || "" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
    })
    useAgentStore.setState({
      sendingTransaction:false
    })
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        Number(useTransferStore.getState().payChain)
      );

      /**
       * Disable wagmi state when transaction is completed.
       */
      setEnableQuery(() => false);
      setTimeout(() => {
        callBackFunctionRef.current();
      }, 500);
    }
    if (
      transactionStatusObject.contractError ||
      transactionStatusObject.isError
    ) {
      setEnableQuery(() => false);
      console.log(contractError);
      if (
        transactionStatusObject.contractError &&
        transactionStatusObject.contractError?.message.includes(
          "User rejected the request."
        )
      ) {
        handleToastRef.current(
          TRANSACTION_REJECTED.heading,
          TRANSACTION_REJECTED.subHeading,
          TOAST_TYPE.ERROR
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:"User Rejected the Request, Can I help You with Anything else?" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
      } else {
        handleToastRef.current(
          TRANSACTION_FAILED.heading,
          TRANSACTION_FAILED.subHeading,
          TOAST_TYPE.ERROR,
          transactionStatusObject.hash,
          Number(useTransferStore.getState().payChain)
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:"Some Error has occured, Can I help You with Anything else?" ,
          query:activeChat,
          quote:activeResponse.quote,
          outputString:activeResponse.outputString
        })
        useAgentStore.setState({
          sendingTransaction:false
        })
      }
    }
  }, [
    transactionStatusObject,
    callBackFunctionRef,
    handleToastRef,
    handleSubmitTransactionRef,
  ]);

  const returnConfigForSwap = () => {
    if (payToken?.isNative) {
      return {
        address: useTransferStore.getState().contractConfig
          ?.address as `0x${string}`,
        abi: useTransferStore.getState().contractConfig?.abi as
          | Abi
          | readonly unknown[],
        functionName: useTransferStore.getState().contractConfig
          ?.functionName as string,
        args: useTransferStore.getState().contractConfig?.args as
          | readonly any[]
          | (any[] & readonly any[]),
        value: useTransferStore.getState().contractConfig?.value as undefined,
      };
    } else if (getToken?.isNative) {
      return {
        address: useTransferStore.getState().contractConfig
          ?.address as `0x${string}`,
        abi: useTransferStore.getState().contractConfig?.abi as
          | Abi
          | readonly unknown[],
        functionName: useTransferStore.getState().contractConfig
          ?.functionName as string,
        args: useTransferStore.getState().contractConfig?.args as
          | readonly any[]
          | (any[] & readonly any[]),
      };
    } else {
      if (useTransferStore.getState().contractConfig?.value) {
        return {
          address: useTransferStore.getState().contractConfig
            ?.address as `0x${string}`,
          abi: useTransferStore.getState().contractConfig?.abi as
            | Abi
            | readonly unknown[],
          functionName: useTransferStore.getState().contractConfig
            ?.functionName as string,
          args: useTransferStore.getState().contractConfig?.args as
            | readonly any[]
            | (any[] & readonly any[]),
          value: useTransferStore.getState().contractConfig?.value as undefined,
        };
      } else {
        return {
          address: useTransferStore.getState().contractConfig
            ?.address as `0x${string}`,
          abi: useTransferStore.getState().contractConfig?.abi as
            | Abi
            | readonly unknown[],
          functionName: useTransferStore.getState().contractConfig
            ?.functionName as string,
          args: useTransferStore.getState().contractConfig?.args as
            | readonly any[]
            | (any[] & readonly any[]),
        };
      }
    }
  };

  const sendSwapTransaction = async () => {
    try {
      const contract = returnConfigForSwap();
      console.log(contract);
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract({
        ...contract,
      });
      mixpanel.track("widget_swap_button_click", {
        traxnType: "Swap",
        from: `${payToken?.name}`,
        to: `${getToken?.name}`,
      });
    } catch (error) {
      console.log(error, contractError);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      throw new Error(`Error in Sending Swap Transaction : ${error}`);
    }
  };

  return { sendSwapTransaction, loading: isConfirming || isPending };
};

export default useSendSwapTransaction;
