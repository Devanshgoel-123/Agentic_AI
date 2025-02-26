import { create } from "zustand";
import { Token } from "./types/token-type";
import { PoolContractType } from "./types/pool-type";

interface UniV2Store {
  tokenABalanceObject: {
    token: Token | undefined;
    balance: string;
  };
  tokenBBalanceObject: {
    token: Token | undefined;
    balance: string;
  };
  tokenAAmount: string;
  tokenBAmount: string;
  minAmountLp: string;
  lpTokenAmount: string;
  minAmountTokenA: string;
  minAmountTokenB: string;
  minAmountTokenAObject: {
    amount: string;
    token: Token | undefined;
  };
  minAmountTokenBObject: {
    amount: string;
    token: Token | undefined;
  };
  tokenLpInput: string;
  lpTokenBalance: string;
  isDepositQuoteLoading: boolean;
  slippageValue: string | number;
  depositContractConfig: PoolContractType | undefined;
  withdrawContractConfig: PoolContractType | undefined;
  setTokenABalance: (token: Token, balance: string) => void;
  setTokenBBalance: (token: Token, balance: string) => void;
  setTokenAAmount: (val: string) => void;
  setTokenBAmount: (val: string) => void;
  setMinAmountLp: (val: string) => void;
  setLpTokenAmount: (val: string) => void;
  setMinAmountTokenA: (val: string) => void;
  setMinAmountTokenB: (val: string) => void;
  setIsDepositQuoteLoading: (loading: boolean) => void;
  setSlippageValue: (slippage: string | number) => void;
  setMinAmountAObject: (amount: string, token: Token) => void;
  setMinAmountBObject: (amount: string, token: Token) => void;
  setLpTokenInput: (amount: string) => void;
  setDepositContractConfig: (config: PoolContractType) => void;
  setLpTokenBalance: (val: string) => void;
  setWithdrawContractConfig: (config: PoolContractType) => void;
}

const useUniV2Store = create<UniV2Store>((set) => ({
  tokenABalanceObject: {
    token: undefined,
    balance: "0",
  },
  tokenBBalanceObject: {
    token: undefined,
    balance: "0",
  },
  tokenAAmount: "0",
  tokenBAmount: "0",
  minAmountLp: "0",
  lpTokenAmount: "0",
  minAmountTokenA: "0",
  minAmountTokenB: "0",
  isDepositQuoteLoading: false,
  slippageValue: "0.5",
  minAmountTokenAObject: {
    amount: "0",
    token: undefined,
  },
  minAmountTokenBObject: {
    amount: "0",
    token: undefined,
  },
  tokenLpInput: "0",
  lpTokenBalance: "0",
  depositContractConfig: undefined,
  withdrawContractConfig: undefined,
  setTokenABalance: (token: Token, balance: string) => {
    set((state) => ({
      tokenABalanceObject: { token: token, balance: balance },
    }));
  },
  setTokenBBalance: (token: Token, balance: string) => {
    set((state) => ({
      tokenBBalanceObject: { token: token, balance: balance },
    }));
  },
  setTokenAAmount: (val: string) => {
    set((state) => ({ tokenAAmount: val }));
  },
  setTokenBAmount: (val: string) => {
    set((state) => ({ tokenBAmount: val }));
  },
  setMinAmountLp: (val: string) => {
    set((state) => ({ minAmountLp: val }));
  },
  setLpTokenAmount: (val: string) => {
    set((state) => ({ lpTokenAmount: val }));
  },
  setMinAmountTokenA: (val: string) => {
    set((state) => ({ minAmountTokenA: val }));
  },
  setMinAmountTokenB: (val: string) => {
    set((state) => ({ minAmountTokenB: val }));
  },
  setIsDepositQuoteLoading: (loading: boolean) => {
    set((state) => ({ isDepositQuoteLoading: loading }));
  },
  setSlippageValue: (slippage) => {
    set((state) => ({ slippageValue: slippage ? slippage : "0.5" }));
  },
  setMinAmountAObject: (amount: string, token: Token) => {
    set((state) => ({
      minAmountTokenAObject: {
        amount: amount,
        token: token,
      },
    }));
  },
  setMinAmountBObject: (amount: string, token: Token) => {
    set((state) => ({
      minAmountTokenBObject: {
        amount: amount,
        token: token,
      },
    }));
  },
  setLpTokenInput: (amount: string) => {
    set((state) => ({ tokenLpInput: amount }));
  },
  setDepositContractConfig: (config: PoolContractType) => {
    set((state) => ({ depositContractConfig: config }));
  },
  setLpTokenBalance: (val: string) => {
    set((state) => ({ lpTokenBalance: val }));
  },
  setWithdrawContractConfig: (config: PoolContractType) => {
    set((state) => ({ withdrawContractConfig: config }));
  },
}));

export default useUniV2Store;
