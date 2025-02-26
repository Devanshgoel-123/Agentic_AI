"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

import { useAccount, useConnections, useDisconnect } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { useBoolean } from "usehooks-ts";
import { useWallet } from "@solana/wallet-adapter-react";

import { ARROW_DOWN, COIN_BASE_LOGO, WALLET_ICON } from "@/utils/images";
import CustomIcon from "../common/CustomIcon";
import { EVM_WALLETS_ID } from "@/utils/enums";

const DynamicWalletModal = dynamic(
  () => import("../AppModals/WalletModal").then((mod) => mod.default),
  {
    ssr: false,
  }
);

const DynamicWalletDropdown = dynamic(
  () => import("./WalletDropdown").then((el) => el.WalletDropdown),
  {
    ssr: false,
  }
);

const ConnectWalletButton = () => {
  const ref = useRef(null);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connected, publicKey, wallet } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(ref.current);

  useEffect(() => {
    setAnchorEl(ref.current);
  }, [ref, setAnchorEl]);

  const {
    value: showDropdown,
    setTrue,
    setFalse: handleCloseDropdown,
  } = useBoolean(false);

  const handleOpenDropdown = () => {
    setAnchorEl(ref.current);
    setTrue();
  };

  const {
    open: openWalletModal,
    handleClose: handleCloseWalletModal,
    handleOpen: handleOpenWalletModal,
    btcWalletAddress,
    btcWalletLogo,
  } = useWalletConnectStore();

  const connections = useConnections();

  /**
   * Check address and return evm wallet logo.
   * @returns Connect evm wallet logo
   */
  const getEvmWalletLogo = () => {
    if (!address || !connections || connections.length === 0)
      return COIN_BASE_LOGO;
    else
      return connections[0].connector.id === EVM_WALLETS_ID.COINBASE
        ? "https://asset.eddy.finance/wallet/cbw.svg"
        : connections[0].connector.id === EVM_WALLETS_ID.BINANCE_WEB3 ||
          connections[0].connector.id === EVM_WALLETS_ID.BINANCE_WEB_CHROME
        ? "https://asset.eddy.finance/logo/binance.svg"
        : connections[0].connector.icon;
  };

  /**
   * Check address and btcWalletAddress to return logo.
   * @returns Connected wallet logo
   */
  const returnConnectedWalletLogo = () => {
    if (address) {
      return (getEvmWalletLogo() as string) ?? "/assets/icons/metamask.svg";
    } else if (btcWalletAddress) {
      return btcWalletLogo as string;
    } else if (wallet && connected && publicKey) {
      return wallet.adapter.icon ?? "/assets/icons/metamask.svg";
    } else {
      return WALLET_ICON;
    }
  };

  /**
   *
   * @returns Connected address in truncated mode.
   */
  const returnConnectWalletAddress = () => {
    if (address) {
      return (
        address?.substring(0, 5) +
        "..." +
        address?.substring(address.length - 5)
      );
    } else if (btcWalletAddress) {
      return (
        btcWalletAddress?.substring(0, 3) +
        "..." +
        btcWalletAddress?.substring(btcWalletAddress.length - 4)
      );
    } else if (wallet && connected && publicKey) {
      return (
        publicKey.toBase58()?.substring(0, 3) +
        "..." +
        publicKey.toBase58()?.substring(publicKey.toBase58().length - 4)
      );
    } else {
      return "Wallets connected";
    }
  };
  return (
    <div className="WalletButtonContainer">
      {(address && connections.length > 0) ||
      btcWalletAddress ||
      (wallet && connected && publicKey) ? (
        <div
          ref={ref}
          className="ConnectedStateButton"
          onClick={handleOpenDropdown}
        >
          <Box className="ConnectedWalletLogo">
            <CustomIcon src={returnConnectedWalletLogo()} />
          </Box>
          {returnConnectWalletAddress()}
          <Box
            style={{
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
            }}
            className="DropdownIcon"
          >
            <CustomIcon src={ARROW_DOWN} />
          </Box>
        </div>
      ) : (
        <div className="ConnectWalletButton" onClick={handleOpenWalletModal}>
          Connect Wallet
        </div>
      )}
      <DynamicWalletModal
        open={openWalletModal}
        handleClose={handleCloseWalletModal}
      />
      <DynamicWalletDropdown
        open={showDropdown}
        anchorEl={anchorEl}
        handleClick={handleOpenDropdown}
        handleClose={handleCloseDropdown}
        evmWalletLogo={getEvmWalletLogo() ?? "/assets/icons/metamask.svg"}
        evmWalletAddress={address}
        handleDisconnectEvmWallet={disconnect}
      />
    </div>
  );
};

export default ConnectWalletButton;
