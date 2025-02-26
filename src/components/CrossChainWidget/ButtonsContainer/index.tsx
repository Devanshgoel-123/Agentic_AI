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
import mixpanel from "mixpanel-browser";
import { CHAIN_IDS } from "@/utils/constants";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface Props {
  loadingState: boolean;
  errorState: ApolloError | undefined;
  handleMainButtonClick: () => void;
}

export const ButtonsContainer = ({
  handleMainButtonClick,
  loadingState,
  errorState,
}: Props) => {
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
    if (!address) {
      mixpanel.track("app_launch_wallet_connect", {
        connected_disconnected: "disconnected",
      });
    } else {
      mixpanel.track("app_launch_wallet_connect", {
        connected_disconnected: "disconnected",
      });
    }
    setIsMounted(true);
  }, [address]);

  const { btcWalletAddress, destinationAddress, btcWalletId } =
    useWalletConnectStore(
      useShallow((state) => ({
        btcWalletAddress: state.btcWalletAddress,
        btcWalletId: state.btcWalletId,
        destinationAddress: state.destinationAddress,
      }))
    );

  const { networksStatus, handleChangeBTCNetwork } = useBTCWalletConnect();

  const {
    payChain,
    getChain,
    payTokenBalance,
    payToken,
    tokenInAmount,
    destChainGasFees,
    zetaChainGas,
    srcChainGasFees,
    payChainGasTokenId,
    payChainGasToken,
  } = useTransferStore(
    useShallow((state) => ({
      payChain: state.payChain,
      getChain: state.getChain,
      payTokenBalance: state.payTokenBalance,
      payToken: state.payToken,
      tokenInAmount: state.tokenInAmount,
      destChainGasFees: state.destChainGasFees,
      zetaChainGas: state.zetaChainGas,
      srcChainGasFees: state.srcChainGasFees,
      payChainGasTokenId: state.payChainGasTokenId,
      payChainGasToken: state.payChainGasToken,
    }))
  );

  const { data: dollarValue } = useFetchTokenDollarValue({
    tokenId: Number(payToken?.id),
    tokenAmount: tokenInAmount,
  });

  /**
   * Open wallet modal if wallet not connected.
   */
  const handleOpenWalletModal = () => {
    useWalletConnectStore.getState().handleOpen();
  };

  /**
   * Check input amount exceeds user balance.
   * @returns Boolean
   */
  const returnBalanceCheck = () => {
    return Number(tokenInAmount) > Number(payTokenBalance);
  };

  /**
   * Check user input covers for gas.
   * @returns
   */
  const returnBalanceForGasCheck = () => {
    return (
      Number(tokenInAmount) * Number(dollarValue) <
      Number(srcChainGasFees) + Number(zetaChainGas) + Number(destChainGasFees)
    );
  };

  /**
   * Check renderButton state to determine event value.
   * @returns
   */
  const determineMixpanelEvent = () => {
    if (!btcWalletAddress) {
      return { value: "Connect BTC Wallet" };
    }
    if (Number(tokenInAmount) > Number(payTokenBalance)) {
      return { value: "Insufficient Balance" };
    }
    if (chainId && chainId !== payChain) {
      return { value: `Switch Network to ${payToken?.name}` };
    }
    if (errorState) {
      return { value: "Invalid Transaction" };
    }
    return { value: "Review Transaction" };
  };

  const renderButtonState = () => {
    /**
     * Paychain = Bitcoin mainnet.
     * TODO - Figure out better method to do this.
     */
    if (payChain === ChainIds.BITCOIN) {
      if (btcWalletAddress) {
        mixpanel.track("swap_widget_button_load", determineMixpanelEvent());
        if (!tokenInAmount || Number(tokenInAmount) === 0) {
          return <Box className="ButtonVariantInactive">Enter Amount</Box>;
        } else if (loadingState) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else if (Number(tokenInAmount) > Number(payTokenBalance)) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (
          Number(tokenInAmount) * Number(dollarValue) <
          Number(srcChainGasFees) +
            Number(zetaChainGas) +
            Number(destChainGasFees)
        ) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (getChain === ChainIds.SOLANA && !publicKey) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Solana Wallet
            </Box>
          );
        } else if (getChain !== ChainIds.BITCOIN && !address) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Wallet
            </Box>
          );
        } else if (errorState) {
          return (
            <Box className="ButtonVariantInactive">Route not supported</Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              Review Transaction
            </Box>
          );
        }
      } else {
        if (loadingState) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect BTC Wallet
            </Box>
          );
        }
      }
    } else if (payChain === CHAIN_IDS.SOLANA) {
      if(getChain===CHAIN_IDS.SOLANA){
       return ( <Box className="ButtonVariantInactive">Route not Supported</Box>)
      }
      if (publicKey) {
        mixpanel.track("swap_widget_button_load", determineMixpanelEvent());
        if (!tokenInAmount || Number(tokenInAmount) === 0) {
          return <Box className="ButtonVariantInactive">Enter Amount</Box>;
        } else if (loadingState) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else if (Number(tokenInAmount) > Number(payTokenBalance)) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (
          Number(tokenInAmount) * Number(dollarValue) <
          Number(srcChainGasFees) +
            Number(zetaChainGas) +
            Number(destChainGasFees)
        ) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (
          getChain === ChainIds.BITCOIN &&
          !btcWalletAddress &&
          !destinationAddress
        ) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect BTC Wallet
            </Box>
          );
        } else if (getChain !== ChainIds.BITCOIN && !address) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Wallet
            </Box>
          );
        } else if (errorState) {
          return (
            <Box className="ButtonVariantInactive">Route not supported</Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              Review Transaction
            </Box>
          );
        }
      } else {
        if (loadingState) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Solana Wallet
            </Box>
          );
        }
      }
    } else {
      if (address) {
        mixpanel.track("swap_widget_button_load", determineMixpanelEvent());
        if (!tokenInAmount || Number(tokenInAmount) === 0) {
          return <Box className="ButtonVariantInactive">Enter Amount</Box>;
        } else if (loadingState) {
          return (
            <Box className="ButtonVariantGreen">
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else if (chainId && chainId !== payChain) {
          return (
            <Box
              className="ButtonVariantGreen"
              onClick={() => {
                switchChain({ chainId: payChain });
              }}
            >
              Switch Network
            </Box>
          );
        } else if (returnBalanceCheck()) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (payChain !== getChain && returnBalanceForGasCheck()) {
          return (
            <Box className="ButtonVariantInactive">Insufficient Balance</Box>
          );
        } else if (errorState) {
          return (
            <Box className="ButtonVariantInactive">Invalid Transaction</Box>
          );
        } else if (
          getChain === ChainIds.BITCOIN &&
          !btcWalletAddress &&
          !destinationAddress
        ) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect BTC Wallet
            </Box>
          );
        } else if (getChain === ChainIds.SOLANA && !publicKey) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Solana Wallet
            </Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              Review Transaction
            </Box>
          );
        }
      } else {
        if (loadingState) {
          return (
            <Box className="ButtonVariantGreen" onClick={handleMainButtonClick}>
              <CustomSpinner size={"20"} color="#323227" />
            </Box>
          );
        } else {
          return (
            <Box className="ButtonVariantGreen" onClick={handleOpenWalletModal}>
              Connect Wallet
            </Box>
          );
        }
      }
    }
  };
  if (!isMounted) {
    return null;
  }
  return <Box className="ButtonsContainer">{renderButtonState()}</Box>;
};
