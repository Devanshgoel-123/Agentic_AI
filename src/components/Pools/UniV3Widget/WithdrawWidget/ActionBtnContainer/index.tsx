import React, { useEffect, useState } from "react";
import "./styles.scss";

import { useShallow } from "zustand/react/shallow";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useUniV3Store from "@/store/univ3-store";
import useWalletConnectStore from "@/store/wallet-store";

import { CustomSpinner } from "@/components/common/CustomSpinner";
import { convertBigIntToUIFormat } from "@/utils/number";
import { Token } from "@/store/types/token-type";

interface Props {
  token0: Token;
  token1: Token;
  token0Dollar: number;
  token1Dollar: number;
  loadingState: boolean;
  poolChainId: number;
  removeLiquidityLoading: boolean;
  collectFeeLoading: boolean;
  handleMainBtnClick: () => void;
}

export const ActionBtnContainer = ({
  loadingState,
  poolChainId,
  token0,
  token1,
  token0Dollar,
  token1Dollar,
  removeLiquidityLoading,
  collectFeeLoading,
  handleMainBtnClick,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { token0WithdrawAmount, token1WithdrawAmount, tokenWithdrawInput } =
    useUniV3Store(
      useShallow((state) => ({
        tokenWithdrawInput: state.tokenWithdrawInput,
        token0WithdrawAmount: state.token0WithdrawAmount,
        token1WithdrawAmount: state.token1WithdrawAmount,
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
            {collectFeeLoading ||
              (removeLiquidityLoading && (
                <div className="TransactionCount">
                  {removeLiquidityLoading
                    ? "(1/2)"
                    : collectFeeLoading
                    ? "(2/2)"
                    : ""}
                </div>
              ))}
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (Number(tokenWithdrawInput) === 0) {
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
      } else {
        return (
          <div className="ActionBtnGreen" onClick={handleMainBtnClick}>
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
