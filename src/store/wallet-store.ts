import { create } from "zustand";
import { userRewardPoints } from "./types/token-type";
import { persist } from "zustand/middleware";

interface WalletStore {
  open: boolean;
  acceptedTandC: boolean;
  btcWalletAddress: string | undefined;
  solanaWalletAddress: string | undefined;
  destinationAddress: string | undefined;
  btcWalletLogo: string | undefined;
  btcWalletId: string | undefined;
  isBouncing: boolean;
  openCollectionModal: boolean;
  userRewardPoints: userRewardPoints[];
  setBouncing: (bouncing: boolean) => void;
  setUserRewardPoints: (rewards: userRewardPoints | {}) => void;
  handleOpen: () => void;
  handleClose: () => void;
  handleSetBtcWalletId: (id: string) => void;
  handleSetBtcAddress: (address: string | undefined) => void;
  handleSetSolanaAddress: (address: string | undefined) => void;
  handleSetBtcWalletLogo: (logo: string) => void;
  handleDisconnectBTCWallet: () => void;
  handleSetAccepted: (val: boolean) => void;
  handleSetDestinationAddress: (address: string | undefined) => void;
  handleOpenCollectionModal: () => void;
  handleCloseCollectionModal: () => void;
}

const useWalletConnectStore = create<WalletStore>()(
  persist(
    (set) => ({
      open: false,
      btcWalletAddress: undefined,
      solanaWalletAddress: undefined,
      btcWalletLogo: undefined,
      btcWalletId: undefined,
      acceptedTandC: false,
      isBouncing: false,
      destinationAddress: undefined,
      openCollectionModal: false,
      userRewardPoints: [],
      handleOpen: () => {
        set((state) => ({ open: true }));
      },
      handleClose: () => {
        set((state) => ({ open: false }));
      },
      handleSetBtcAddress: (address: string | undefined) => {
        set((state) => ({ btcWalletAddress: address }));
      },
      handleSetBtcWalletLogo: (logo: string) => {
        set((state) => ({ btcWalletLogo: logo }));
      },
      handleDisconnectBTCWallet: () => {
        set((state) => ({ btcWalletAddress: undefined }));
      },
      handleSetAccepted: (val: boolean) => {
        set((state) => ({ acceptedTandC: val }));
      },
      setBouncing: (bouncing: boolean) => {
        set((state) => ({ isBouncing: bouncing }));
      },
      setUserRewardPoints: (rewards: userRewardPoints | {}) => {
        set((state) => ({
          userRewardPoints:
            Object.keys(rewards).length !== 0
              ? [...state.userRewardPoints, rewards as userRewardPoints]
              : [],
        }));
      },
      handleSetBtcWalletId: (id: string) => {
        set((state) => ({ btcWalletId: id }));
      },
      handleSetDestinationAddress: (address: string | undefined) => {
        set((state) => ({ destinationAddress: address }));
      },
      handleOpenCollectionModal: () => {
        set((state) => ({ openCollectionModal: true }));
      },
      handleCloseCollectionModal: () => {
        set((state) => ({ openCollectionModal: false }));
      },
      handleSetSolanaAddress: (address: string | undefined) => {
        set((state) => ({ solanaWalletAddress: address }));
      },
    }),
    {
      name: "userRewardPointsStorage",
      partialize: (state) => ({
        userRewardPoints: state.userRewardPoints,
      }),
    }
  )
);

export default useWalletConnectStore;
