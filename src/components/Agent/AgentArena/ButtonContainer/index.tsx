"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";

import Box from "@mui/material/Box";

import { useShallow } from "zustand/react/shallow";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useTransferStore from "@/store/transfer-store";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";
import useBTCWalletConnect from "@/hooks/common/useBTCWalletConnect";
import { ApolloError } from "@apollo/client";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { ChainIds } from "@/utils/enums";
import { CHAIN_IDS } from "@/utils/constants";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface Props {
  loadingState: boolean;
  errorState: ApolloError | undefined;
  handleMainButtonClick: () => void;
}

export const ButtonsContainerAgent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();

  const [networkValid, setNetworkValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkNetwork() {
      if (!publicKey) return;
      try {
        const version = await connection.getVersion();
        console.log("Connected to network:", version);
        if (
          !version["solana-core"] ||
          connection.rpcEndpoint.includes("devnet") ||
          connection.rpcEndpoint.includes("testnet")
        ) {
          setNetworkValid(false);
          disconnect(); // Force disconnect if not mainnet
        } else {
          setNetworkValid(true);
        }
      } catch (error) {
        setNetworkValid(false);
      }
    }

    checkNetwork();
  }, [publicKey, connection, disconnect]);

  useEffect(() => {
    setIsMounted(true);
  }, [address]);

  const { btcWalletAddress, btcWalletId } =
    useWalletConnectStore(
      useShallow((state) => ({
        btcWalletAddress: state.btcWalletAddress,
        btcWalletId: state.btcWalletId
      }))
    );

  const { networksStatus, handleChangeBTCNetwork } = useBTCWalletConnect();

  const {
    payChain,
    getChain,
  } = useTransferStore(
    useShallow((state) => ({
      payChain: state.payChain,
      getChain: state.getChain,
    }))
  );

  /**
   * Open wallet modal if wallet not connected.
   */
  const handleOpenWalletModal = () => {
    useWalletConnectStore.getState().handleOpen();
  };

  
 
  const renderButtonState = () => {
    if (payChain === ChainIds.BITCOIN) {
        if(!btcWalletAddress){
            return (
                <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
                  Connect BTC Wallet
                </Box>
              );
        }else{
          return null
        }
    } else if (payChain === CHAIN_IDS.SOLANA) {
      if (publicKey) {
        if (
          getChain === ChainIds.BITCOIN &&
          !btcWalletAddress
        ) {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect BTC Wallet
            </Box>
          );
        } else if (getChain !== ChainIds.BITCOIN && !address) {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect Wallet
            </Box>
          );
        }else{
          return null;
        }
      } else {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect Solana Wallet
            </Box>
          );
      }
    } else {
      if (address) {
        if (chainId && chainId !== payChain) {
          return (
            <Box
              className="ButtonVariantGreenAgent"
              onClick={() => {
                switchChain({ chainId: payChain });
              }}
            >
              Switch Network
            </Box>
          );
        }else if (
          getChain === ChainIds.BITCOIN &&
          !btcWalletAddress
        ) {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect BTC Wallet
            </Box>
          );
        } else if (getChain === ChainIds.SOLANA && !publicKey) {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect Solana Wallet
            </Box>
          );
        }else{
          return null
        }
      } else {
          return (
            <Box className="ButtonVariantGreenAgent" onClick={handleOpenWalletModal}>
              Connect Wallet
            </Box>
          );
      }
    }
  };
  if (!isMounted) {
    return null;
  }
  const buttonText=renderButtonState()
  return <Box className={buttonText===null ? "InactiveButtonContainerAgent" : "ButtonsContainerAgent"}>{buttonText}</Box>;
};
