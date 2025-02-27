import { useEffect, useMemo, useRef, useState } from "react";
import useHandleToast from "../common/useHandleToast";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import useUniV3Store from "@/store/univ3-store";

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

interface Props {
  poolChainId: number;
  callBackFn: () => void;
}
const useSendWithdrawCollectFeeTransaction = ({
  poolChainId,
  callBackFn,
}: Props) => {
  const { handleToast } = useHandleToast();
  const {
    data: hash,
    error: contractError,
    isPending,
    writeContract,
  } = useWriteContract();

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

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        Number(transactionStatusObject.poolChainId)
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        Number(transactionStatusObject.poolChainId)
      );
      /**
       * Disable wagmi state when transaction is completed.
       */
      setTimeout(() => {
        setEnableQuery(() => false);
      }, 100);
      callBackFunctionRef.current();
    }
    if (
      transactionStatusObject.contractError ||
      transactionStatusObject.isError
    ) {
      setTimeout(() => {
        setEnableQuery(() => false);
      }, 100);
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
      } else {
        handleToastRef.current(
          TRANSACTION_FAILED.heading,
          TRANSACTION_FAILED.subHeading,
          TOAST_TYPE.ERROR,
          transactionStatusObject.hash,
          Number(transactionStatusObject.poolChainId)
        );
        setTimeout(() => {
          callBackFunctionRef.current();
        }, 0);
      }
    }
  }, [transactionStatusObject, callBackFunctionRef, handleToastRef]);

  const sendCollectFeeTransaction = async () => {
    try {
      /**
       * Encode data for gas limit before executing wagmi
       * this will capture error before wagmi sends
       * transaction.
       */
      const data = encodeFunctionData({
        abi: useUniV3Store.getState().withdrawCollectFeeContractConfig
          ?.abi as Abi,
        functionName:
          (useUniV3Store.getState().withdrawCollectFeeContractConfig
            ?.functionName as string) ?? undefined,
        args: useUniV3Store.getState().withdrawCollectFeeContractConfig?.args,
      });
      const result = await estimateGas(config, {
        chainId: poolChainId as 1 | 56 | 137 | 7000 | undefined,
        data,
        to: useUniV3Store.getState().withdrawCollectFeeContractConfig
          ?.address as `0x${string}`,
        value: useUniV3Store.getState().withdrawCollectFeeContractConfig?.value
          ? BigInt(
              useUniV3Store.getState().withdrawCollectFeeContractConfig?.value
            )
          : undefined,
      });
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract({
        address: useUniV3Store.getState().withdrawCollectFeeContractConfig
          ?.address as `0x${string}`,
        abi: useUniV3Store.getState().withdrawCollectFeeContractConfig?.abi as
          | Abi
          | readonly unknown[],
        functionName: useUniV3Store.getState().withdrawCollectFeeContractConfig
          ?.functionName as string,
        args: useUniV3Store.getState().withdrawCollectFeeContractConfig
          ?.args as readonly any[] | (any[] & readonly any[]),
        gas: result
          ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
              BigInt(100)) as bigint)
          : undefined,
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

  return { sendCollectFeeTransaction, loading: isConfirming || isPending };
};

export default useSendWithdrawCollectFeeTransaction;
