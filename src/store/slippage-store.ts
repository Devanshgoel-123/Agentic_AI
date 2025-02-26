import { create } from "zustand";

interface SlippageStore {
  open: boolean;
  autoMaticSlippage: boolean;
  slippageValue: string | number;
  handleOpen: () => void;
  handleClose: () => void;
  toggleAutoMaticSlippage: () => void;
  setSlippageValue: (slippage: string | number) => void;
}

const useSlippageStore = create<SlippageStore>((set) => ({
  open: false,
  slippageValue: "0.5",
  autoMaticSlippage: false,
  handleOpen: () => {
    set((state) => ({ open: true }));
  },
  handleClose: () => {
    set((state) => ({ open: false }));
  },
  toggleAutoMaticSlippage: () => {
    set((state) => ({ autoMaticSlippage: !state.autoMaticSlippage }));
  },
  setSlippageValue: (slippage) => {
    set((state) => ({ slippageValue: slippage ? slippage : "0.5" }));
  },
}));

export default useSlippageStore;
