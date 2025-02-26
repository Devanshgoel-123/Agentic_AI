import React from "react";
import "./styles.scss";

import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";

import useBTCWalletConnect from "@/hooks/common/useBTCWalletConnect";
import useSolanaWalletConnect from "@/hooks/common/useSolanaWalletConnect";

import { ModalHeading } from "@/components/common/ModalHeading";
import WalletSelector from "../WalletSelector";
import {
  supportedBTCWallets,
  supportedSolanaWallets,
  supportedWallets,
} from "@/utils/wallets";
import WalletButton from "../WalletButton";
import PolicyContainer from "../PolicyContainer";

interface Props {
  type: string;
  handleChangeType: (type: "all" | "btc" | "evm" | "svm") => void;
  open: boolean;
  handleClose: () => void;
}

export const WalletMobile = ({
  handleClose,
  open,
  type,
  handleChangeType,
}: Props) => {
  const { handleBTCWalletConnect } = useBTCWalletConnect();
  const { handleWalletSelect } = useSolanaWalletConnect({
    callbackFn: handleClose,
  });

  /**
   * Function to add logo of BTC Wallet.
   * @param logo logo of XDefi
   */
  const connectBTCWallet = (logo: string, id: string) => {
    handleBTCWalletConnect(id, logo, handleClose);
  };
  return (
    <Box className="WalletMobileWrapper">
      <Slide
        easing={{
          enter: "cubic-bezier(0, 1.5, .8, 1)",
          exit: "linear",
        }}
        timeout={500}
        direction="up"
        in={open}
      >
        <div className="WalletModalContainer">
          <ModalHeading heading="Connect Wallet" handleClick={handleClose} />
          <Box className="WalletWrapper">
            <WalletSelector
              currentType={type}
              handleChangeType={handleChangeType}
            />
            <Box className="WalletContainer">
              {(type === "all" || type === "evm") &&
                supportedWallets.map((item, index) => (
                  <WalletButton
                    key={index}
                    name={item.name}
                    id={item.id}
                    image={item.image}
                    walletURL={item.walletURL}
                    callBackFn={handleClose}
                  />
                ))}
              {(type === "all" || type === "btc") &&
                supportedBTCWallets.map((item) => (
                  <WalletButton
                    key={item.id}
                    name={item.name}
                    id={item.id}
                    image={item.image}
                    walletURL={item.walletURL}
                    callBackFn={handleClose}
                    connectWalletFn={() => {
                      connectBTCWallet(item.image, item.id);
                    }}
                  />
                ))}
              {(type === "all" || type === "svm") &&
                supportedSolanaWallets.map((item) => (
                  <WalletButton
                    key={item.id}
                    name={item.name}
                    id={item.id}
                    image={item.image}
                    walletURL={item.walletURL}
                    callBackFn={handleClose}
                    connectWalletFn={() => {
                      handleWalletSelect(item.name);
                    }}
                  />
                ))}
            </Box>
          </Box>
          <PolicyContainer />
        </div>
      </Slide>
    </Box>
  );
};
