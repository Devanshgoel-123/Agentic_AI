import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useUniV2Store from "@/store/univ2-store";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";

import { CustomSpinner } from "@/components/common/CustomSpinner";

interface Props {
  poolChainId: number;
  loadingState: boolean;
  handleOpenTransactionModal: () => void;
}

export const ActionBtnContainer = ({
  poolChainId,
  loadingState,
  handleOpenTransactionModal,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { tokenLpInput, lpTokenBalance } = useUniV2Store(
    useShallow((state) => ({
      tokenLpInput: state.tokenLpInput,
      lpTokenBalance: state.lpTokenBalance,
    }))
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Render button states after checking all the conditions.
   * @returns JSX
   */
  const renderActionBtn = () => {
    if (address) {
      if (loadingState) {
        return (
          <div className="ActionBtnGreen">
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (!tokenLpInput || Number(tokenLpInput) === 0) {
        return <div className="ActionBtnInActive">Enter LP Token Amount</div>;
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
          <div className="ActionBtnGreen" onClick={handleOpenTransactionModal}>
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
