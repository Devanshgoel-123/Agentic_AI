import { create } from "zustand";
import { ChainIds } from "@/utils/enums";
import { Token, TokenSwap } from "./types/token-type";
import { ContractConfig } from "./types/token-type";
import { ActiveTransactionDust } from "./types/transaction-type";
import { ApolloError } from "@apollo/client";
const DEFAULT_SOURCE_CHAIN = ChainIds.ETHEREUM;
const DEFAULT_DESTINATION_CHAIN = ChainIds.ZETACHAIN;

interface DustAggregatorStore {
  sourceChainGasFeesUsd:string;
  sourceChain: number;
  inputValue:string;
  outputValue:string;
  destinationChain: number;
  defaultSourceChain: Token | undefined;
  defaultDestinationChain: Token | undefined;
  destinationToken: Token | undefined;
  sourceTokens: Token[];
  openReviewTransactionModal:boolean;
  tokenSwapForPermit:TokenSwap[];
  contractConfig: ContractConfig | undefined;
  activeTransaction:ActiveTransactionDust | undefined;
  destinationChainGasToken:Token | undefined;
  sourceChainGasToken:Token | undefined;
  sourceChainIntermediateToken:Token | undefined;
  threshold:string;
  totalDustValue:number;
  openTransactionStatusModalDust:boolean;
  displayMobileTokens:boolean;
  initialDisplayTokens:string[];
  minAmountOut:string | undefined; 
  sourceGasAmount:string | undefined;
  gasFeesDestination:string | undefined;
  approvalStatus:Array<{
    loading: boolean;
    error: ApolloError | Error | undefined;
    approval: boolean;
    config: any;
    tokenAddress: string;
  }| null>;
  initialApprovalLength:number;
  setSourceChain: (chain: number) => void;
  setSourceChainTokens:(sourceToken : Token)=>void;
  setDestinationChain: (chain: number) => void;
  setDefaultSourceChainDetails: (token: Token) => void;
  setDefaultDestinationChainDetails: (token: Token) => void;
  setDestinationToken: (token: Token) => void;
  handleSourceChainTokens : (token:Token)=>void;
  clearSourceChainToken:()=>void;
  setOpenReviewTransactionModal:()=>void;
  setCloseReviewTransactionModal:()=>void;
  setContractConfig:(contractConfig:ContractConfig)=>void;
  setTokenSwapForPermit:(tokenSwap:TokenSwap)=>void;
  handleTokenSwapForPermit:(tokenAddress:string)=>void;
  clearTokenSwapForPermit:()=>void;
  setActiveTransaction:(transaction:ActiveTransactionDust)=>void;
  setTokenThreshold:(threshold:string)=>void;
  // setClearAll:(value:boolean)=>void;
  handleOpenTransactionStatusModalDust:()=>void;
  handleCloseTransactionStatusModalDust:()=>void;
  setDisplayMobileTokens:(value:boolean)=>void;
  setApprovalStatus: (statuses:Array<{
    loading: boolean;
    error: ApolloError | Error | undefined;
    approval: boolean;
    config: any;
    tokenAddress: string;
  }| null>) => void;
  setApprovalStatusTrueForConfirmation:()=>void;
  setInitialApprovalLength:(length:number)=>void;
  setApprovalStatusAfterApprovaTraxn:(tokenAddressInput:string)=>void;
  setSourceChainIntermediateToken:(intermediateToken:Token)=>void;
  setDestinationChainGasToken:(gasToken:Token)=>void;
  setSourceGasAmount:(gas:string)=>void;
  setMinAmountOut:(amount:string)=>void;
  setInputValue:(amount:string)=>void;
  setOutputValue:(amount:string)=>void;
  setTotalDustValue:(amount:number)=>void;
  setSubTotalDustValue:(amount:number)=>void;
  setClearTotalDustValue:()=>void;
  setSourceChainGasToken:(token:Token)=>void;
  setSourceChainGasFeesUsd:(amount:string)=>void;
}

