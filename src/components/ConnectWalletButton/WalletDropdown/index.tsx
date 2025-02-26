import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useHandleToast from "@/hooks/common/useHandleToast";
import useWalletConnectStore from "@/store/wallet-store";
import { useWallet } from "@solana/wallet-adapter-react";

import CustomIcon from "@/components/common/CustomIcon";
import { ADDRESS_COPIED } from "@/utils/toasts";
import { TOAST_TYPE } from "@/utils/enums";
import { IoMdCopy } from "react-icons/io";
import { IoMdExit } from "react-icons/io";
import { WALLET_ICON } from "@/utils/images";
import mixpanel from "mixpanel-browser";
import { FaHistory } from "react-icons/fa";
import Link from "next/link";

interface Props {
  open: boolean;
  anchorEl: null | HTMLElement;
  evmWalletLogo: string;
  evmWalletAddress: `0x${string}` | undefined;
  handleDisconnectEvmWallet: () => void;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleClose: () => void;
}

export const WalletDropdown = ({
  open,
  evmWalletLogo,
  evmWalletAddress,
  handleDisconnectEvmWallet,
  handleClose,
  anchorEl,
}: Props) => {
  const { handleToast } = useHandleToast();
  const { publicKey, connected, wallet, disconnect, wallets } = useWallet();
  const { btcWalletAddress, handleOpen, btcWalletLogo, handleSetBtcAddress } =
    useWalletConnectStore();

  const track_event_wallet_disconnect = (chainType: string) => {
    const eventPayload = {
      disconnect: chainType === "EVM" ? "EVM_wallet" : "BTC_wallet",
    };

    mixpanel.track("wallet_connect_disconnect", eventPayload);
    if (chainType === "EVM") {
      handleClose();
      setTimeout(handleDisconnectEvmWallet, 100);
    } else {
      handleSetBtcAddress(undefined);
    }
  };

  const track_event_second_wallet_connect = (chainType: string) => {
    mixpanel.track("wallet_connect_second_connect_click", {
      second_chain_type: chainType,
    });
    handleOpen();
  };
  const returnConnectButtonState = () => {
    if (!evmWalletAddress) {
      return (
        <Box
          className="ConnectWalletDropdownBtn"
          onClick={() => {
            track_event_second_wallet_connect("EVM");
          }}
        >
          Connect EVM Wallet
        </Box>
      );
    } else if (!(publicKey && connected && wallet)) {
      return (
        <Box className="ConnectWalletDropdownBtn" onClick={handleOpen}>
          Connect Solana Wallet
        </Box>
      );
    } else if (!btcWalletAddress) {
      return (
        <Box
          className="ConnectWalletDropdownBtn"
          onClick={() => {
            track_event_second_wallet_connect("BTC");
          }}
        >
          Connect BTC Wallet
        </Box>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: anchorEl?.clientWidth } } }}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem onClick={handleClose}>
        {" "}
        <motion.div
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="WalletDropdownWrapper"
        >
          {evmWalletAddress && (
            <Box className="WalletDetails">
              <Box className="WalletDetailContainer">
                <Box className="WalletInfo">
                  <Box className="WalletLogo">
                    <CustomIcon src={evmWalletLogo} />
                  </Box>
                  <span className="WalletAddress">
                    {" "}
                    {evmWalletAddress?.substring(0, 3)}
                    ....
                    {evmWalletAddress?.substring(evmWalletAddress.length - 4)}
                  </span>
                </Box>
                <Box
                  className="WalletOpenIcon"
                  onClick={() => {
                    navigator.clipboard.writeText(evmWalletAddress!);
                    handleToast(
                      ADDRESS_COPIED.heading,
                      ADDRESS_COPIED.subHeading,
                      TOAST_TYPE.SUCCESS
                    );
                  }}
                >
                  <IoMdCopy />
                </Box>
              </Box>
              <Box className="WalletActionContainer">
                <Box
                  className="WalletActionBtn"
                  onClick={() => {
                    track_event_wallet_disconnect("EVM");
                  }}
                >
                  <Box className="ActionIcon">
                    <IoMdExit />
                  </Box>
                  <span className="WhiteText">Disconnect</span>
                </Box>
              </Box>
            </Box>
          )}
          <hr />
          {btcWalletAddress && (
            <Box className="WalletDetails">
              <Box className="WalletDetailContainer">
                <Box className="WalletInfo">
                  <Box className="WalletLogo">
                    <CustomIcon src={btcWalletLogo as string} />
                  </Box>
                  <span className="WalletAddress">
                    {" "}
                    {btcWalletAddress?.substring(0, 3)}
                    ....
                    {btcWalletAddress?.substring(btcWalletAddress.length - 4)}
                  </span>
                </Box>
                <Box
                  className="WalletOpenIcon"
                  onClick={() => {
                    navigator.clipboard.writeText(btcWalletAddress!);
                    handleToast(
                      ADDRESS_COPIED.heading,
                      ADDRESS_COPIED.subHeading,
                      TOAST_TYPE.SUCCESS
                    );
                  }}
                >
                  <IoMdCopy />
                </Box>
              </Box>
              <Box className="WalletActionContainer">
                <Box
                  className="WalletActionBtn"
                  onClick={() => {
                    track_event_wallet_disconnect("BTC");
                  }}
                >
                  <Box className="ActionIcon">
                    <IoMdExit />
                  </Box>
                  <span className="WhiteText">Disconnect</span>
                </Box>
              </Box>
            </Box>
          )}
          {publicKey && connected && wallet && (
            <Box className="WalletDetails">
              <Box className="WalletDetailContainer">
                <Box className="WalletInfo">
                  <Box className="WalletLogo">
                    <CustomIcon
                      src={wallet.adapter.icon ?? (WALLET_ICON as string)}
                    />
                  </Box>
                  <span className="WalletAddress">
                    {" "}
                    {publicKey.toBase58()?.substring(0, 3)}
                    ....
                    {publicKey
                      .toBase58()
                      ?.substring(publicKey.toBase58().length - 4)}
                  </span>
                </Box>
                <Box
                  className="WalletOpenIcon"
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey.toBase58()!);
                    handleToast(
                      ADDRESS_COPIED.heading,
                      ADDRESS_COPIED.subHeading,
                      TOAST_TYPE.SUCCESS
                    );
                  }}
                >
                  <IoMdCopy />
                </Box>
              </Box>
              <Box className="WalletActionContainer">
                <Box
                  className="WalletActionBtn"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  <Box className="ActionIcon">
                    <IoMdExit />
                  </Box>
                  <span className="WhiteText">Disconnect</span>
                </Box>
              </Box>
            </Box>
          )}
          {returnConnectButtonState()}
          <Link
            style={{ textDecoration: "none", width: "100%" }}
            href={"/activity"}
          >
            <div className="ConnectWalletDropdownBtnInActive">
              <FaHistory />
              History
            </div>
          </Link>
        </motion.div>
      </MenuItem>
    </Menu>
  );
};
