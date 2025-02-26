"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import { useShallow } from "zustand/react/shallow";
import useFetchRemoveLiquidityUniV3Quote from "@/hooks/Pools/useFetchRemoveLiquidityUniV3Quote";
import useUniV3Store from "@/store/univ3-store";
import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchWithdrawContractConfigUniV3 from "@/hooks/Pools/useFetchWithdrawContractConfigUniV3";
import useFetchWithdrawCollectFeeContractConfig from "@/hooks/Pools/useFetchWithdrawCollectFeeContractConfig";
import useSendRemoveLiquidityUniV3 from "@/hooks/Pools/useSendRemoveLiquidityUniV3";
import useSendWithdrawCollectFeeTransaction from "@/hooks/Pools/useSendWithdrawCollectFeeTransaction";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import { UniV3PoolLabel } from "../../PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import { PoolSummary } from "./PoolSummary";
import GradientText from "@/components/common/GradientText";
import { Token } from "@/store/types/token-type";
import { convertBigIntToUIFormat } from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { ActionBtnContainer } from "./ActionBtnContainer";
import { SlippageModal } from "../SlippageModal";
import { IoSettingsOutline } from "react-icons/io5";

interface Props {
  openModal: boolean;
  slug: string;
  nftId: string;
  token0: Token;
  token1: Token;
  token0Dollar: number;
  token1Dollar: number;
  depositedToken0: number;
  depositedToken1: number;
  collectedFeesToken0: number;
  collectedFeesToken1: number;
  contract: string;
  poolName: string;
  handleClose: () => void;
}

