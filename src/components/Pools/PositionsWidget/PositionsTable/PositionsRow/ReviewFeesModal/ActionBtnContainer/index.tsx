import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { CustomSpinner } from "@/components/common/CustomSpinner";

interface Props {
  loadingState: boolean;
  totalFee: string;
  poolChainId: number;
  handleMainFn: () => void;
}

export const ActionBtnContainer = ({
  loadingState,
  poolChainId,
  totalFee,
  handleMainFn,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

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
      } else if (Number(totalFee) === 0) {
        return <div className="ActionBtnInActive">No fee collected</div>;
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
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleMainFn}>
            Confirm Withdrawal
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
  return <div className="ActionBtnContainer">{renderActionBtn()}</div>;
};