const useDustAggregatorStore = create<DustAggregatorStore>((set) => ({
  sourceChain: DEFAULT_SOURCE_CHAIN,
  sourceChainGasFeesUsd:"0.00",
  inputValue:"0",
  outputValue:"0",
  destinationChain: DEFAULT_DESTINATION_CHAIN,
  defaultSourceChain: undefined,
  defaultDestinationChain: undefined,
  destinationToken: undefined,
  gasFeesSource:undefined,
  totalDustValue:0,
  threshold:"50",
  sourceGasAmount:undefined,
  sourceTokens: [],
  openReviewTransactionModal:false,
  tokenSwapForPermit:[],
  contractConfig:undefined,
  clearAll:false,
  openTransactionStatusModalDust:false,
  displayMobileTokens:false,
  approvalStatus:[],
  destinationChainGasToken:undefined,
  sourceChainIntermediateToken:undefined,
  minAmountOut:undefined,
  gasFeesDestination:undefined,
  sourceChainGasToken:undefined,
  initialDisplayTokens:[
    "https://asset.eddy.finance/tokens/matic-token.svg",
    "https://asset.eddy.finance/tokens/zeta-token.svg",
    "https://asset.eddy.finance/tokens/bnb-token.svg",
    "https://asset.eddy.finance/tokens/eth-ethereum.svg"
  ],
  setSourceChain: (chain: number) => {
    set((state) => ({ sourceChain: chain }));
  },
  setSourceChainTokens:(sourceToken:Token)=>{
    set((state)=>({
      sourceTokens:[...state.sourceTokens,sourceToken]
    }))
  },
  initialApprovalLength:0,
  activeTransaction:undefined,
  setDestinationChain: (chain: number) => {
    set((state) => ({ destinationChain: chain }));
  },
  setTokenThreshold:(threshold:string)=>{
    set((state)=>({
      threshold:threshold
    }))
  },
  setDefaultSourceChainDetails: (token: Token) => {
    set((state) => ({ defaultSourceChain: token }));
  },
  setDefaultDestinationChainDetails: (token: Token) => {
    set((state) => ({ defaultDestinationChain: token }));
  },
  setDestinationToken: (token: Token) => {
    set((state) => ({ destinationToken: token }));
  },
  handleSourceChainTokens: (token: Token)=>{
    set((state)=>({
      sourceTokens : state.sourceTokens.filter((item:Token)=>item.address!==token.address && item.id!==token.id)
    }))
  },
  clearSourceChainToken:()=>{
    set((state)=>({
      sourceTokens:[]
    }))
  },
  setOpenReviewTransactionModal:()=>{
    set((state)=>({
      openReviewTransactionModal:true
    }))
  },
  setCloseReviewTransactionModal:()=>{
    set((state)=>({
      openReviewTransactionModal:false
    }))
  },
  setContractConfig:(contractConfig:ContractConfig)=>{
   
    set((state)=>({
      contractConfig:contractConfig
    }))
  },
  setTokenSwapForPermit:(tokenSwap:TokenSwap)=>{
    set((state)=>({
      tokenSwapForPermit:[...state.tokenSwapForPermit,tokenSwap]
    }))
  },
  handleTokenSwapForPermit:(tokenAddress:string)=>{
    set((state)=>({
      tokenSwapForPermit:state.tokenSwapForPermit.filter((item)=>item.token!==tokenAddress)
    }))
  },
  clearTokenSwapForPermit:()=>{
    set((state)=>({
      tokenSwapForPermit:[]
    }))
  },
  setActiveTransaction:(transaction:ActiveTransactionDust)=>{
    set((state)=>({
      activeTransaction:transaction
    }))
  },
  handleOpenTransactionStatusModalDust: () => {
    set((state) => ({
      openTransactionStatusModalDust: true,
    }));
  },
  handleCloseTransactionStatusModalDust: () => {
    set((state) => ({
      openTransactionStatusModalDust: false,
    }));
  },
  setDisplayMobileTokens:(value:boolean)=>{
    set((state)=>({
      displayMobileTokens:value
    }))
  },
  setApprovalStatus:(approvalStatusArray:Array<{
    loading: boolean;
    error: ApolloError | Error | undefined;
    approval: boolean;
    config: any;
    tokenAddress: string;
  }| null>)=>{
    set((state)=>({
      approvalStatus:approvalStatusArray
    }))
  },
  setApprovalStatusAfterApprovaTraxn:(tokenAddressInput:string)=>{
    set((state)=>{
      const updatedStatuses = state.approvalStatus.map((el) =>
        el && el.tokenAddress===tokenAddressInput && !el.approval ? { ...el, approval: true } : el
      );

      return {
        approvalStatus:updatedStatuses
      }
    })
  },
  setApprovalStatusTrueForConfirmation:()=>{
    set((state)=>{
      const updatedStatuses = state.approvalStatus.map((el) =>
        el && !el.approval ? { ...el, approval: true } : el
      );
      return {
        approvalStatus:updatedStatuses
      }
    })
  },
  setInitialApprovalLength:(length:number)=>{
    set((state)=>({
      initialApprovalLength:length
    }))
  },
  setSourceChainIntermediateToken:(intermediateToken:Token)=>{
    set((state)=>({
      sourceChainIntermediateToken:intermediateToken
    }))
  },
  setDestinationChainGasToken:(gasToken:Token | undefined )=>{
    set((state)=>({
      destinationChainGasToken:gasToken
    }))
  },
  setSourceGasAmount:(gas:string)=>{  
    set((state)=>({
     sourceGasAmount:gas
    }))
  },
  setMinAmountOut:(amount:string)=>{
    set((state)=>({
      minAmountOut:amount
    }))
  },
  setInputValue:(amount:string)=>{
    set((state)=>({
      inputValue:amount
    }))
  },
  setOutputValue:(amount:string)=>{
    set((state)=>({
      outputValue:amount
    }))
  },
  setTotalDustValue:(amount:number)=>{
    set((state)=>{
      const updateValue=state.totalDustValue+amount
    return {
      totalDustValue:updateValue
    }
  })
  },
  setSubTotalDustValue:(amount:number)=>{
    set((state)=>{
      const updateValue=state.totalDustValue-amount
    return {
      totalDustValue:updateValue
    }
  })
  },
  setClearTotalDustValue:()=>{
    set((state)=>({
      totalDustValue:0
    }))
  },
  setSourceChainGasToken:(token:Token)=>{
    set((state)=>({
      sourceChainGasToken:token
    }))
  },
  setSourceChainGasFeesUsd:(amount:string)=>{
    set((state)=>({
      sourceChainGasFeesUsd:amount
    }))
  },
  
}));

export default useDustAggregatorStore;
