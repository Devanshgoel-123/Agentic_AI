
import { useWriteContract,useWaitForTransactionReceipt } from "wagmi";
import { TokenSwap } from "@/store/types/token-type";
import { useState, useRef, useMemo,useEffect } from "react";
import { TOAST_TYPE } from "@/utils/enums";
import { TRANSACTION_SUCCESS,APPROVAL_PENDING,TRANSACTION_REJECTED,TRANSACTION_FAILED } from "@/utils/toasts";
import useHandleToast from "../common/useHandleToast";
import useDustAggregatorStore from "@/store/dust-aggregator-store";  
import { ApolloError } from "@apollo/client";
import { PoolContractType } from "@/store/types/pool-type";
import { useShallow } from "zustand/react/shallow";
interface UseMulitplePermitApprovalProps{
  approvalStatuses:({
    loading: boolean;
    error: ApolloError | undefined | Error;
    approval: any;
    config: any;
    tokenAddress:string;
  } | null)[];
  tokenDetails:TokenSwap[];
  address: `0x${string}` | undefined;
  finalCallback:()=>void;
}
 

export const useSendPermitApprovalTransaction=({
  approvalStatuses,
  finalCallback,
}:UseMulitplePermitApprovalProps)=>{
    const [index, setIndex] = useState(0);
    const { handleToast } = useHandleToast();
    const { 
      data: hash,
      writeContract,
      isPending,
      error:contractError
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
      };
    }, [hash, isConfirming, isSuccess, contractError, isError]);

    const handleSendNextTransaction=(index:number)=>{
      writeContract({
        address:approvalStatuses[index]?.config.address as `0x${string}`,
        abi: approvalStatuses[index]?.config.abi,
        functionName: approvalStatuses[index]?.config.functionName,
        args:approvalStatuses[index]?.config.args,
      })
    }


  useEffect(() => {
    if (transactionStatusObject.hash && transactionStatusObject.isConfirming) {
      handleToastRef.current(
        APPROVAL_PENDING.heading,
        APPROVAL_PENDING.subHeading,
        TOAST_TYPE.INFO,
        transactionStatusObject.hash,
        useDustAggregatorStore.getState().sourceChain
      );
    }
    if (transactionStatusObject.isSuccess) {
      useDustAggregatorStore.getState().setApprovalStatusAfterApprovaTraxn(approvalStatuses[index]?.tokenAddress as string)
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        useDustAggregatorStore.getState().sourceChain
      );
      // useDustAggregatorStore.getState().setApprovalStatusTrueAfterApproval(
      //   approvalStatuses[index]?.tokenAddress as string
      // )
      const nextIndex = index + 1;
      if (nextIndex<approvalStatuses.length) {
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
          useDustAggregatorStore.getState().sourceChain
        );
      }   
    }
  }, [transactionStatusObject, handleToastRef]);
   const startApprovals = () => {
    if (approvalStatuses.length === 0) {
      return;
    }
    try {
      
      writeContract({
        address: approvalStatuses[index]?.config.address as `0x${string}`,
        abi: approvalStatuses[index]?.config.abi,
        functionName: approvalStatuses[index]?.config.functionName,
        args: approvalStatuses[index]?.config.args,
      });

    } catch (error) {
      console.log(error)
      handleToast(
        TRANSACTION_FAILED.heading,
        TRANSACTION_FAILED.subHeading,
        TOAST_TYPE.ERROR
      );
       
    }
  };
  return {
    startApprovals,
    loading:isPending || isConfirming
  }
  
}