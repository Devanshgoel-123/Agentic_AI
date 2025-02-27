import { useEffect, useMemo, useRef, useState } from "react";
import useHandleToast from "../common/useHandleToast";
import useUniV2Store from "@/store/univ2-store";
import useSavePoolTransaction from "./useSavePoolTransaction";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { estimateGas } from "@wagmi/core";
import { Abi, encodeFunctionData } from "viem";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { POOL_ACTION_TYPE, POOL_TYPE, TOAST_TYPE } from "@/utils/enums";

import { DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";
import { config } from "@/config";

interface Props {
  poolName: string;
  chainId: number;
  callBackFn: () => void;
}
const useSendRemoveLiquidityUniV2 = ({
  chainId,
  callBackFn,
  poolName,
}: Props) => {
  const { handleToast } = useHandleToast();
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

  const { handleSubmitTransaction } = useSavePoolTransaction();

  const handleSaveTransaction = (hash: string) => {
    handleSubmitTransaction(
      hash,
      POOL_ACTION_TYPE.REMOVE,
      chainId,
      useUniV2Store.getState().minAmountTokenAObject.token?.chain
        .chainLogo as string,
      useUniV2Store.getState().minAmountTokenAObject.token?.chain
        .chainLogo as string,
      [
        useUniV2Store.getState().minAmountTokenAObject.token
          ?.tokenLogo as string,
        useUniV2Store.getState().minAmountTokenBObject.token
          ?.tokenLogo as string,
      ],
      POOL_TYPE.UNI_V2,
      poolName
    );
  };

  const handleSaveTransactionRef = useRef<(hash: string) => void>(
    handleSaveTransaction
  );

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
      chainId,
    };
  }, [hash, isConfirming, isSuccess, contractError, isError, chainId]);

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        Number(transactionStatusObject.chainId)
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        Number(transactionStatusObject.chainId)
      );
      handleSaveTransactionRef.current(transactionStatusObject.hash as string);
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
      console.log(contractError);
      setTimeout(() => {
        setEnableQuery(() => false);
      }, 100);
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
          Number(transactionStatusObject.chainId)
        );
      }
    }
  }, [
    transactionStatusObject,
    callBackFunctionRef,
    handleToastRef,
    handleSaveTransactionRef,
  ]);

  const sendRemoveLiquidityTransaction = async () => {
    try {
      /**
       * Encode data for gas limit before executing wagmi
       * this will capture error before wagmi sends
       * transaction.
       */
      const data = encodeFunctionData({
        abi: useUniV2Store.getState().withdrawContractConfig?.abi as Abi,
        functionName:
          (useUniV2Store.getState().withdrawContractConfig
            ?.functionName as string) ?? undefined,
        args: useUniV2Store.getState().withdrawContractConfig?.args,
      });
      const result = await estimateGas(config, {
        chainId: chainId as 1 | 56 | 137 | 7000 | undefined,
        data,
        to: useUniV2Store.getState().withdrawContractConfig
          ?.address as `0x${string}`,
        value: useUniV2Store.getState().withdrawContractConfig?.value
          ? BigInt(useUniV2Store.getState().withdrawContractConfig?.value)
          : undefined,
      });
      /**
       * Enable wagmi state before transaction.
       */
      setEnableQuery(() => true);
      writeContract(
        useUniV2Store.getState().minAmountTokenBObject?.token?.isNative
          ? {
              address: useUniV2Store.getState().withdrawContractConfig
                ?.address as `0x${string}`,
              abi: useUniV2Store.getState().withdrawContractConfig?.abi as
                | Abi
                | readonly unknown[],
              functionName: useUniV2Store.getState().withdrawContractConfig
                ?.functionName as string,
              args: useUniV2Store.getState().withdrawContractConfig?.args as
                | readonly any[]
                | (any[] & readonly any[]),
              gas: result
                ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
                    BigInt(100)) as bigint)
                : undefined,
            }
          : {
              address: useUniV2Store.getState().withdrawContractConfig
                ?.address as `0x${string}`,
              abi: useUniV2Store.getState().withdrawContractConfig?.abi as
                | Abi
                | readonly unknown[],
              functionName: useUniV2Store.getState().withdrawContractConfig
                ?.functionName as string,
              args: useUniV2Store.getState().withdrawContractConfig?.args as
                | readonly any[]
                | (any[] & readonly any[]),
              gas: result
                ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
                    BigInt(100)) as bigint)
                : undefined,
            }
      );
    } catch (error) {
      console.log(error, "error");
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
    }
  };

  return { sendRemoveLiquidityTransaction, loading: isConfirming || isPending };
};

export default useSendRemoveLiquidityUniV2;
