import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import useCurveStore from "@/store/curve-store";
import { useShallow } from "zustand/react/shallow";
import useFetchPoolTokenBalance from "@/hooks/Pools/useFetchPoolTokenBalance";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { MdError } from "react-icons/md";

interface Props {
  slug: string;
  token: Token;
}

export const PoolTokenContainer = ({ slug, token }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const { tokenBalances, tokenInputs } = useCurveStore(
    useShallow((state) => ({
      tokenBalances: state.tokenBalances,
      tokenInputs: state.tokenInputs,
    }))
  );

  const handleSetBalance = (tokenDetails: Token, balance: string) => {
    useCurveStore.getState().setTokenBalance(balance, token.curveIndex, token);
  };

  const { loading, error } = useFetchPoolTokenBalance({
    tokenDetails: token,
    isRefetch: true,
    setterFunction: handleSetBalance,
  });

  const {
    data,
    loading: dollarValueLoading,
    error: dollarValueError,
  } = useFetchTokenDollarValue({
    tokenId: token?.id,
  });

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useCurveStore.getState().setTokenInput(value, token?.curveIndex, token);
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

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxTokenBalance = () => {
    const event = new Event("change", { bubbles: true });
    const input = inputRef.current;
    if (input) {
      input.value = tokenBalances[token.curveIndex].balance;
      input.dispatchEvent(event);
      setValue(tokenBalances[token.curveIndex].balance);
      useCurveStore
        .getState()
        .setTokenInput(
          tokenBalances[token.curveIndex].balance,
          token?.curveIndex,
          token
        );
    }
  };

  /**
   * Check for loading and error states before showing balance.
   * @returns JSX for loading state or balance
   */
  const returnBalance = () => {
    if (loading) {
      return (
        <CustomTextLoader
          text={Number(tokenBalances[token.curveIndex].balance)
            .toFixed(6)
            .toString()}
        />
      );
    } else if (error) return <MdError />;
    else return Number(tokenBalances[token.curveIndex].balance).toFixed(6);
  };

  /**
   * Check for loading and error states before showing dollar value.
   * @returns JSX for loading state or dollar
   */
  const returnDollarValue = () => {
    if (dollarValueError) {
      return <MdError />;
    } else if (dollarValueLoading) {
      return <CustomTextLoader text="$0.00" />;
    } else {
      return "$" + (Number(data) * Number(value)).toFixed(4).toString();
    }
  };

  return (
    <div className="CurveDepositTokenInputWrapper">
      <div className="TokenInputContainer">
        <div className="InputContainer">
          <input
            ref={inputRef}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="0.00"
            className="Token-Input"
          />
          <div className="DollarValue">{returnDollarValue()}</div>
        </div>
        <div className="TokenInfoContainer">
          <div className="TokenLogo">
            <CustomIcon src={token.tokenLogo} />
            <div className="ChainLogo">
              <CustomIcon src={token.chain.chainLogo} />
            </div>
          </div>
          <div className="TokenName">{token.name}</div>
        </div>
      </div>
      <div className="BalanceContainer">
        <span className="BalanceValue">Balance: {returnBalance()}</span>
        <div className="MaxBtn" onClick={handleMaxTokenBalance}>
          MAX
        </div>
      </div>
    </div>
  );
};
