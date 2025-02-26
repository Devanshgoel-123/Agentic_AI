import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContractConfig, Token } from "./types/token-type";
import { DEFAULT_GETCHAIN, DEFAULT_PAYCHAIN } from "@/utils/constants";
import { ActiveTransaction, TokenRoute } from "./types/transaction-type";

interface TransferStore {
  openTransactionStatusModal: boolean;
  payChain: number;
  getChain: number;
  payChainGasTokenId: number | undefined;
  getChainGasTokenId: number | undefined;
  payToken: Token | undefined;
  getToken: Token | undefined;
  payChainGasToken: Token | undefined;
  getChainGasToken: Token | undefined;
  payTokenBalance: string;
  inputAmount: string;
  tokenInAmount: string;
  tokenOutAmount: string;
  destChainGasFees: string;
  srcChainGasFees: string;
  minimumReceived: string;
  estimatedReceived: string;
  zetaChainGas: string;
  protocolFees: number;
  route: TokenRoute | undefined;
  contractConfig: ContractConfig | undefined;
  activeTransactionHash: string | undefined;
  activeTransaction: ActiveTransaction | undefined;
  estimatedTime: number;
  rewardPoints:number;
  activeTransactionArray:ActiveTransaction[];
  activeSidebar : boolean;
  setPayChain: (chainId: number) => void;
  setGetChain: (chainId: number) => void;
  setPayChainGasTokenId: (id: number) => void;
  setGetChainGasTokenId: (id: number) => void;
  setPayToken: (token: Token) => void;
  setGetToken: (token: Token) => void;
  setPayChainGasToken: (token: Token) => void;
  setGetChainGasToken: (token: Token) => void;
  setPayTokenBalance: (balance: string) => void;
  setInputAmount: (value: string) => void;
  setTokenInAmount: (value: string) => void;
  setTokenOutAmount: (value: string) => void;
  handleOpenTransactionStatusModal: () => void;
  handleCloseTransactionStatusModal: () => void;
  setMaxBalance: () => void;
  setDestinationGas: (gas: string) => void;
  setMinimumReceived: (amount: string) => void;
  setEstimatedReceived: (amount: string) => void;
  setSourceChainGas: (gas: string) => void;
  setZetaChainGas: (gas: string) => void;
  setProtocolFee: (fee: number) => void;
  setRoute: (route: TokenRoute) => void;
  setContractConfig: (config: ContractConfig) => void;
  setActiveTransactionHash: (hash: string) => void;
  setEstimatedTime: (time: number) => void;
  setActiveTransaction: (transaction: ActiveTransaction,repeat:boolean) => void;
  setActiveSideBar:(value:boolean) => void;
  handleSwapToken: () => void;
  handleCompletedTransaction:(hash:string) => void;
  handleUpdateActiveTransactionStatus:(hash:string,status:"SUCCESS" | "PENDING" | "FAILED") => void;
  handleOldTransactions:()=>void;
  setRewardPoints:(points:number)=>void;
}

