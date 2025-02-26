import React from "react";
import "./styles.scss";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useUniV3Store from "@/store/univ3-store";
import { useShallow } from "zustand/react/shallow";

import { CustomSpinner } from "@/components/common/CustomSpinner";
import { useSearchParams } from "next/navigation";

interface Props {
  poolChainId: number;
  handleOpenPreviewModal: () => void;
}

export const ActionButtonContainer = ({
  poolChainId,
  handleOpenPreviewModal,
}: Props) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const searchParams = useSearchParams();
  const {
    token0BalanceObject,
    token1BalanceObject,
    token0Amount,
    token1Amount,
    isDepositQuoteLoading,
    minTick,
    maxTick,
    currentTick,
  } = useUniV3Store(
    useShallow((state) => ({
      token0BalanceObject: state.token0BalanceObject,
      token1BalanceObject: state.token1BalanceObject,
      token0Amount: state.token0Amount,
      token1Amount: state.token1Amount,
      isDepositQuoteLoading: state.isDepositQuoteLoading,
      minTick: state.minTick,
      maxTick: state.maxTick,
      currentTick: state.currentTick,
    }))
  );

  const returnTickCheck = () => {
    if (Boolean(searchParams.get("current"))) {
      return (
        Number(searchParams.get("tickLower")) < currentTick &&
        Number(searchParams.get("tickUpper")) > currentTick
      );
    } else {
      return (
        useUniV3Store.getState().minTick < currentTick &&
        useUniV3Store.getState().maxTick > currentTick
      );
    }
  };

  const renderActionBtn = () => {
    if (address) {
      if (isDepositQuoteLoading) {
        return (
          <div className="ActionBtnGreen">
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (
        !token0Amount ||
        (Number(token0Amount) === 0 && returnTickCheck())
      ) {
        return (
          <div className="ActionBtnInActive">
            Enter {token0BalanceObject.token?.name} Amount
          </div>
        );
      } else if (
        !token1Amount ||
        (Number(token1Amount) === 0 && returnTickCheck())
      ) {
        return (
          <div className="ActionBtnInActive">
            Enter {token1BalanceObject.token?.name} Amount
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
      } else if (Number(token0Amount) > Number(token0BalanceObject.balance)) {
        return (
          <div className="ActionBtnInActive">
            Insufficient {token0BalanceObject.token?.name} Balance
          </div>
        );
      } else if (Number(token1Amount) > Number(token1BalanceObject.balance)) {
        return (
          <div className="ActionBtnInActive">
            Insufficient {token1BalanceObject.token?.name} Balance
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleOpenPreviewModal}>
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
  return <div className="ActionBtnContainer">{renderActionBtn()}</div>;
};
