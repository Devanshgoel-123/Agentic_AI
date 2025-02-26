import React, { LegacyRef, useEffect } from "react";
import "./styles.scss";

import useFetchPoolTokenBalance from "@/hooks/Pools/useFetchPoolTokenBalance";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";
import useFetchDepositQuoteUniv2 from "@/hooks/Pools/useFetchDepositQuoteUniv2";
import useUniV2Store from "@/store/univ2-store";
import { useShallow } from "zustand/react/shallow";

import CustomIcon from "@/components/common/CustomIcon";
import { Token } from "@/store/types/token-type";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { convertUIFormatToBigInt } from "@/utils/number";
import { MdError } from "react-icons/md";

interface Props {
  inputRef: LegacyRef<HTMLInputElement> | undefined;
  inputAction: string;
  actionType: string;
  setInputAction: React.Dispatch<React.SetStateAction<string>>;
  slug: string;
  token: Token;
  tokenBalance: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  debouncedValue: string;
  handleMaxBalance: () => void;
  handleSetBalance: (token: Token, balance: string) => void;
  handleSetOutputTokenAmount: (val: string) => void;
}

export const PoolTokenContainer = ({
  inputRef,
  inputAction,
  actionType,
  setInputAction,
  slug,
  token,
  tokenBalance,
  value,
  setValue,
  debouncedValue,
  handleMaxBalance,
  handleSetBalance,
  handleSetOutputTokenAmount,
}: Props) => {
  const { slippageValue } = useUniV2Store(
    useShallow((state) => ({
      slippageValue: state.slippageValue,
    }))
  );

  const { loading, error } = useFetchPoolTokenBalance({
    tokenDetails: token,
    isRefetch: true,
    setterFunction: handleSetBalance,
  });

  const { loading: quoteLoading, error: quoteError } =
    useFetchDepositQuoteUniv2({
      slug: slug,
      tokenId: token.id,
      slippage: Number(slippageValue),
      amount: convertUIFormatToBigInt(
        debouncedValue,
        Number(token?.decimal ?? 18)
      ).toString(),
      setterFunction: handleSetOutputTokenAmount,
      isSkip: actionType !== inputAction,
    });

  useEffect(() => {
    useUniV2Store.getState().setIsDepositQuoteLoading(quoteLoading);
  }, [quoteLoading]);

  const {
    data,
    loading: dollarValueLoading,
    error: dollarValueError,
  } = useFetchTokenDollarValue({
    tokenId: token?.id,
  });

  /**
   * Function to prevent adding faulty values.
   * @param e Input event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setInputAction(actionType);
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
    setInputAction(actionType);
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }
    setValue(sanitizedValue);
  };

  /**
   * Check for loading and error states before showing balance.
   * @returns JSX for loading state or balance
   */
  const returnBalance = () => {
    if (loading) {
      return (
        <CustomTextLoader text={Number(tokenBalance).toFixed(6).toString()} />
      );
    } else if (error) return <MdError />;
    else return Number(tokenBalance).toFixed(6);
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
    <div className="PoolTokenInputWrapper">
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
        <div className="MaxBtn" onClick={handleMaxBalance}>
          MAX
        </div>
      </div>
    </div>
  );
};
