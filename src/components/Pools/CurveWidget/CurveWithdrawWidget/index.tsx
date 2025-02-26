import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useCurveStore from "@/store/curve-store";
import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchLpTokenBalance from "@/hooks/Pools/useFetchLpTokenBalance";
import useFetchWithdrawCurveQuote from "@/hooks/Pools/useFetchWithdrawCurveQuote";

import { Token } from "@/store/types/token-type";
import CustomIcon from "@/components/common/CustomIcon";
import { SlippageInfo } from "../common/SlippageInfo";
import { ReviewWithdrawModal } from "./ReveiwWidthdrawlModal";
import {
  convertBigIntToUIFormat,
  convertUIFormatToBigInt,
} from "@/utils/number";
import { ActionBtnContainer } from "./ActionBtnContainer";
import { BalancedTokenContainer } from "./BalancedTokenContainer";
import { SingleWithdrawTokenDetails } from "./SingleWithdrawTokenDetails";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";

interface Props {
  poolName: string;
  slug: string;
  tokens: Token[];
  lpTokenName: string;
  lpTokenImage: string;
  lpTokenAddress: string;
  lpTokenDecimal: number;
  poolChainId: number;
  contract: string;
  refetchLpTokenBalance: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const CurveWithdrawWidget = ({
  poolName,
  slug,
  tokens,
  lpTokenName,
  lpTokenImage,
  lpTokenAddress,
  lpTokenDecimal,
  poolChainId,
  contract,
  refetchLpTokenBalance,
}: Props) => {
  const { address } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("0");
  const [inputPercentage, setInputPercentage] = useState<string>("0");
  const [isBalanced, setIsBalanced] = useState<boolean>(true);
  const { open, handleClose, handleOpen } = useCustomModal();
  const [selectedTokenId, setSelectedTokenId] = useState(tokens[0].id);

  const handleSetLpTokenBalance = (val: string) => {
    useCurveStore
      .getState()
      .setLpTokenBalance(
        convertBigIntToUIFormat(val, Number(lpTokenDecimal)).toString()
      );
  };

  const { loading: lpBalanceLoading, error: lpBalanceError } =
    useFetchLpTokenBalance({
      poolId: slug,
      walletAddress: address,
      lpTokenDecimal: lpTokenDecimal,
      setterFunction: handleSetLpTokenBalance,
      isPolling: true,
    });

  const { lpTokenBalance, tokenLpInput, minAmountTokens, slippage } =
    useCurveStore(
      useShallow((state) => ({
        lpTokenBalance: state.lpTokenBalance,
        tokenLpInput: state.tokenLpInput,
        minAmountTokens: state.minAmountTokens,
        slippage: state.slippageValue,
      }))
    );

  const { loading, error } = useFetchWithdrawCurveQuote({
    slug: slug,
    slippage: Number(slippage),
    amount: convertUIFormatToBigInt(tokenLpInput, lpTokenDecimal).toString(),
    isBalanced: isBalanced,
    selectedIndex: selectedTokenId,
  });

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useCurveStore.getState().setLpTokenInput(value);
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

  const handleResetWidget = () => {
    refetchLpTokenBalance();
    updateInputPercentage("0");
  };

  /**
   * Set selected curveIndex.
   * @param idx Id of selected token.
   */
  const handleSetSelectedTokenIndex = (id: number) => {
    setSelectedTokenId(id);
  };

  /**
   * Check for loading and error states before showing balance.
   * @returns JSX for loading state or balance
   */
  const returnBalance = () => {
    if (lpBalanceLoading) {
      return <CustomTextLoader text={Number(lpTokenBalance).toFixed(8)} />;
    } else if (lpBalanceError) return <MdError />;
    else return Number(lpTokenBalance).toFixed(8);
  };

  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="CurveWithdrawWidget"
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
          <span className="BalanceValue">Balance: {returnBalance()}</span>
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
      <div className="WithdrawActionContainer">
        <div className="WithdrawAction">
          <div
            className="CustomRadioButton"
            style={{
              border: !isBalanced ? "1px solid #7BF179" : "1px solid #383838",
            }}
            onClick={() => {
              if (loading) return;
              setIsBalanced(false);
            }}
          >
            <div
              style={{
                transform: !isBalanced ? "scale(1)" : "scale(0)",
              }}
              className="RadioCircle"
            ></div>
          </div>
          <span>One Coin</span>
        </div>
        <div className="WithdrawAction">
          <div
            className="CustomRadioButton"
            style={{
              border: isBalanced ? "1px solid #7BF179" : "1px solid #383838",
            }}
            onClick={() => {
              if (loading) return;
              setIsBalanced(true);
            }}
          >
            <div
              style={{
                transform: isBalanced ? "scale(1)" : "scale(0)",
              }}
              className="RadioCircle"
            ></div>
          </div>
          <span>Balanced</span>
        </div>
      </div>
      <div className="OutputDetailsContainer">
        <div className="Label">
          {isBalanced
            ? "You will receive"
            : "Select the tokens you want to receive"}
        </div>
        <div className="OutputTokenDetails">
          {isBalanced ? (
            <BalancedTokenContainer minAmountTokens={minAmountTokens} />
          ) : (
            tokens.map((el, index) => (
              <SingleWithdrawTokenDetails
                key={index}
                selectedTokenId={selectedTokenId}
                token={el}
                setSelectedTokenId={handleSetSelectedTokenIndex}
              />
            ))
          )}

          <SlippageInfo />
        </div>
      </div>
      <div className="ButtonsContainer">
        <ActionBtnContainer
          loadingState={loading}
          handleOpen={handleOpen}
          poolChainId={poolChainId}
        />
      </div>
      <ReviewWithdrawModal
        poolName={poolName}
        lpTokenName={lpTokenName}
        lpTokenImage={lpTokenImage}
        lpTokenAddress={lpTokenAddress}
        lpTokenDecimal={lpTokenDecimal}
        isBalanced={isBalanced}
        open={open}
        handleClose={handleClose}
        contract={contract}
        poolChainId={poolChainId}
        handleResetWidget={handleResetWidget}
      />
    </motion.div>
  );
};
