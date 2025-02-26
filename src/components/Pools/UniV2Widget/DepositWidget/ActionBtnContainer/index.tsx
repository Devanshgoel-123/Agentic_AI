import React, { useEffect, useState } from "react";
import "./styles.scss";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useUniV2Store from "@/store/univ2-store";
import { useShallow } from "zustand/react/shallow";

import { CustomSpinner } from "@/components/common/CustomSpinner";

interface Props {
  poolChainId: number;
  handleOpenTransactionModal: () => void;
}

export const ActionBtnContainer = ({
  poolChainId,
  handleOpenTransactionModal,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const {
    tokenABalanceObject,
    tokenBBalanceObject,
    tokenAAmount,
    tokenBAmount,
    isDepositQuoteLoading,
  } = useUniV2Store(
    useShallow((state) => ({
      tokenABalanceObject: state.tokenABalanceObject,
      tokenBBalanceObject: state.tokenBBalanceObject,
      tokenAAmount: state.tokenAAmount,
      tokenBAmount: state.tokenBAmount,
      isDepositQuoteLoading: state.isDepositQuoteLoading,
    }))
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderActionBtn = () => {
    if (address) {
      if (isDepositQuoteLoading) {
        return (
          <div className="ActionBtnGreen">
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (!tokenAAmount || Number(tokenAAmount) === 0) {
        return (
          <div className="ActionBtnInActive">
            Enter {tokenABalanceObject.token?.name} Amount
          </div>
        );
      } else if (!tokenBAmount || Number(tokenBAmount) === 0) {
        return (
          <div className="ActionBtnInActive">
            Enter {tokenBBalanceObject.token?.name} Amount
          </div>
        );
      } else if (chainId && chainId !== Number(poolChainId)) {
        return (
          <div
            className="ActionBtnGreen"
            onClick={() => {
              switchChain({
                chainId: Number(poolChainId),
              });
            }}
          >
            Switch Network
          </div>
        );
      } else if (Number(tokenAAmount) > Number(tokenABalanceObject.balance)) {
        return (
          <div className="ActionBtnInActive">
            Insufficient {tokenABalanceObject.token?.name} Balance
          </div>
        );
      } else if (Number(tokenBAmount) > Number(tokenBBalanceObject.balance)) {
        return (
          <div className="ActionBtnInActive">
            Insufficient {tokenBBalanceObject.token?.name} Balance
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleOpenTransactionModal}>
            Preview Deposit
          </div>
        );
      }
    } else {
      return (
        <div
          className="ActionBtnGreen"
          onClick={() => {
            useWalletConnectStore.getState().handleOpen();
          }}
        >
          Connect Wallet
        </div>
      );
    }
  };

  if (!isMounted) {
    return null;
  }
  return <>{renderActionBtn()}</>;
};
