import { create } from "zustand";
import { Token } from "./types/token-type";
import { PoolContractType } from "./types/pool-type";

interface UniV3Store {
  token0BalanceObject: {
    token: Token | undefined;
    balance: string;
  };
  token1BalanceObject: {
    token: Token | undefined;
    balance: string;
  };
  isAnimateMinTickBorder: boolean;
  isAnimateMaxTickBorder: boolean;
  token0Amount: string;
  token1Amount: string;
  minAmountToken0: string;
  minAmountToken1: string;
  tokenWithdrawInput: string;
  token0WithdrawAmount: string;
  token1WithdrawAmount: string;
  minWithdrawAmountToken0: string;
  minWithdrawAmountToken1: string;
  withdrawLiquidity: string;
  isDepositQuoteLoading: boolean;
  slippageValue: string | number;
  currentTick: number;
  minTick: number;
  maxTick: number;
  lowerBoundTick: number;
  upperBoundTick: number;
  depositContractConfig: PoolContractType | undefined;
  withdrawContractConfig: PoolContractType | undefined;
  withdrawCollectFeeContractConfig: PoolContractType | undefined;
  collectFeeContractConfig: PoolContractType | undefined;
  increaseLiquidityContractConfig: PoolContractType | undefined;
  setIsAnimateMinTickBorder: () => void;
  setIsAnimateMaxTickBorder: () => void;
  setToken0Balance: (token: Token, balance: string) => void;
  setToken1Balance: (token: Token, balance: string) => void;
  setMinAmountToken0: (val: string) => void;
  setMinAmountToken1: (val: string) => void;
  setToken0Amount: (val: string) => void;
  setToken1Amount: (val: string) => void;
  setToken0WithdrawAmount: (val: string) => void;
  setToken1WithdrawAmount: (val: string) => void;
  setMinWithdrawAmountToken0: (val: string) => void;
  setMinWithdrawAmountToken1: (val: string) => void;
  setWithdrawLiquidity: (val: string) => void;
  setTokenWithdrawInput: (val: string) => void;
  setIsDepositQuoteLoading: (loading: boolean) => void;
  setSlippageValue: (slippage: string | number) => void;
  setCurrentTick: (val: number) => void;
  setMinTick: (val: number) => void;
  setMaxTick: (val: number) => void;
  setLowerBoundTick: (val: number) => void;
  setUpperBoundTick: (val: number) => void;
  setDepositContractConfig: (config: PoolContractType) => void;
  setWithdrawContractConfig: (config: PoolContractType) => void;
  setWithdrawCollectFeeContractConfig: (config: PoolContractType) => void;
  setCollectFeeContractConfig: (config: PoolContractType) => void;
  setIncreaseLiquidityContractConfig: (config: PoolContractType) => void;
}

const useUniV3Store = create<UniV3Store>((set) => ({
  token0BalanceObject: {
    token: undefined,
    balance: "0",
  },
  token1BalanceObject: {
    token: undefined,
    balance: "0",
  },
  isAnimateMinTickBorder: false,
  isAnimateMaxTickBorder: false,
  token0Amount: "0",
  token1Amount: "0",
  minAmountToken0: "0",
  minAmountToken1: "0",
  tokenWithdrawInput: "0",
  token0WithdrawAmount: "0",
  token1WithdrawAmount: "0",
  minWithdrawAmountToken0: "0",
  minWithdrawAmountToken1: "0",
  withdrawLiquidity: "0",
  isDepositQuoteLoading: false,
  slippageValue: "0.5",
  currentTick: 0,
  minTick: 0,
  maxTick: 0,
  lowerBoundTick: 0,
  upperBoundTick: 0,
  depositContractConfig: undefined,
  withdrawContractConfig: undefined,
  withdrawCollectFeeContractConfig: undefined,
  collectFeeContractConfig: undefined,
  increaseLiquidityContractConfig: undefined,
  setToken0Amount: (val: string) => {
    set((state) => ({ token0Amount: val }));
  },
  setToken1Amount: (val: string) => {
    set((state) => ({ token1Amount: val }));
  },
  setMinAmountToken0: (val: string) => {
    set((state) => ({ minAmountToken0: val }));
  },
  setMinAmountToken1: (val: string) => {
    set((state) => ({ minAmountToken1: val }));
  },
  setToken0Balance: (token: Token, balance: string) => {
    set((state) => ({
      token0BalanceObject: { token: token, balance: balance },
    }));
  },
  setToken1Balance: (token: Token, balance: string) => {
    set((state) => ({
      token1BalanceObject: { token: token, balance: balance },
    }));
  },
  setToken0WithdrawAmount: (val: string) => {
    set((state) => ({
      token0WithdrawAmount: val,
    }));
  },
  setToken1WithdrawAmount: (val: string) => {
    set((state) => ({
      token1WithdrawAmount: val,
    }));
  },
  setMinWithdrawAmountToken0: (val: string) => {
    set((state) => ({
      minWithdrawAmountToken0: val,
    }));
  },
  setMinWithdrawAmountToken1: (val: string) => {
    set((state) => ({
      minWithdrawAmountToken1: val,
    }));
  },
  setWithdrawLiquidity: (val: string) => {
    set((state) => ({
      withdrawLiquidity: val,
    }));
  },
  setTokenWithdrawInput: (val: string) => {
    set((state) => ({
      tokenWithdrawInput: val,
    }));
  },
  setIsDepositQuoteLoading: (loading: boolean) => {
    set((state) => ({
      isDepositQuoteLoading: loading,
    }));
  },
  setSlippageValue: (slippage) => {
    set((state) => ({ slippageValue: slippage ? slippage : "0.5" }));
  },
  setCurrentTick: (val: number) => {
    set((state) => ({ currentTick: val }));
  },
  setMinTick: (val: number) => {
    set((state) => ({ minTick: val }));
  },
  setMaxTick: (val: number) => {
    set((state) => ({ maxTick: val }));
  },
  setLowerBoundTick: (val: number) => {
    set((state) => ({ lowerBoundTick: val }));
  },
  setUpperBoundTick: (val: number) => {
    set((state) => ({ upperBoundTick: val }));
  },
  setDepositContractConfig: (config: PoolContractType) => {
    set((state) => ({ depositContractConfig: config }));
  },
  setWithdrawContractConfig: (config: PoolContractType) => {
    set((state) => ({ withdrawContractConfig: config }));
  },
  setWithdrawCollectFeeContractConfig: (config: PoolContractType) => {
    set((state) => ({ withdrawCollectFeeContractConfig: config }));
  },
  setCollectFeeContractConfig: (config: PoolContractType) => {
    set((state) => ({ collectFeeContractConfig: config }));
  },
  setIncreaseLiquidityContractConfig: (config: PoolContractType) => {
    set((state) => ({ increaseLiquidityContractConfig: config }));
  },
  setIsAnimateMinTickBorder: () => {
    set((state) => ({ isAnimateMinTickBorder: true }));
    setTimeout(() => set((state) => ({ isAnimateMinTickBorder: false })), 1000);
  },
  setIsAnimateMaxTickBorder: () => {
    set((state) => ({ isAnimateMaxTickBorder: true }));
    setTimeout(() => set((state) => ({ isAnimateMaxTickBorder: false })), 1000);
  },
}));

export default useUniV3Store;
