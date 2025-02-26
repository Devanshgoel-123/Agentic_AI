import React, { useEffect, useState } from "react";
import "./styles.scss";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useCurveStore from "@/store/curve-store";
import { useShallow } from "zustand/react/shallow";

import { CustomSpinner } from "@/components/common/CustomSpinner";

interface Props {
  loadingState: boolean;
  poolChainId: number;
  handleOpen: () => void;
}

export const ActionBtnContainer = ({
  loadingState,
  handleOpen,
  poolChainId,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { tokenLpInput, lpTokenBalance } = useCurveStore(
    useShallow((state) => ({
      tokenLpInput: state.tokenLpInput,
      lpTokenBalance: state.lpTokenBalance,
    }))
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderActionBtn = () => {
    if (address) {
      if (loadingState) {
        return (
          <div className="ActionBtnGreen">
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (Number(tokenLpInput) === 0) {
        return <div className="ActionBtnInActive">Enter Amount</div>;
      } else if (chainId && chainId !== poolChainId) {
        return (
          <div
            className="ActionBtnGreen"
            onClick={() => {
              switchChain({
                chainId: poolChainId,
              });
            }}
          >
            Switch Network
          </div>
        );
      } else if (Number(tokenLpInput) > Number(lpTokenBalance)) {
        return <div className="ActionBtnInActive">Insufficient Balance</div>;
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleOpen}>
            Preview Withdrawal
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
