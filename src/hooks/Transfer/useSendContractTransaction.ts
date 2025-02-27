import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import useTransferStore from "@/store/transfer-store";
import useSaveTransferTransaction from "./useSaveTransferTransaction";
import useHandleToast from "../common/useHandleToast";
import mixpanel from "mixpanel-browser";
import { useAgentStore } from "@/store/agent-store";
import { convertUIFormatToBigInt } from "@/utils/number";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { Token } from "@/store/types/token-type";

interface Props {
  callBackFn: () => void;
}

const useSendContractTransaction = ({ callBackFn }: Props) => {
  const { handleToast } = useHandleToast();
  const { address } = useAccount();
  const { handleSubmitTransaction } = useSaveTransferTransaction();
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
  const {
    contractConfig,
    payToken,
    getToken,
    tokenInAmount,
    payChain,
    getChain,
    estimatedTime,
  } = useTransferStore(
    useShallow((state) => ({
      contractConfig: state.contractConfig,
      payToken: state.payToken,
      getToken: state.getToken,
      tokenInAmount: state.tokenInAmount,
      payChain: state.payChain,
      getChain: state.getChain,
      estimatedTime: state.estimatedTime,
    }))
  );
  const {
    data: hash,
    error: contractError,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
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

  const handleSubmitTransactionRef = useRef<
    (hash: string, address: string) => Promise<void>
  >(handleSubmitTransaction);
  const callBackFunctionRef = useRef<() => void>(callBackFn);

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
          estimatedTime: estimatedTime,
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

  const sendCrossChainTransaction = async () => {
    try {
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(true);
      sendTransaction({
        to: contractConfig?.address as `0x${string}` | null | undefined,
        value: BigInt(
          convertUIFormatToBigInt(
            tokenInAmount,
            Number(payToken?.decimal ?? 18)
          ).toString()
        ),
        data: contractConfig?.data as `0x${string}` | undefined,
      });
      mixpanel.track("widget_swap_button_click", {
        traxnType: "CrossChain",
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
      throw new Error(`Error sending cross chain transactions:${error}`);
    }
  };

  return { sendCrossChainTransaction, isPending };
};

export default useSendContractTransaction;
