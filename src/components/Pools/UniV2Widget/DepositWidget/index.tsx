import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";

import useCustomModal from "@/hooks/common/useCustomModal";
import useUniV2Store from "@/store/univ2-store";
import { useShallow } from "zustand/react/shallow";

import CustomIcon from "@/components/common/CustomIcon";
import { ReviewDepositModal } from "./ReviewDepositModal";
import { SlippageInfo } from "../common/SlippageInfo";
import { PoolTokenContainer } from "./PoolTokenContainer";
import { Token } from "@/store/types/token-type";
import { convertBigIntToUIFormat } from "@/utils/number";
import { ActionBtnContainer } from "./ActionBtnContainer";
import { UNI_V2_INPUT_ACTIONS } from "@/utils/enums";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";

interface Props {
  poolName: string;
  tokens: Token[];
  lpTokenAddress: string;
  lpSymbol: string;
  lpTokenImage: string;
  slug: string;
  poolChainId: number;
  refetchLpTokenBalance: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

export const DepositWidget = ({
  poolName,
  tokens,
  lpTokenAddress,
  lpSymbol,
  lpTokenImage,
  slug,
  poolChainId,
  refetchLpTokenBalance,
}: Props) => {
  const [tokenAValue, setTokenAValue] = useState<string>("0");
  const [tokenBValue, setTokenBValue] = useState<string>("0");
  const [inputAction, setInputAction] = useState<string>(""); //can revisit this.
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const { open, handleClose, handleOpen } = useCustomModal();
  const {
    tokenABalanceObject,
    tokenBBalanceObject,
    tokenAAmount,
    tokenBAmount,
  } = useUniV2Store(
    useShallow((state) => ({
      tokenABalanceObject: state.tokenABalanceObject,
      tokenBBalanceObject: state.tokenBBalanceObject,
      tokenAAmount: state.tokenAAmount,
      tokenBAmount: state.tokenBAmount,
    }))
  );

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV2Store.getState().setTokenAAmount(tokenAValue);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [tokenAValue]);

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV2Store.getState().setTokenBAmount(tokenBValue);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [tokenBValue]);

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxTokenABalance = () => {
    setInputAction(UNI_V2_INPUT_ACTIONS.TOKENA);
    const event = new Event("change", { bubbles: true });
    const input = inputARef.current;
    if (input) {
      input.value = tokenABalanceObject.balance;
      input.dispatchEvent(event);
      setTokenAValue(Number(tokenABalanceObject.balance).toString());
      useUniV2Store
        .getState()
        .setTokenAAmount(Number(tokenABalanceObject.balance).toString());
    }
  };

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxTokenBBalance = () => {
    setInputAction(UNI_V2_INPUT_ACTIONS.TOKENB);
    const event = new Event("change", { bubbles: true });
    const input = inputBRef.current;
    if (input) {
      input.value = tokenBBalanceObject.balance;
      input.dispatchEvent(event);
      setTokenBValue(Number(tokenBBalanceObject.balance).toString());
      useUniV2Store
        .getState()
        .setTokenBAmount(Number(tokenBBalanceObject.balance).toString());
    }
  };

  /**
   * Store balance of token A.
   * @param token Token A
   * @param balance Balance of token A
   */
  const handleSetTokenABalance = (token: Token, balance: string) => {
    useUniV2Store.getState().setTokenABalance(token, balance);
  };

  /**
   * Store balance of token B.
   * @param token Token B
   * @param balance Balance of token B
   */
  const handleSetTokenBBalance = (token: Token, balance: string) => {
    useUniV2Store.getState().setTokenBBalance(token, balance);
  };

  /**
   * Function to set quote amount for token B.
   * @param val Quote amount for token B.
   */
  const handleSetTokenBOutputAmount = (val: string) => {
    const event = new Event("change", { bubbles: true });
    const input = inputBRef.current;
    if (input) {
      const formattedValue =
        isNaN(Number(val)) || Number(val) === 0
          ? "0.00"
          : convertBigIntToUIFormat(
              Number(val).toLocaleString("fullwide", { useGrouping: false }),
              tokenBBalanceObject.token?.decimal ?? 18
            );
      input.value = formattedValue;
      input.dispatchEvent(event);
      setTokenBValue(Number(formattedValue).toString());
      useUniV2Store
        .getState()
        .setTokenBAmount(Number(formattedValue).toString());
    }
  };

  /**
   * Function to set quote amount for token A.
   * @param val Quote amount for token A.
   */
  const handleSetTokenAOutputAmount = (val: string) => {
    const event = new Event("change", { bubbles: true });
    const input = inputARef.current;
    if (input) {
      const formattedValue =
        isNaN(Number(val)) || Number(val) === 0
          ? "0.00"
          : convertBigIntToUIFormat(
              Number(val).toLocaleString("fullwide", { useGrouping: false }),
              tokenABalanceObject.token?.decimal ?? 18
            );
      input.value = formattedValue;
      input.dispatchEvent(event);
      setTokenAValue(Number(formattedValue).toString());
      useUniV2Store
        .getState()
        .setTokenAAmount(Number(formattedValue).toString());
    }
  };

  /**
   * Function to reset values after transaction is completed
   */
  const handleResetWidgetState = () => {
    refetchLpTokenBalance();
    useUniV2Store
      .getState()
      .setTokenAAmount(useUniV2Store.getInitialState().tokenAAmount);
    useUniV2Store
      .getState()
      .setTokenBAmount(useUniV2Store.getInitialState().tokenBAmount);
    handleSetTokenAOutputAmount(useUniV2Store.getInitialState().tokenAAmount);
    handleSetTokenBOutputAmount(useUniV2Store.getInitialState().tokenBAmount);
  };

  /**
   * Gas token should always be in bottom.
   * @returns Token containers as per native token check.
   */
  const returnTokensContainers = () => {
    if (tokens.some((item) => item.isNative)) {
      return (
        <>
          <PoolTokenContainer
            inputRef={inputARef}
            inputAction={inputAction}
            actionType={UNI_V2_INPUT_ACTIONS.TOKENA}
            setInputAction={setInputAction}
            token={tokens.filter((item) => !item.isNative)[0]}
            tokenBalance={tokenABalanceObject.balance}
            value={tokenAValue}
            setValue={setTokenAValue}
            debouncedValue={tokenAAmount}
            slug={slug}
            handleSetOutputTokenAmount={handleSetTokenBOutputAmount}
            handleMaxBalance={handleMaxTokenABalance}
            handleSetBalance={handleSetTokenABalance}
          />
          <PoolTokenContainer
            inputRef={inputBRef}
            inputAction={inputAction}
            actionType={UNI_V2_INPUT_ACTIONS.TOKENB}
            setInputAction={setInputAction}
            token={tokens.filter((item) => item.isNative)[0]}
            tokenBalance={tokenBBalanceObject.balance}
            value={tokenBValue}
            setValue={setTokenBValue}
            debouncedValue={tokenBAmount}
            slug={slug}
            handleSetOutputTokenAmount={handleSetTokenAOutputAmount}
            handleMaxBalance={handleMaxTokenBBalance}
            handleSetBalance={handleSetTokenBBalance}
          />
        </>
      );
    } else {
      return (
        <>
          <PoolTokenContainer
            inputRef={inputARef}
            inputAction={inputAction}
            actionType={UNI_V2_INPUT_ACTIONS.TOKENA}
            setInputAction={setInputAction}
            token={tokens[0]}
            tokenBalance={tokenABalanceObject.balance}
            value={tokenAValue}
            setValue={setTokenAValue}
            debouncedValue={tokenAAmount}
            slug={slug}
            handleSetOutputTokenAmount={handleSetTokenBOutputAmount}
            handleMaxBalance={handleMaxTokenABalance}
            handleSetBalance={handleSetTokenABalance}
          />
          <PoolTokenContainer
            inputRef={inputBRef}
            inputAction={inputAction}
            actionType={UNI_V2_INPUT_ACTIONS.TOKENB}
            setInputAction={setInputAction}
            token={tokens[1]}
            tokenBalance={tokenBBalanceObject.balance}
            value={tokenBValue}
            setValue={setTokenBValue}
            debouncedValue={tokenBAmount}
            slug={slug}
            handleSetOutputTokenAmount={handleSetTokenAOutputAmount}
            handleMaxBalance={handleMaxTokenBBalance}
            handleSetBalance={handleSetTokenBBalance}
          />
        </>
      );
    }
  };

  return (
    <motion.div
      className="DepositWidget"
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {" "}
      {tokens.length > 0 && returnTokensContainers()}
      <div className="LpTokenContainer">
        <SlippageInfo />
        <div className="LpTokenInfo">
          <span className="Label">You’ll Receive</span>
          <div className="LpToken">
            <span>
              {Number(useUniV2Store.getState().minAmountLp).toFixed(4)}
            </span>
            <div className="LpTokenLogoContainer">
              <div className="LpTokenLogo">
                <CustomIcon src={lpTokenImage} />
              </div>
              <span>{lpSymbol.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ButtonsContainer">
        <ActionBtnContainer
          poolChainId={poolChainId}
          handleOpenTransactionModal={handleOpen}
        />
      </div>
      <ReviewDepositModal
        poolChainId={poolChainId}
        poolName={poolName}
        lpTokenImage={lpTokenImage}
        lpTokenName={lpSymbol}
        open={open}
        handleClose={handleClose}
        handleResetTransactionState={handleResetWidgetState}
      />
    </motion.div>
  );
};