export const WithdrawWidget = ({
  openModal,
  slug,
  nftId,
  token0,
  token1,
  token0Dollar,
  token1Dollar,
  handleClose,
  depositedToken0,
  depositedToken1,
  collectedFeesToken0,
  collectedFeesToken1,
  contract,
  poolName,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputPercentage, setInputPercentage] = useState<string>("0");
  const [value, setValue] = useState<string>("0");

  const {
    loading: withdrawContractConfigLoading,
    error: withdrawContractConfigError,
  } = useFetchWithdrawContractConfigUniV3({
    nftId: nftId,
    contract: contract,
  });

  const {
    loading: withdrawCollectFeeContractConfigLoading,
    error: withdrawCollectFeeContractConfigError,
  } = useFetchWithdrawCollectFeeContractConfig({
    nftId: nftId,
    contract: contract,
    isSkip: !openModal,
  });

  const handleCollectFeeTransactionCallBack = () => {
    handleClose();
  };

  const { loading: collectFeeLoading, sendCollectFeeTransaction } =
    useSendWithdrawCollectFeeTransaction({
      poolChainId: 7000,
      callBackFn: handleCollectFeeTransactionCallBack,
    });

  /**
   * Call back function to call after remove liquidity is successful.
   * Call collect fee transaction function.
   */
  const handleRemoveLiquidityCallBack = () => {
    sendCollectFeeTransaction();
  };

  const { loading: removeLiquidityLoading, sendRemoveLiquidityTransaction } =
    useSendRemoveLiquidityUniV3({
      token0: token0,
      token1: token1,
      poolName: poolName,
      poolChainId: 7000,
      callBackFn: handleRemoveLiquidityCallBack,
    });

  const handleMainBtnClick = () => {
    sendRemoveLiquidityTransaction();
  };

  const {
    open,
    handleClose: handleCloseSlippageModal,
    handleOpen,
  } = useCustomModal();

  const { token0WithdrawAmount, token1WithdrawAmount, slippage } =
    useUniV3Store(
      useShallow((state) => ({
        slippage: state.slippageValue,
        token0WithdrawAmount: state.token0WithdrawAmount,
        token1WithdrawAmount: state.token1WithdrawAmount,
      }))
    );

  const { loading, error } = useFetchRemoveLiquidityUniV3Quote({
    slug: slug,
    slippage: Number(slippage),
    nftId: Number(nftId),
    percentage: Number(inputPercentage) === 0 ? 100 : Number(inputPercentage),
  });

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV3Store.getState().setTokenWithdrawInput(value);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  /**
   * Return total balance of user in dollars.
   * @returns Token0 Balance + Token1 Balance.
   */
  const returnTotalBalanceOfUser = () => {
    const token0Balance =
      Number(convertBigIntToUIFormat(token0WithdrawAmount, token0.decimal)) *
      Number(token0Dollar);
    const token1Balance =
      Number(convertBigIntToUIFormat(token1WithdrawAmount, token1.decimal)) *
      Number(token1Dollar);
    return token0Balance + token1Balance;
  };

  /**
   * Show loader for balance fetch
   * @returns JSX for loader and balance.
   */
  const returnBalanceOfUser = () => {
    if (loading) {
      return <CustomTextLoader text="0.00" />;
    } else {
      return returnTotalBalanceOfUser().toFixed(8);
    }
  };

  /**
   * Function to prevent adding faulty values.
   * @param e Input event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (!/^[0-9.]$/.test(key) && key !== "Backspace") {
      e.preventDefault();
    }
    if (key === "." && value.includes(".")) {
      e.preventDefault();
    }
  };

  /**
   * Function to store user input.
   * @param e Input event.
   * @returns
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }
    setValue(sanitizedValue);
  };

  /**
   * Update user input as per selected percentage.
   * @param percent Selected Percentage.
   */
  const updateInputPercentage = (percent: string) => {
    setInputPercentage(percent);
    const totalBalance = returnTotalBalanceOfUser().toString();
    setValue((prev) => {
      const value = ((Number(totalBalance) * Number(percent)) / 100).toString();
      return value;
    });
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = ((Number(totalBalance) * Number(percent)) / 100).toString();
      input.dispatchEvent(event);
    }
  };

  return (
    <div className="UniV3WithdrawWidgetWrapper">
      <div className="HeadingContainer">
        <div className="BackBtn" onClick={handleClose}>
          <CustomIcon src={ARROW_LEFT} />
        </div>
        <span className="Heading">ETH/ZETA</span>
        <UniV3PoolLabel />
      </div>
      <div className="PoolActionsWrapper">
        <div className="PoolInfoContainer">
          <PoolSummary
            loading={loading}
            token0={token0}
            token1={token1}
            token0Dollar={token0Dollar}
            token1Dollar={token1Dollar}
            depositedToken0={depositedToken0}
            depositedToken1={depositedToken1}
            collectedFeesToken0={collectedFeesToken0}
            collectedFeesToken1={collectedFeesToken1}
          />
        </div>
        <div className="PoolActionContainer">
          <div className="HeadingContainer">
            <div className="Heading">
              <GradientText text="Remove Liquidity" />
            </div>
            <div className="BackBtn" onClick={handleOpen}>
              <IoSettingsOutline />
            </div>
          </div>
          <div className="TokenInputWrapper">
            <div className="TokenInputContainer">
              <div className="InputContainer">
                <input
                  ref={inputRef}
                  placeholder="0.00"
                  className="Token-Input"
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                />
              </div>
            </div>
            <div className="BalanceContainer">
              <span className="BalanceValue">
                Balance: {returnBalanceOfUser()} USD
              </span>
            </div>
          </div>
          <div className="TokenInputAction">
            <div
              style={{
                background:
                  Number(inputPercentage) === 25 ? "#1E1E1E" : "transparent",
                border:
                  Number(inputPercentage) === 25
                    ? "1px solid #7BF179"
                    : "1px solid #1F1F1F",
              }}
              className="InputAction"
              onClick={() => updateInputPercentage("25")}
            >
              25%
            </div>
            <div
              style={{
                background:
                  Number(inputPercentage) === 50 ? "#1E1E1E" : "transparent",
                border:
                  Number(inputPercentage) === 50
                    ? "1px solid #7BF179"
                    : "1px solid #1F1F1F",
              }}
              className="InputAction"
              onClick={() => updateInputPercentage("50")}
            >
              50%
            </div>
            <div
              style={{
                background:
                  Number(inputPercentage) === 75 ? "#1E1E1E" : "transparent",
                border:
                  Number(inputPercentage) === 75
                    ? "1px solid #7BF179"
                    : "1px solid #1F1F1F",
              }}
              className="InputAction"
              onClick={() => updateInputPercentage("75")}
            >
              75%
            </div>
            <div
              style={{
                background:
                  Number(inputPercentage) === 100 ? "#1E1E1E" : "transparent",
                border:
                  Number(inputPercentage) === 100
                    ? "1px solid #7BF179"
                    : "1px solid #1F1F1F",
              }}
              className="InputAction"
              onClick={() => updateInputPercentage("100")}
            >
              100%
            </div>
          </div>
          <ActionBtnContainer
            loadingState={
              loading ||
              withdrawContractConfigLoading ||
              withdrawCollectFeeContractConfigLoading ||
              removeLiquidityLoading ||
              collectFeeLoading
            }
            token0={token0}
            token1={token1}
            token0Dollar={token0Dollar}
            token1Dollar={token1Dollar}
            poolChainId={7000} //TODO: Make this dynamic
            removeLiquidityLoading={removeLiquidityLoading}
            collectFeeLoading={collectFeeLoading}
            handleMainBtnClick={handleMainBtnClick}
          />
        </div>
      </div>
      <SlippageModal open={open} handleClose={handleCloseSlippageModal} />
    </div>
  );
};
