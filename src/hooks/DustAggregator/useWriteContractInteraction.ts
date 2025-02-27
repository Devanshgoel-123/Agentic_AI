import useDustAggregatorStore from "@/store/dust-aggregator-store";
import useHandleToast from "../common/useHandleToast";
import { useState,useRef, useMemo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAccount, useChainId,useWaitForTransactionReceipt,useWriteContract } from "wagmi";
import { TRANSACTION_FAILED,TRANSACTION_REJECTED,TRANSACTION_PENDING } from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { Abi, encodeFunctionData, WalletClient } from "viem";
import {providers} from "v5n";
import { useWalletClient } from "wagmi";
import { PermitTokenSwap, Token, TokenSwap } from "@/store/types/token-type";
import { PERMIT2_ADDRESS, SignatureTransfer } from "@uniswap/permit2-sdk";
import { estimateGas } from "@wagmi/core";
import { config } from "@/config";
import { CHAIN_IDS, DEFAULT_GAS_PERCENTAGE } from "@/utils/constants";

interface Props{
    callBackFn:()=>void;
}

export const useWriteContractInteraction=({callBackFn}:Props)=>{
    const {handleToast}=useHandleToast();
    const [enableQuery,setEnableQuery]=useState<boolean>(false);
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
        isLoading:isConfirming
    }=useWaitForTransactionReceipt({
        hash,
        query:{
            enabled:enableQuery
        }
    });
    const handleToastRef = useRef<
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
          contractError,
        };
      }, [hash, isConfirming, contractError]);

      useEffect(()=>{
        if(transactionStatusObject.hash && transactionStatusObject.isConfirming){
            handleToastRef.current(
                TRANSACTION_PENDING.heading,
                TRANSACTION_PENDING.subHeading,
                TOAST_TYPE.INFO
              );
              const timeStamp=new Date().getTime();
              setTimeout(() => {
                /**
                 * Disable wagmi state when transaction is completed.
                 */
                setEnableQuery(false);
                useDustAggregatorStore.getState().setActiveTransaction({
                  fromTokens:useDustAggregatorStore.getState().sourceTokens,
                  toToken:useDustAggregatorStore.getState().destinationToken as Token,
                  hash:transactionStatusObject.hash!==undefined ? transactionStatusObject.hash?.toString() :"",
                  status:"PENDING",
                  createdAt:timeStamp
                })
                 callBackFunctionRef.current();
              }, 200);
        }
        if(transactionStatusObject.contractError){
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
            } else {
              handleToastRef.current(
                TRANSACTION_FAILED.heading,
                TRANSACTION_FAILED.subHeading,
                TOAST_TYPE.ERROR
              );
            }
          }
      }
      ,[transactionStatusObject,handleToastRef,contractError])

      const sendWriteTransaction=async()=>{
        try{

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
            if(sourceChain===CHAIN_IDS.ZETACHAIN){
              const isBridge=true;
              const filteredSwaps = tokenSwaps.map(({ poolFeeTier,usdValue, ...rest }) => rest);
              const data=encodeFunctionData({
                abi:contractConfigDust?.abi as Abi,
                functionName: contractConfigDust?.functionName as string,
                args:[
                filteredSwaps,
                contractConfigDust?.message as string,
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
                   filteredSwaps,
                   contractConfigDust?.message as string,
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
          
        }catch(error){
          console.log(error)
          handleToast(
            TRANSACTION_FAILED.heading,
            TRANSACTION_FAILED.subHeading,
            TOAST_TYPE.ERROR
          );
        }
      }
      return {
        sendWriteTransaction,
        isLoading:(isConfirming || isPending)
      }
}
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


