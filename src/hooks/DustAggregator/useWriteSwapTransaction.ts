import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import useHandleToast from "../common/useHandleToast";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import useDustAggregatorStore from "@/store/dust-aggregator-store";
import { estimateGas } from "@wagmi/core";
import { Abi, encodeFunctionData , WalletClient} from "viem";
import { providers } from "v5n";
import { PERMIT2_ADDRESS, SignatureTransfer } from "@uniswap/permit2-sdk";
import { useWalletClient, useChainId } from "wagmi";
import { TokenSwap } from "@/store/types/token-type";
import { PermitTokenSwap } from "@/store/types/token-type";
import {
  TRANSACTION_FAILED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_SUCCESS,
} from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { CHAIN_IDS, DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";
import { config } from "@/config";

interface Props {
  callBackFn: () => void;
}
const useSendDustSwapTransaction = ({ callBackFn }: Props) => {
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
  const chainId = useChainId();
   const signer=useEthersSigner({
      chainId:useDustAggregatorStore.getState().sourceChain
    })
  const {
    destinationToken,
    sourceChain,
    contractConfigDust
}=useDustAggregatorStore(useShallow((state)=>({
    sourceTokens:state.sourceTokens,
    destinationToken:state.destinationToken,
    sourceChain:state.sourceChain,
    contractConfig:state.contractConfig,
    destinationChain:state.destinationChain,
    contractConfigDust:state.contractConfig
})))
const {
    data:hash,
    error:contractError,
    isPending,
    writeContract
}=useWriteContract()

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
    const callBackFunctionRef = useRef<() => void>(callBackFn);
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
        Number(useDustAggregatorStore.getState().sourceChain)
      );
    }
    if (transactionStatusObject.isSuccess) {
      handleToastRef.current(
        TRANSACTION_SUCCESS.heading,
        TRANSACTION_SUCCESS.subHeading,
        TOAST_TYPE.SUCCESS,
        transactionStatusObject.hash,
        Number(useDustAggregatorStore.getState().sourceChain)
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
          Number(useDustAggregatorStore.getState().sourceChain)
        );
      }
    }
  }, [
    transactionStatusObject,
    callBackFunctionRef,
    handleToastRef,
    
  ]);


  const sendSwapTransaction = async () => {
    try {
        const signPermit=async(swaps:PermitTokenSwap[])=>{
            const {domain,types,values,deadline,nonce}=await preparePermitData( 
              swaps,
              contractConfigDust?.address || "",
              chainId
            )
          
        const signature=await signer?._signTypedData(domain,types, values);
            return {
              deadline,
              nonce,
              signature
            }
            }
        const tokenSwaps=useDustAggregatorStore.getState().tokenSwapForPermit;
        const filteredSwapForPermit:PermitTokenSwap[]=tokenSwaps.map((item)=>{
          return {
            amount:item.amount,
            token:item.token,
            poolFeeTier:item.poolFeeTier
          }
        })
        const permit=await signPermit(filteredSwapForPermit);
      /**
       * Encode data for gas limit before executing wagmi
       * this will capture error before wagmi sends
       * transaction.
       */
      if(sourceChain===CHAIN_IDS.ZETACHAIN){
        const isBridge=!(sourceChain===destinationToken?.chain.chainId);
        const filteredSwaps = tokenSwaps.map(({ poolFeeTier,usdValue,...rest }) => rest);
        const data=encodeFunctionData({
          abi:contractConfigDust?.abi as Abi,
          functionName: contractConfigDust?.functionName as string,
          args:[
          filteredSwaps as PermitTokenSwap[],
          "0x",
          destinationToken?.zrc20Address as `0x${string}`,
          isBridge,
          permit.nonce,
          permit.deadline,
          permit.signature
          ]
        })
        const result=await estimateGas(config,{
            chainId:useDustAggregatorStore.getState().sourceChain as 
            | 1
            | 56
            | 137
            | 7000
            | 8453
            | undefined,
            data,
            to:contractConfigDust?.address as `0x${string}`,
          });
     
        setEnableQuery(()=>true);
        writeContract({
          address:contractConfigDust?.address as `0x${string}`,
          abi:contractConfigDust?.abi as Abi,
          functionName:contractConfigDust?.functionName as string,
            args:[
             filteredSwapForPermit as PermitTokenSwap[],
             "0x",
             destinationToken?.zrc20Address as `0x${string}`,
             isBridge,
             permit.nonce,
             permit.deadline,
             permit.signature
            ] as
            | readonly any[]
            | (any[] & readonly any[]),
          gas: result
            ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
                BigInt(100)) as bigint)
          : undefined,
        })
      }else{
        if(destinationToken?.isNative){
            const data=encodeFunctionData({
              abi:contractConfigDust?.abi as Abi,
              functionName: contractConfigDust?.functionName as string,
              args:[
              filteredSwapForPermit as PermitTokenSwap[],
               permit.nonce,
               permit.deadline,
               permit.signature
              ]
            })
            const result=await estimateGas(config,{
                chainId:useDustAggregatorStore.getState().sourceChain as 
                | 1
                | 56
                | 137
                | 7000
                | 8453
                | undefined,
                data,
                to:contractConfigDust?.address as `0x${string}`,
              });
            setEnableQuery(()=>true);
            writeContract({
              address: contractConfigDust?.address as `0x${string}`,
              abi: contractConfigDust?.abi as Abi,
              functionName: contractConfigDust?.functionName as string,
              args: [
                filteredSwapForPermit as PermitTokenSwap[],
                permit.nonce,
                permit.deadline,
                permit.signature
               ] as
                | readonly any[]
                | (any[] & readonly any[]),
              gas: result
                ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
                    BigInt(100)) as bigint)
              : undefined,
            })
          }else{
            const data=encodeFunctionData({
              abi:contractConfigDust?.abi as Abi,
              functionName: contractConfigDust?.functionName as string,
              args:[
                filteredSwapForPermit as PermitTokenSwap[],
               contractConfigDust?.message,
               permit.nonce,
               permit.deadline,
               permit.signature
              ]
            })
            const result=await estimateGas(config,{
                chainId:useDustAggregatorStore.getState().sourceChain as 
                | 1
                | 56
                | 137
                | 7000
                | 8453
                | undefined,
                data,
                to:contractConfigDust?.address as `0x${string}`,
              });
            setEnableQuery(()=>true);
            writeContract({
              address: contractConfigDust?.address as `0x${string}`,
              abi: contractConfigDust?.abi as Abi,
              functionName: contractConfigDust?.functionName as string,
              args: [
                filteredSwapForPermit as PermitTokenSwap[],
                contractConfigDust?.message,
                permit.nonce,
                permit.deadline,
                permit.signature
               ] as
                | readonly any[]
                | (any[] & readonly any[]),
              gas: result
                ? (((result * BigInt(DEFAULT_GAS_PERCENTAGE)) /
                    BigInt(100)) as bigint)
              : undefined,
            })
          } 
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

  return { sendSwapTransaction, loading: isConfirming || isPending };
};

