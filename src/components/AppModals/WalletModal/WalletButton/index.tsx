import React from "react";
import "./styles.scss";
import Box from "@mui/material/Box";

import { useAccount, useConnect } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";

import CustomIcon from "@/components/common/CustomIcon";
import { useShallow } from "zustand/react/shallow";
import mixpanel from "mixpanel-browser";

interface Props {
  name: string;
  id: string | string[];
  image: string;
  walletURL: string;
  callBackFn: () => void;
  connectWalletFn?: () => void;
}

const WalletButton = ({
  name,
  id,
  image,
  walletURL,
  callBackFn,
  connectWalletFn,
}: Props) => {
  const { connect, connectors, isPending, isSuccess } = useConnect();
  const { acceptedTandC, isBouncing } = useWalletConnectStore(
    useShallow((state) => ({
      acceptedTandC: state.acceptedTandC,
      isBouncing: state.isBouncing,
    }))
  );

  /**
   * Connect wallet by passing connector id.
   * @param walletId Id for the connector
   * @param walletURL Fallback URL.
   */
  const connectWallet = async (
    walletId: string | string[],
    walletURL: string
  ) => {
    const connector = connectors.find((connector) => {
      if (typeof walletId === "string") {
        return connector.id === walletId;
      } else {
        return walletId.includes(connector.id);
      }
    });
    try {
      if (connector) {
        connect({
          connector,
        });
        mixpanel.track("wallet_connect_wallet_select",{
          wallet_name:`${walletId}`   
        })
      } else {
         window.open(walletURL, "_blank");
         mixpanel.track("wallet_connect_wallet_select",{
          wallet_name:`${walletId}`
        })
      }
    } catch (error) {
      console.log(error);
      window.open(walletURL, "_blank");
    } finally {
      callBackFn();
    }
  };

  const triggerAcceptCheckBoxAnimation = () => {
    useWalletConnectStore.getState().setBouncing(true);
    setTimeout(() => {
      useWalletConnectStore.getState().setBouncing(false);
    }, 1000);
  };

  return (
    <Box
      className="WalletBox"
      onClick={() => {
        if (!acceptedTandC) return;
        if (connectWalletFn) {
          connectWalletFn();
        } else connectWallet(id, walletURL);
      }}
    >
      <Box className="WalletLogo">
        <CustomIcon src={image} />
      </Box>
      {name}
      {!acceptedTandC && (
        <Box className="FadedBg" onClick={triggerAcceptCheckBoxAnimation}></Box>
      )}
    </Box>
  );
};

export default WalletButton;
