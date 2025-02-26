import React, { useEffect, useState } from "react";
import "./styles.scss";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import useCurveStore from "@/store/curve-store";
import { useShallow } from "zustand/react/shallow";

import { CustomSpinner } from "@/components/common/CustomSpinner";

interface Props {
  loadingState: boolean;
  handleOpen: () => void;
}

export const ActionBtnContainer = ({ loadingState, handleOpen }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { tokenInputs, tokenBalances } = useCurveStore(
    useShallow((state) => ({
      tokenInputs: state.tokenInputs,
      tokenBalances: state.tokenBalances,
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
      } else if (tokenInputs.every((item) => Number(item.amount) === 0)) {
        return <div className="ActionBtnInActive">Enter Amount</div>;
      } else if (chainId && chainId !== 7000) {
        return (
          <div
            className="ActionBtnGreen"
            onClick={() => {
              switchChain({
                chainId: 7000,
              });
            }}
          >
            Switch Network
          </div>
        );
      } else if (
        tokenBalances.some(
          (el) =>
            el.token &&
            Number(tokenInputs[el.token?.curveIndex as number].amount) >
              Number(el.balance)
        )
      ) {
        return (
          <div className="ActionBtnInActive">
            Insufficient{" "}
            {
              tokenBalances.find(
                (el) =>
                  el.token &&
                  Number(tokenInputs[el.token?.curveIndex as number].amount) >
                    Number(el.balance)
              )?.token?.name
            }{" "}
            Balance
          </div>
        );
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleOpen}>
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
