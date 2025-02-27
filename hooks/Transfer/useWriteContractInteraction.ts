import { act, useEffect, useMemo, useRef, useState } from "react";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import useSaveTransferTransaction from "./useSaveTransferTransaction";
import useHandleToast from "../common/useHandleToast";

import { estimateGas } from "@wagmi/core";
import { Abi, encodeFunctionData } from "viem";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { Token } from "@/store/types/token-type";
import { config } from "@/config";
import { DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";
import mixpanel from "mixpanel-browser";
import { useAgentStore } from "@/store/agent-store";
interface Props {
  callBackFn: () => void;
}

const useWriteContractInteraction = ({ callBackFn }: Props) => {
  const { handleToast } = useHandleToast();
  const { handleSubmitTransaction } = useSaveTransferTransaction();
  const { address } = useAccount();
  const {
    activeChat,
    activeResponse
  }=useAgentStore(useShallow((state)=>({
    activeChat:state.activeChat,
    activeResponse:state.activeResponse
  })))
  /**
   * !Important
   * Keep all the wagmi queries in disabled state
   * at first. Wagmi state will be enable only when
   * enableQuery -> true.
   * Once transaction is executed it is very important to disable it again
   * to prevent wagmi running in the background.
   */
  const [enableQuery, setEnableQuery] = useState(false);

  const { payToken } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
    }))
  );
  const { getToken } = useTransferStore(
    useShallow((state) => ({
      getToken: state.getToken,
    }))
  );
  const {
    data: hash,
    error: contractError,
    isPending,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: enableQuery,
    },
  });

  const handleSubmitTransactionRef = useRef<
    (hash: string, address: string) => Promise<void>
  >(handleSubmitTransaction);
  const callBackFunctionRef = useRef<() => void>(callBackFn);
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
      contractError,
    };
  }, [hash, isConfirming, contractError]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
        TOAST_TYPE.INFO
      );
      handleSubmitTransactionRef.current(
        transactionStatusObject.hash,
        address as string
      );
      const timeStamp = new Date().getTime();
      useTransferStore
        .getState()
        .setActiveTransactionHash(transactionStatusObject.hash);
      useAgentStore.getState().setActiveTransactionHashResponse({
        activeTransactionHash: transactionStatusObject.hash || "" ,
        query:activeChat,
        quote:activeResponse.quote,
        outputString:activeResponse.outputString
      })
      useTransferStore.getState().setActiveTransaction(
        {
          fromToken: useTransferStore.getState().payToken as Token,
          toToken: useTransferStore.getState().getToken as Token,
          estimatedTime: useTransferStore.getState().estimatedTime,
          hash: transactionStatusObject.hash,
          createdAt: timeStamp,
          status: "PENDING",
        },
        false
      );
      useAgentStore.setState({
        sendingTransaction:false
      })
      setTimeout(() => {
        /**
         * Disable wagmi state when transaction is completed.
         */
        setEnableQuery(false);
        callBackFunctionRef.current();
      }, 200);
    }
    if (transactionStatusObject.contractError) {
      setEnableQuery(false);
      console.log(contractError);
      if (
        transactionStatusObject.contractError.message.includes(
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
          TOAST_TYPE.ERROR
        );
        useAgentStore.getState().setActiveTransactionHashResponse({
          activeTransactionHash:"Some Error has Occured, Can I help You with Anything else?" ,
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
    handleToastRef,
    callBackFunctionRef,
    handleSubmitTransactionRef,
  ]);

  const sendWriteTransaction = async () => {
    try {
      console.log(useTransferStore.getState().contractConfig);
      /**
       * Encode data for gas limit before executing wagmi
       * this will capture error before wagmi sends
       * transaction.
       */
      const data = encodeFunctionData({
        abi: useTransferStore.getState().contractConfig?.abi as Abi,
        functionName:
          (useTransferStore.getState().contractConfig
            ?.functionName as string) ?? undefined,
        args: useTransferStore.getState().contractConfig?.args,
      });
      const result = await estimateGas(config, {
        chainId: Number(payToken?.chain.chainId) as
          | 1
          | 56
          | 137
          | 7000
          | undefined,
        data,
        to: useTransferStore.getState().contractConfig
          ?.address as `0x${string}`,
        value: useTransferStore.getState().contractConfig?.value
          ? BigInt(useTransferStore.getState().contractConfig?.value as string)
          : undefined,
      });
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract(
        payToken?.isNative
          ? {
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
              value: useTransferStore.getState().contractConfig
                ?.value as undefined,
              // gas: result
              //   ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
              //       BigInt(100)) as bigint)
              //   : undefined,
            }
          : {
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
              // gas: result
              //   ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
              //       BigInt(100)) as bigint)
              //   : undefined,
            }
      );
      mixpanel.track("widget_swap_button_click", {
        traxnType: "CrossChain",
        from: `${payToken?.name}`,
        to: `${getToken?.name}`,
      });
    } catch (error) {
      console.log(error);
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
      throw new Error(`Error while writing contract interactions:${error}`);
    }
  };

  return { sendWriteTransaction, isPending };
};

export default useWriteContractInteraction;
