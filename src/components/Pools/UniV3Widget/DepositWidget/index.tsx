"use client";
import "./styles.scss";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import useFetchSinglePoolData from "@/hooks/Pools/useFetchSinglePoolData";
import useUniV3Store from "@/store/univ3-store";
import useCustomModal from "@/hooks/common/useCustomModal";
import useFetchUniV3Graph from "@/hooks/Pools/useFetchUniV3Graph";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import { UniV3PoolLabel } from "../../PoolsWidget/PoolsTable/PoolRow/UniV3Label";
import GraphWidget from "./GraphWidget";
import { GraphActionWidget } from "./GraphActionWidget";
import { TokenInputWidget } from "./TokenInputWidget";
import { PoolInfoWidget } from "./PoolInfoWidget";
import { Token } from "@/store/types/token-type";
import { UNI_V3_INPUT_ACTIONS } from "@/utils/enums";
import {
  convertBigIntToUIFormat,
  convertPriceValueToTick,
  convertTickToPriceValue,
} from "@/utils/number";
import { ActionButtonContainer } from "./ActionButtonContainer";
import { PreviewUniV3Deposit } from "./PreviewUniV3DepositModal";
import { IoSettingsOutline } from "react-icons/io5";
import { SlippageModal } from "../SlippageModal";
import { IoMdLock } from "react-icons/io";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { LuZoomIn } from "react-icons/lu";
import { LuZoomOut } from "react-icons/lu";
import { MdOutlineSwapCalls } from "react-icons/md";
import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";