const useTransferStore = create<TransferStore>()(
  persist(
    (set, get) => ({
      openTransactionStatusModal: false,
      payChain: DEFAULT_PAYCHAIN,
      getChain: DEFAULT_GETCHAIN,
      payChainGasTokenId: undefined,
      getChainGasTokenId: undefined,
      payToken: undefined,
      getToken: undefined,
      payChainGasToken: undefined,
      getChainGasToken: undefined,
      payTokenBalance: "0.00",
      inputAmount: "0",
      tokenInAmount: "0.00",
      tokenOutAmount: "0.00",
      destChainGasFees: "0",
      srcChainGasFees: "0",
      minimumReceived: "0",
      estimatedReceived: "0",
      zetaChainGas: "0",
      protocolFees: 0,
      route: undefined,
      rewardPoints:0,
      contractConfig: undefined,
      activeTransactionHash: undefined,
      activeTransaction: undefined,
      estimatedTime: 0,
      activeTransactionArray:[],
      activeSidebar:false,
      setPayChain: (chainId: number) => {
        set((state) => ({ payChain: chainId }));
      },
      setGetChain: (chainId: number) => {
        set((state) => ({ getChain: chainId }));
      },
      setPayChainGasTokenId: (id: number) => {
        set((state) => ({ payChainGasTokenId: id }));
      },
      setGetChainGasTokenId: (id: number) => {
        set((state) => ({ getChainGasTokenId: id }));
      },
      setPayToken: (token: Token) => {
        console.log("setting pay token",token)
        set((state) => ({ payToken: token }));
      },
      setGetToken: (token: Token) => {
        set((state) => ({ getToken: token }));
      },
      setPayChainGasToken: (token: Token) => {
        set((state) => ({ payChainGasToken: token }));
      },
      setGetChainGasToken: (token: Token) => {
        set((state) => ({ getChainGasToken: token }));
      },
      setPayTokenBalance: (balance: string) => {
        set((state) => ({ payTokenBalance: balance }));
      },
      setInputAmount: (value: string) => {
        set((state) => ({ tokenInAmount: value }));
      },
      setTokenInAmount: (value: string) => {
        console.log(value)
        console.log("setting token in amount",value)
        set((state) => ({ tokenInAmount: value }));
      },
      setTokenOutAmount: (value: string) => {
        set((state) => ({ tokenOutAmount: value }));
      },
      handleOpenTransactionStatusModal: () => {
        set((state) => ({ openTransactionStatusModal: true }));
      },
      handleCloseTransactionStatusModal: () => {
        set((state) => ({ openTransactionStatusModal: false }));
      },
      setMaxBalance: () => {
        set((state) => ({ tokenInAmount: state.tokenInAmount }));
      },
      setDestinationGas: (gas: string) => {
        set((state) => ({ destChainGasFees: gas }));
      },
      setMinimumReceived: (amount: string) => {
        set((state) => ({ minimumReceived: amount }));
      },
      setEstimatedReceived: (amount: string) => {
        set((state) => ({ estimatedReceived: amount }));
      },
      setSourceChainGas: (gas: string) => {
        set((state) => ({ srcChainGasFees: gas }));
      },
      setZetaChainGas: (gas: string) => {
        set((state) => ({ zetaChainGas: gas }));
      },
      setProtocolFee: (fee: number) => {  
        set((state) => ({ protocolFees: fee }));
      },
      setRoute: (route: TokenRoute) => {
        set((state) => ({ route: route }));
      },
      setContractConfig: (config: ContractConfig) => {
        set((state) => ({ contractConfig: config }));
      },
      setActiveTransactionHash: (hash: string) => {
        set((state) => ({ activeTransactionHash: hash }));
      },
      setEstimatedTime: (time: number) => {
        set((state) => ({ estimatedTime: time }));
      },
      setActiveTransaction: (txn: ActiveTransaction,repeat:boolean) => {
        set((state) => { 
          const exists = state.activeTransactionArray.some(
            (tx) => tx.hash === txn.hash
          );
          if (exists) {
            return {
              activeTransaction: txn,
            };
          }
          return {
          activeTransaction: txn,
          activeTransactionArray:[txn,...state.activeTransactionArray]
        }});
      },
      setActiveSideBar:(value:boolean)=>{
        set((state)=>({
          activeSidebar:value
        }))
      },
      handleSwapToken: () => {
        const {
          payToken,
          getToken,
          payChain,
          getChain,
          tokenInAmount,
          tokenOutAmount,
          getChainGasTokenId,
          payChainGasTokenId,
          payChainGasToken,
          getChainGasToken,
        } = get();
        set({
          payToken: getToken,
          getToken: payToken,
          payChain: getChain,
          getChain: payChain,
          tokenInAmount: tokenOutAmount,
          tokenOutAmount: tokenInAmount ? tokenInAmount : "0.00",
          payChainGasTokenId: getChainGasTokenId,
          getChainGasTokenId: payChainGasTokenId,
          payChainGasToken: getChainGasToken,
          getChainGasToken: payChainGasToken,
        });
      },
      handleCompletedTransaction:(hash:string) => {
        set((state) => ({
          activeTransactionArray: state.activeTransactionArray.filter(
            (txn) => txn.hash !== hash &&
            (txn.createdAt && Date.now() - txn.createdAt < 1000 * 60 * 60 * 5)
          ),
        }));
      },
      handleUpdateActiveTransactionStatus:(hash:string,status:"SUCCESS" | "PENDING" | "FAILED") => {
        set((state) => ({
          activeTransactionArray: state.activeTransactionArray.map(txn => txn.hash === hash ? { ...txn, status } : txn)
        }));
      },
      handleOldTransactions:()=>{
        set((state) => ({
          activeTransactionArray:state.activeTransactionArray.filter(txn => txn.createdAt && Date.now() - txn.createdAt < 1000 * 60 * 60 * 12)
        }))
      },
      setRewardPoints:(points:number)=>{
        set((state)=>({
          rewardPoints:points
        }))
      },
    }),
    {
      name:"Transfer-store",
      partialize:(state)=>({
        activeTransactionArray:state.activeTransactionArray
      })
    }
  )
);

export default useTransferStore;