export default useSendDustSwapTransaction;


/**
 *  Function to create the permit Data 
 * @param swap contains the balance, address of the token also the minimum amount out
 * @param spenderAddress contract address on the selected source chain
 */
const preparePermitData=async (swap:PermitTokenSwap[],spenderAddress:string,chainId:number)=>{
    const nonce = (Math.floor(Math.random() * 1e15)); // 1 quadrillion potential nonces
    const deadline = (calculateEndTime(30 * 60 * 1000));
  
    const permit={
      deadline:deadline,
      nonce:nonce,
      permitted:swap.map((s)=>{
        return {
          amount:s.amount,
          token:s.token as `0x${string}`
        }
      }),
      spender:spenderAddress as `0x${string}`
    }
    
    const { domain, types, values } = SignatureTransfer.getPermitData(
      permit,
      PERMIT2_ADDRESS as string,
      chainId
    );
  
    return { domain, types, values, deadline, nonce };
  
  }
  const calculateEndTime = (duration: number) => {
    return Math.floor((Date.now() + duration) / 1000);
  };
  
  
  export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    if (!chain || !account) return undefined;
      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      };
      const provider = new providers.Web3Provider(transport, network);
      const signer = provider.getSigner(account.address);
      return signer;
  }
  
  /** Hook to convert a viem Wallet Client to an ethers.js Signer. */
  export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: walletClient } = useWalletClient({ chainId });
    return useMemo(
      () => (walletClient ? walletClientToSigner(walletClient) : undefined),
      [walletClient]
    );
  }