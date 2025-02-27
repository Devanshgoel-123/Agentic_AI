import { useEffect, useMemo, useRef } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import useHandleToast from "../common/useHandleToast";
import useCurveStore, { TokenInputObject } from "@/store/curve-store";
import { useEstimateExtraGas } from "../common/useEstimateExtraGas";

import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { POOL_ACTION_TYPE, POOL_TYPE, TOAST_TYPE } from "@/utils/enums";

import { Abi, Account } from "viem";
import { DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";
import useSavePoolTransaction from "./useSavePoolTransaction";

interface Props {
  poolName: string;
  tokenInputs: TokenInputObject[];
  chainId: number;
  callBackFunction: () => void;
}

const useSendCurveDepositTransaction = ({
  poolName,
  tokenInputs,
  chainId,
  callBackFunction,
}: Props) => {
  const { address } = useAccount();
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

  const { handleSubmitTransaction } = useSavePoolTransaction();

  const handleSaveTransaction = (hash: string) => {
    handleSubmitTransaction(
      hash,
      POOL_ACTION_TYPE.ADD,
      chainId,
      useCurveStore
        .getState()
        .tokenInputs.filter(
          (el) => Number(el.amount) !== 0 && el.token !== undefined
        )[0].token?.chain.chainLogo as string,
      useCurveStore
        .getState()
        .tokenInputs.filter(
          (el) => Number(el.amount) !== 0 && el.token !== undefined
        )[0].token?.chain.chainLogo as string,
      useCurveStore
        .getState()
        .tokenInputs.filter(
          (el) => Number(el.amount) !== 0 && el.token !== undefined
        )
        .map((el) => el.token?.tokenLogo as string),
      POOL_TYPE.CURVE,
      poolName
    );
  };

  const handleSaveTransactionRef = useRef<(hash: string) => void>(
    handleSaveTransaction
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
      chainId,
    };
  }, [hash, isConfirming, isSuccess, contractError, isError, chainId]);

  const estimatedWithExtra = useEstimateExtraGas(
    useCurveStore.getState().depositContractConfig
      ? {
          account: address as `0x${string}` | Account,
          address: useCurveStore.getState().depositContractConfig
            ?.address as `0x${string}`,
          abi: useCurveStore.getState().depositContractConfig?.abi as Abi,
          functionName:
            (useCurveStore.getState().depositContractConfig
              ?.functionName as string) ?? undefined,
          args: useCurveStore.getState().depositContractConfig?.args,
          chain: undefined,
          value: BigInt(
            useCurveStore.getState().depositContractConfig?.value ?? 0
          ),
        }
      : undefined,
    BigInt(DEFAULT_GAS_PERCENTAGE)
  );

  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        TRANSACTION_PENDING.heading,
        TRANSACTION_PENDING.subHeading,
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
      handleSaveTransactionRef.current(transactionStatusObject.hash as string);
      setTimeout(() => {
        callBackFunctionRef.current();
      }, 0);
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
          transactionStatusObject.chainId
        );
      }
    }
  }, [
    transactionStatusObject,
    callBackFunctionRef,
    handleToastRef,
    handleSaveTransactionRef,
  ]);

  const sendDepositTransaction = () => {
    try {
      if (tokenInputs.some((el) => el.token && el.token.isNative)) {
        writeContract({
          address: useCurveStore.getState().depositContractConfig
            ?.address as `0x${string}`,
          abi: useCurveStore.getState().depositContractConfig?.abi,
          functionName:
            useCurveStore.getState().depositContractConfig?.functionName,
          args: useCurveStore.getState().depositContractConfig?.args,
          value: useCurveStore.getState().depositContractConfig?.value,
          gas: (estimatedWithExtra as bigint) ?? undefined,
        });
      } else {
        writeContract({
          address: useCurveStore.getState().depositContractConfig
            ?.address as `0x${string}`,
          abi: useCurveStore.getState().depositContractConfig?.abi,
          functionName:
            useCurveStore.getState().depositContractConfig?.functionName,
          args: useCurveStore.getState().depositContractConfig?.args,
          gas: (estimatedWithExtra as bigint) ?? undefined,
        });
      }
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
    sendDepositTransaction,
    loading: isPending || isConfirming,
  };
};

export default useSendCurveDepositTransaction;
