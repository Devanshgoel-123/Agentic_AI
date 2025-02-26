import { create } from "zustand";
import { Token } from "./types/token-type";
import { PoolContractType } from "./types/pool-type";

export interface CurveTokenBalanceObject {
  token: Token | undefined;
  balance: string;
}

export interface TokenInputObject {
  token: Token | undefined;
  amount: string;
}

export interface MinTokenAmountObject {
  curveIndex: number;
  amount: string;
  minAmount: string;
  token: {
    id: number;
    name: string;
    tokenLogo: string;
    decimal: number;
    isNative: boolean;
    curveIndex: number;
    chain: {
      chainId: number;
      name: string;
      chainLogo: string;
    };
  };
}

interface CurveStore {
  tokenBalances: CurveTokenBalanceObject[];
  tokenInputs: TokenInputObject[];
  tokenLpAmount: string;
  minLpAmount: string;
  depositContractConfig: PoolContractType | undefined;
  withdrawContractConfig: PoolContractType | undefined;
  tokenLpInput: string;
  lpTokenBalance: string;
  minAmountTokens: MinTokenAmountObject[];
  minAmountOneToken: MinTokenAmountObject | undefined;
  slippageValue: string | number;
  setTokenBalance: (val: string, index: number, token: Token) => void;
  setTokenInput: (val: string, index: number, token: Token) => void;
  setTokenLpAmount: (val: string) => void;
  setMinLpAmount: (val: string) => void;
  setDepositContractConfig: (config: PoolContractType) => void;
  setLpTokenBalance: (val: string) => void;
  setLpTokenInput: (amount: string) => void;
  setMinAmountTokens: (minAmountTokens: MinTokenAmountObject[]) => void;
  setMinAmountOneToken: (minAmountToken: MinTokenAmountObject) => void;
  setWithdrawContractConfig: (config: PoolContractType) => void;
  setSlippageValue: (slippage: string | number) => void;
}

const useCurveStore = create<CurveStore>((set) => ({
  tokenBalances: Array(10).fill({
    token: undefined,
    balance: "0",
  }),
  tokenInputs: Array(10).fill({
    token: undefined,
    amount: "0",
  }),
  tokenLpAmount: "0",
  minLpAmount: "0",
  depositContractConfig: undefined,
  withdrawContractConfig: undefined,
  tokenLpInput: "0",
  lpTokenBalance: "0",
  minAmountTokens: [],
  minAmountOneToken: undefined,
  slippageValue: "0.5",
  setTokenBalance: (val: string, index: number, token: Token) => {
    set((state) => ({
      tokenBalances: state.tokenBalances.map((balanceObj, i) =>
        i === index ? { ...balanceObj, balance: val, token: token } : balanceObj
      ),
    }));
  },
  setTokenInput: (val: string, index: number, token: Token) => {
    set((state) => ({
      tokenInputs: state.tokenInputs.map((inputObj, i) =>
        i === index ? { ...inputObj, amount: val, token: token } : inputObj
      ),
    }));
  },
  setMinLpAmount: (val: string) => {
    set((state) => ({ minLpAmount: val }));
  },
  setTokenLpAmount: (val: string) => {
    set((state) => ({ tokenLpAmount: val }));
  },
  setDepositContractConfig: (config: PoolContractType) => {
    set((state) => ({ depositContractConfig: config }));
  },
  setWithdrawContractConfig: (config: PoolContractType) => {
    set((state) => ({ withdrawContractConfig: config }));
  },
  setLpTokenInput: (amount: string) => {
    set((state) => ({ tokenLpInput: amount }));
  },
  setLpTokenBalance: (val: string) => {
    set((state) => ({ lpTokenBalance: val }));
  },
  setMinAmountTokens: (minAmountTokens: MinTokenAmountObject[]) => {
    set((state) => ({ minAmountTokens: minAmountTokens }));
  },
  setMinAmountOneToken: (minAmountToken: MinTokenAmountObject) => {
    set((state) => ({ minAmountOneToken: minAmountToken }));
  },
  setSlippageValue: (slippage) => {
    set((state) => ({ slippageValue: slippage ? slippage : "0.5" }));
  },
}));

export default useCurveStore;
