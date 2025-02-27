import { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";
import useHandleToast from "./useHandleToast";
import { WALLET_CONNECT_ERROR, WALLET_REJECT } from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";

interface Props {
  callbackFn: () => void;
}

const useSolanaWalletConnect = ({ callbackFn }: Props) => {
  const { handleSetSolanaAddress } = useWalletConnectStore(
    useShallow((state) => ({
      handleSetSolanaAddress: state.handleSetSolanaAddress,
    }))
  );
  const { handleToast } = useHandleToast();
  const { connection } = useConnection();
  const { select, publicKey, disconnect } = useWallet();

  useEffect(() => {
    handleSetSolanaAddress(publicKey?.toBase58()!);
  }, [publicKey]);

  /**
   * Function to connect solana wallet.
   * @param walletName UID of solana wallet.
   */
  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
      } catch (error) {
        if (error === "User rejected the request.") {
          handleToast(
            WALLET_REJECT.heading,
            WALLET_REJECT.subHeading,
            TOAST_TYPE.ERROR
          );
        } else {
          handleToast(
            WALLET_CONNECT_ERROR.heading,
            WALLET_CONNECT_ERROR.subHeading,
            TOAST_TYPE.ERROR
          );
        }
      } finally {
        callbackFn();
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  return {
    handleWalletSelect,
    handleDisconnect,
  };
};

export default useSolanaWalletConnect;