export const DepositWidget = () => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const id = path.split("/")[path.split("/").length - 2];
  const input0Ref = useRef<HTMLInputElement>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const [range, setRange] = useState(500);
  const [isReverse, setIsReverse] = useState(false);
  const [token0Value, setToken0Value] = useState<string>("0");
  const [token1Value, setToken1Value] = useState<string>("0");
  const [inputAction, setInputAction] = useState<string>(""); //can revisit this.

  const {
    open: openPreviewDepositModal,
    handleClose: closePreviewDepositModal,
    handleOpen: handleOpenPreviewDepositModal,
  } = useCustomModal();

  const {
    open,
    handleClose: handleCloseSlippageModal,
    handleOpen,
  } = useCustomModal();

  const { data, loading, error } = useFetchSinglePoolData({
    poolId: id as string,
  });

  const {
    loading: graphDataLoading,
    error: graphDataError,
    data: graphData,
  } = useFetchUniV3Graph({
    poolId: id,
    reverse: isReverse,
  });

  const {
    data: token1Dollar,
    loading: token1DollarLoading,
    error: token1DollarError,
  } = useFetchTokenDollarValue({
    tokenId: data.tokens.length > 0 ? data.tokens[0].decimal : 0,
  });

  const {
    token1BalanceObject,
    token0BalanceObject,
    token0Amount,
    token1Amount,
    currenTick,
    lowerBoundTick,
    upperBoundTick,
    minTick,
    maxTick,
  } = useUniV3Store(
    useShallow((state) => ({
      token0Amount: state.token0Amount,
      token1Amount: state.token1Amount,
      token1BalanceObject: state.token1BalanceObject,
      token0BalanceObject: state.token0BalanceObject,
      currenTick: state.currentTick,
      lowerBoundTick: state.lowerBoundTick,
      upperBoundTick: state.upperBoundTick,
      minTick: state.minTick,
      maxTick: state.maxTick,
    }))
  );

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV3Store.getState().setToken0Amount(token0Value);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [token0Value]);

  useEffect(() => {
    const handleUpdateTokenInput = () => {
      useUniV3Store.getState().setToken1Amount(token1Value);
    };
    const handler = setTimeout(() => {
      handleUpdateTokenInput();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [token1Value]);

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxToken0Balance = () => {
    setInputAction(UNI_V3_INPUT_ACTIONS.TOKEN0);
    const event = new Event("change", { bubbles: true });
    const input = input0Ref.current;
    if (input) {
      input.value = token0BalanceObject.balance;
      input.dispatchEvent(event);
      setToken0Value(Number(token0BalanceObject.balance).toString());
      useUniV3Store
        .getState()
        .setToken0Amount(Number(token0BalanceObject.balance).toString());
    }
  };

  /**
   * Function to handle max balance input.
   * @returns void
   */
  const handleMaxToken1Balance = () => {
    setInputAction(UNI_V3_INPUT_ACTIONS.TOKEN1);
    const event = new Event("change", { bubbles: true });
    const input = input1Ref.current;
    if (input) {
      input.value = token1BalanceObject.balance;
      input.dispatchEvent(event);
      setToken1Value(Number(token1BalanceObject.balance).toString());
      useUniV3Store
        .getState()
        .setToken1Amount(Number(token1BalanceObject.balance).toString());
    }
  };

  /**
   * Store balance of token 0.
   * @param token Token 0
   * @param balance Balance of token 0
   */
  const handleSetToken0Balance = (token: Token, balance: string) => {
    useUniV3Store.getState().setToken0Balance(token, balance);
  };

  /**
   * Store balance of token 1.
   * @param token Token 1
   * @param balance Balance of token 1
   */
  const handleSetToken1Balance = (token: Token, balance: string) => {
    useUniV3Store.getState().setToken1Balance(token, balance);
  };

  /**
   * Function to set quote amount for token 0.
   * @param val Quote amount for token 0.
   */
  const handleSetToken0OutputAmount = (val: string) => {
    const event = new Event("change", { bubbles: true });
    const input = input0Ref.current;
    if (input) {
      const formattedValue =
        isNaN(Number(val)) || Number(val) === 0
          ? "0.00"
          : convertBigIntToUIFormat(
              Number(val).toLocaleString("fullwide", { useGrouping: false }),
              useUniV3Store.getState().token0BalanceObject.token?.decimal ?? 18
            );
      input.value = formattedValue;
      input.dispatchEvent(event);
      setToken0Value(Number(formattedValue).toString());
      useUniV3Store
        .getState()
        .setToken0Amount(Number(formattedValue).toString());
    }
  };

  /**
   * Function to set quote amount for token 1.
   * @param val Quote amount for token 1.
   */
  const handleSetToken1OutputAmount = (val: string) => {
    const event = new Event("change", { bubbles: true });
    const input = input1Ref.current;
    if (input) {
      const formattedValue =
        isNaN(Number(val)) || Number(val) === 0
          ? "0.00"
          : convertBigIntToUIFormat(
              Number(val).toLocaleString("fullwide", { useGrouping: false }),
              useUniV3Store.getState().token1BalanceObject.token?.decimal ?? 18
            );
      input.value = formattedValue;
      input.dispatchEvent(event);
      setToken1Value(Number(formattedValue).toString());
      useUniV3Store
        .getState()
        .setToken1Amount(Number(formattedValue).toString());
    }
  };

  /**
   * Function to reset values after transaction is completed
   */
  const handleResetWidgetState = () => {
    useUniV3Store
      .getState()
      .setToken0Amount(useUniV3Store.getInitialState().token0Amount);
    useUniV3Store
      .getState()
      .setToken1Amount(useUniV3Store.getInitialState().token1Amount);
    handleSetToken0OutputAmount(useUniV3Store.getInitialState().token0Amount);
    handleSetToken1OutputAmount(useUniV3Store.getInitialState().token1Amount);
  };

  /**
   * Update distance from current tick.
   * @param percentage percentage to be updated.
   */
  const updateTickDistance = (percentage: number) => {
    const currentTickPrice = convertTickToPriceValue(
      currenTick,
      data.tokens[0].decimal,
      data.tokens[1].decimal
    );
    const newMinPrice =
      Number(currentTickPrice) - Number(currentTickPrice) * (percentage / 100);
    const newMaxPrice =
      Number(currentTickPrice) + Number(currentTickPrice) * (percentage / 100);
    const newMaxTick = convertPriceValueToTick(
      newMinPrice,
      data.tokens[0].decimal,
      data.tokens[1].decimal
    );
    const newMinTick = convertPriceValueToTick(
      newMaxPrice,
      data.tokens[0].decimal,
      data.tokens[1].decimal
    );
    const roundedMinTick = parseInt(
      (Math.floor(newMinTick / 60) * 60).toString()
    );
    const roundedMaxTick = parseInt(
      (Math.ceil(newMaxTick / 60) * 60).toString()
    );
    useUniV3Store.getState().setMaxTick(roundedMaxTick);
    useUniV3Store.getState().setMinTick(roundedMinTick);
  };

  /**
   * update tick distance to max.
   */
  const updateTickDistanceMax = () => {
    const roundedMinTick = parseInt(
      (Math.floor(lowerBoundTick / 60) * 60).toString()
    );
    const roundedMaxTick = parseInt(
      (Math.ceil(upperBoundTick / 60) * 60).toString()
    );
    useUniV3Store.getState().setMaxTick(roundedMaxTick);
    useUniV3Store.getState().setMinTick(roundedMinTick);
  };

  const returnToken1TickCheck = () => {
    if (Boolean(searchParams.get("current"))) {
      return (
        Number(searchParams.get("tickLower")) > currenTick &&
        Number(searchParams.get("tickUpper")) > currenTick
      );
    } else {
      return minTick > currenTick && maxTick > currenTick;
    }
  };

  const returnToken0TickCheck = () => {
    if (Boolean(searchParams.get("current"))) {
      return (
        Number(searchParams.get("tickLower")) < currenTick &&
        Number(searchParams.get("tickUpper")) < currenTick
      );
    } else {
      return minTick < currenTick && maxTick < currenTick;
    }
  };

  const renderTokenInputs = () => {
    return (
      <>
        {!returnToken0TickCheck() && (
          <TokenInputWidget
            slug={id}
            inputRef={input0Ref}
            inputAction={inputAction}
            actionType={UNI_V3_INPUT_ACTIONS.TOKEN0}
            setInputAction={setInputAction}
            setValue={setToken0Value}
            token={data.tokens[0]}
            value={token0Value}
            debouncedValue={token0Amount}
            tokenBalance={token0BalanceObject.balance}
            handleMaxBalance={handleMaxToken0Balance}
            handleSetBalance={handleSetToken0Balance}
            handleSetOutputTokenAmount={handleSetToken1OutputAmount}
          />
        )}
        {!returnToken1TickCheck() && (
          <TokenInputWidget
            slug={id}
            inputRef={input1Ref}
            inputAction={inputAction}
            actionType={UNI_V3_INPUT_ACTIONS.TOKEN1}
            setInputAction={setInputAction}
            setValue={setToken1Value}
            token={data.tokens[1]}
            value={token1Value}
            debouncedValue={token1Amount}
            tokenBalance={token1BalanceObject.balance}
            handleMaxBalance={handleMaxToken1Balance}
            handleSetBalance={handleSetToken1Balance}
            handleSetOutputTokenAmount={handleSetToken0OutputAmount}
          />
        )}
      </>
    );
  };

  const handleIncreaseRange = () => {
    const newRange = Math.min(range + 500, graphData.ticks.length);
    setRange(newRange);
  };

  const handleDecreaseRange = () => {
    const newRange = Math.max(range - 500, 0);
    if (newRange === 0) return;
    setRange(newRange);
  };

  return (
    <div className="UniV3DepositWidgetWrapper">
      <div className="HeadingContainer">
        <Link href={"/pools"}>
          <div className="BackBtn">
            <CustomIcon src={ARROW_LEFT} />
          </div>
        </Link>
        <span className="Heading">{data.name}</span>
        <UniV3PoolLabel />
      </div>
      <div className="PoolActionsWrapper">
        <div className="PoolGraphInfoContainer">
          {Boolean(searchParams.get("current")) && (
            <div className="GraphInActiveContainer">
              <IoMdLock />
            </div>
          )}
          <div className="HeadingContainer">
            <span className="HeadingText">New Position</span>
            <div className="BackBtn" onClick={handleOpen}>
              <IoSettingsOutline />
            </div>
          </div>
          <div className="GraphWrapper">
            {graphDataLoading ? (
              <div className="GraphLoadingWrapper"></div>
            ) : (
              <Fragment>
                <div className="GraphControlsContainer">
                  <span className="Label">Price Range</span>
                  <div className="ControlsWrapper">
                    <div className="TokenButtonContainer">
                      <div
                        className="TokenButton"
                        style={{
                          background: !isReverse ? "#1E1E1E" : "unset",
                          color: !isReverse ? "#fcfcfc" : "#f2fef18a",
                        }}
                        onClick={() => setIsReverse(false)}
                      >
                        {data.tokens[0].name}
                      </div>
                      <div
                        className="TokenButton"
                        style={{
                          background: isReverse ? "#1E1E1E" : "unset",
                          color: isReverse ? "#fcfcfc" : "#f2fef18a",
                        }}
                        onClick={() => setIsReverse(true)}
                      >
                        {data.tokens[1].name}
                      </div>
                    </div>
                    <div
                      className="ControlsButton"
                      onClick={handleIncreaseRange}
                    >
                      <LuZoomIn />
                    </div>
                    <div
                      className="ControlsButton"
                      onClick={handleDecreaseRange}
                    >
                      <LuZoomOut />
                    </div>
                  </div>
                </div>
                {minTick <= lowerBoundTick && (
                  <div className="GraphArrowLeft">
                    <BiSolidLeftArrow />
                  </div>
                )}
                <GraphWidget
                  poolId={id}
                  data={graphData}
                  range={range}
                  loading={graphDataLoading}
                  reverse={isReverse}
                />
                {maxTick >= upperBoundTick && (
                  <div className="GraphArrowRight">
                    <BiSolidRightArrow />
                  </div>
                )}
              </Fragment>
            )}
          </div>
          <div className="GraphLegends">
            <div className="LegendContainer">
              <div className="LegendLine"></div>
              <span className="Label">Price Tick</span>
            </div>
            <div className="LegendContainer">
              <div className="LegendLine"></div>
              <span className="Label">Your Liquidity</span>
            </div>
            <div className="LegendContainer">
              <div className="LegendLine"></div>
              <span className="Label">Pool Liquidity</span>
            </div>
          </div>
          {data.tokens.length > 0 && (
            <GraphActionWidget
              token0={data.tokens[0]}
              token1={data.tokens[1]}
              reverse={isReverse}
              loading={graphDataLoading}
            />
          )}
          <div className="PoolShortActionContainer">
            <div
              className="PoolShortActionBtn"
              onClick={() => {
                updateTickDistance(10);
              }}
            >
              10%
            </div>
            <div
              className="PoolShortActionBtn"
              onClick={() => {
                updateTickDistance(20);
              }}
            >
              20%
            </div>
            <div
              className="PoolShortActionBtn"
              onClick={() => {
                updateTickDistance(50);
              }}
            >
              50%
            </div>
            <div className="PoolShortActionBtn" onClick={updateTickDistanceMax}>
              Max
            </div>
          </div>
        </div>
        <div className="PoolInfoContainer">
          <PoolInfoWidget
            tvl={data.tvl}
            reserves={data.totalReserve}
            dailyVolume={data.dailyVolume}
            tokens={data.tokens}
            loading={loading}
            error={error}
          />
          <div className="PoolInputWrapper">
            <span className="Label">Add Liquidity</span>
            <div className="FeeContainer">
              <span className="FeeLabel">Fee Tier</span>
              <div className="FeeValue">0.3%</div>
            </div>
            <div className="PoolInputContainer">
              {data.tokens.length > 0 && renderTokenInputs()}
            </div>
            <ActionButtonContainer
              poolChainId={data.chainId}
              handleOpenPreviewModal={handleOpenPreviewDepositModal}
            />
          </div>
        </div>
      </div>
      {data.tokens.length > 0 && (
        <PreviewUniV3Deposit
          poolChainId={Number(data.chainId)}
          contract={data.lpTokenAddress}
          open={openPreviewDepositModal}
          poolName={data.name}
          fee={data.lpFee.toString()}
          tokens={data.tokens}
          nftId={searchParams.get("nftId") as string}
          isCurrent={Boolean(searchParams.get("current"))}
          handleResetTransaction={handleResetWidgetState}
          handleClose={closePreviewDepositModal}
        />
      )}
      <SlippageModal open={open} handleClose={handleCloseSlippageModal} />
    </div>
  );
};
