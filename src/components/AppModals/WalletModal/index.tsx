"use client";
import React, { useState } from "react";
import "./styles.scss";

import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grow from "@mui/material/Grow";
import useBTCWalletConnect from "@/hooks/common/useBTCWalletConnect";

import {
  supportedBTCWallets,
  supportedSolanaWallets,
  supportedWallets,
} from "@/utils/wallets";

import WalletSelector from "./WalletSelector";
import PolicyContainer from "./PolicyContainer";
import WalletButton from "./WalletButton";
import { ModalHeading } from "@/components/common/ModalHeading";
import { MODAL_STYLE } from "@/utils/constants";
import useSolanaWalletConnect from "@/hooks/common/useSolanaWalletConnect";
import mixpanel from "mixpanel-browser";

const WalletMobile = dynamic(() =>
  import("./WalletMobile").then((mod) => mod.WalletMobile)
);

interface Props {
  open: boolean;
  handleClose: () => void;
}

const WalletModal = ({ open, handleClose }: Props) => {
  const { handleWalletSelect } = useSolanaWalletConnect({
    callbackFn: handleClose,
  });

  const [type, setType] = useState<"all" | "btc" | "evm" | "svm">("all");

  const handleChangeType = (type: "all" | "btc" | "evm" | "svm") => {
    setType(type);
    mixpanel.track("wallet_connect_chain_type", {
      chain_type: `${type}`,
    });
  };

  const { handleBTCWalletConnect } = useBTCWalletConnect();

  /**
   * Function to add logo of BTC Wallet.
   * @param logo logo of XDefi
   */
  const connectXDEFIWallet = (id: string, logo: string) => {
    mixpanel.track("wallet_connect_walet_name", {
      wallet_name: `${id}`,
    });
    handleBTCWalletConnect(id, logo, handleClose);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={MODAL_STYLE}
    >
      <>
        <Box className="WalletModalWrapper">
          <Grow in={open}>
            <Box className="WalletModalContainer">
              <ModalHeading
                heading="Connect Wallet"
                handleClick={handleClose}
              />
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
                          connectXDEFIWallet(item.id, item.image);
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
            </Box>
          </Grow>
        </Box>
        <WalletMobile
          open={open}
          type={type}
          handleChangeType={handleChangeType}
          handleClose={handleClose}
        />
      </>
    </Modal>
  );
};

export default WalletModal;
