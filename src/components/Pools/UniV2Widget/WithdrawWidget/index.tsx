import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useFetchQuoteForWithdrawUniV2 from "@/hooks/Pools/useFetchQuoteForWithdrawUniV2";
import useCustomModal from "@/hooks/common/useCustomModal";
import useUniV2Store from "@/store/univ2-store";
import useFetchLpTokenBalance from "@/hooks/Pools/useFetchLpTokenBalance";

import CustomIcon from "@/components/common/CustomIcon";
import { SlippageInfo } from "../common/SlippageInfo";
import { ReviewWithdrawModal } from "./ReveiwWidthdrawlModal";
import { Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  convertUIFormatToBigInt,
} from "@/utils/number";
import { OutputTokenDetails } from "./OutputTokenDetails";
import { ActionBtnContainer } from "./ActionBtnContainer";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";

interface Props {
  poolName: string;
  slug: string;
  tokens: Token[];
  lpTokenName: string;
  lpTokenImage: string;
  lpTokenAddress: string;
  lpTokenDecimal: number;
  poolChainId: number;
  refetchLpTokenBalance: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const WithdrawWidget = ({
  poolName,
  slug,
  lpTokenName,
  lpTokenImage,
  lpTokenAddress,
  lpTokenDecimal,
  poolChainId,
  refetchLpTokenBalance,
}: Props) => {
  const { address } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("0");
  const [inputPercentage, setInputPercentage] = useState<string>("0");
  const { open, handleClose, handleOpen } = useCustomModal();

  const handleSetLpTokenBalance = (val: string) => {
    useUniV2Store
      .getState()
      .setLpTokenBalance(
        convertBigIntToUIFormat(val, Number(lpTokenDecimal)).toString()
      );
  };

  const { loading: balanceLoading, error: balanceError } =
    useFetchLpTokenBalance({
      poolId: slug,
      walletAddress: address,
      lpTokenDecimal: lpTokenDecimal,
      setterFunction: handleSetLpTokenBalance,
      isPolling: true,
    });

  const {
    minAmountTokenAObject,
    minAmountTokenBObject,
    tokenLpInput,
    slippageValue,
    lpTokenBalance,
  } = useUniV2Store(
    useShallow((state) => ({
      minAmountTokenAObject: state.minAmountTokenAObject,
      minAmountTokenBObject: state.minAmountTokenBObject,
      tokenLpInput: state.tokenLpInput,
      slippageValue: state.slippageValue,
      lpTokenBalance: state.lpTokenBalance,
    }))
  );

  const { loading, error } = useFetchQuoteForWithdrawUniV2({
    slug: slug,
    slippage: Number(slippageValue),
    amount: convertUIFormatToBigInt(tokenLpInput, lpTokenDecimal).toString(),
  });

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV2Store.getState().setLpTokenInput(value);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  /**
   * Function to prevent adding faulty values.
   * @param e Input event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (
      !/^[0-9.]$/.test(key) &&
      key !== "Backspace" &&
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
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
   * Function to set balance as per percentage selected.
   * @param percent Percentage of balance to set as input.
   */
  const updateInputPercentage = (percent: string) => {
    setInputPercentage(percent);
    setValue((prev) => {
      const value =
        percent === "100"
          ? lpTokenBalance
          : ((Number(lpTokenBalance) * Number(percent)) / 100).toString();
      return value;
    });
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = (
        (Number(lpTokenBalance) * Number(percent)) /
        100
      ).toString();
      input.dispatchEvent(event);
    }
  };

  /**
   * Reset widget state after transaction is completed.
   */
  const handleResetTransactionState = () => {
    refetchLpTokenBalance();
    updateInputPercentage("0");
  };

  /**
   *
   * @returns JSX as per loading and error states of lP TOKEN balance.
   */
  const returnBalanceOfLpToken = () => {
    if (balanceError) {
      return <MdError />;
    } else if (balanceLoading) {
      return <CustomTextLoader text={Number(lpTokenBalance).toFixed(8)} />;
    } else {
      return Number(lpTokenBalance).toFixed(8);
    }
  };

  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="WithdrawWidget"
    >
      <div className="TokenInputWrapper">
        <div className="TokenInputContainer">
          <div className="InputContainer">
            <input
              ref={inputRef}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="0.00"
              className="Token-Input"
            />
          </div>
          <div className="TokenInfoContainer">
            <div className="TokenLogo">
              <CustomIcon src={lpTokenImage} />
            </div>
            <div className="TokenName">{lpTokenName}</div>
          </div>
        </div>
        <div className="BalanceContainer">
          <span className="BalanceValue">
            Balance: {returnBalanceOfLpToken()}
          </span>
          {/* <div className="MaxBtn">MAX</div> */}
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
      <div className="OutputDetailsContainer">
        <div className="Label">You will receive</div>
        <div className="OutputTokenDetails">
          {minAmountTokenAObject.token && !error && (
            <OutputTokenDetails
              token={minAmountTokenAObject.token}
              amount={minAmountTokenAObject.amount}
            />
          )}
          {minAmountTokenBObject.token && !error && (
            <OutputTokenDetails
              token={minAmountTokenBObject.token}
              amount={minAmountTokenBObject.amount}
            />
          )}
          <SlippageInfo />
        </div>
      </div>
      <div className="ButtonsContainer">
        <ActionBtnContainer
          poolChainId={poolChainId}
          loadingState={loading}
          handleOpenTransactionModal={handleOpen}
        />
      </div>
      <ReviewWithdrawModal
        poolName={poolName}
        open={open}
        poolChainId={poolChainId}
        handleClose={handleClose}
        lpTokenName={lpTokenName}
        lpTokenImage={lpTokenImage}
        lpTokenDecimal={lpTokenDecimal}
        lpTokenAddress={lpTokenAddress}
        handleResetTransactionState={handleResetTransactionState}
      />
    </motion.div>
  );
};
