import React from "react";
import "./styles.scss";

import { useShallow } from "zustand/react/shallow";
import useUniV3Store from "@/store/univ3-store";

import { FaMinus, FaPlus } from "react-icons/fa";
import { Token } from "@/store/types/token-type";
import {
  convertTickToPrice,
  convertTickToPriceRange,
  debounce,
  formatNumberWithDecimals,
} from "@/utils/number";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { motion } from "framer-motion";

interface Props {
  token0: Token;
  token1: Token;
  loading: boolean;
  reverse: boolean;
}

const defaultTickJump = 100;

export const GraphActionWidget = ({
  token0,
  token1,
  loading,
  reverse,
}: Props) => {
  const { minTick, maxTick, isAnimateMinTickBorder, isAnimateMaxTickBorder } =
    useUniV3Store(
      useShallow((state) => ({
        minTick: state.minTick,
        maxTick: state.maxTick,
        isAnimateMinTickBorder: state.isAnimateMinTickBorder,
        isAnimateMaxTickBorder: state.isAnimateMaxTickBorder,
      }))
    );

  /**
   * Function to increase min tick distance from current tick.
   */
  const increaseMinTick = debounce(() => {
    const newTick = minTick - defaultTickJump;
    const roundedTick = parseInt((Math.floor(newTick / 60) * 60).toString());
    useUniV3Store.getState().setMinTick(roundedTick);
  }, 100);

  /**
   * Function to decrease min tick distance from current tick.
   */
  const decreaseMinTick = debounce(() => {
    const newTick = minTick + defaultTickJump;
    const roundedTick = parseInt((Math.ceil(newTick / 60) * 60).toString());
    useUniV3Store.getState().setMinTick(roundedTick);
  }, 100);

  /**
   * Function to increase max tick distance from current tick.
   */
  const increaseMaxTick = debounce(() => {
    const newTick = maxTick + defaultTickJump;
    const roundedTick = parseInt((Math.ceil(newTick / 60) * 60).toString());
    useUniV3Store.getState().setMaxTick(roundedTick);
  }, 100);

  /**
   * Function to decrease max tick distance from current tick.
   */
  const decreaseMaxTick = debounce(() => {
    const newTick = maxTick - defaultTickJump;
    const roundedTick = parseInt((Math.floor(newTick / 60) * 60).toString());
    useUniV3Store.getState().setMaxTick(roundedTick);
  }, 100);

  /**
   * Function to handle loading state
   * @param val Value to display
   * @returns Loading state JSX.
   */
  const returnLoadingState = (val: string | number) => {
    if (loading) {
      return <CustomTextLoader text="0.0000" />;
    } else {
      return val;
    }
  };

  return (
    <div className="PositionInfoContainer">
      {reverse ? (
        <>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${"PositionInfo"} ${
              isAnimateMinTickBorder ? "animate-border" : ""
            }`}
          >
            <span className="PositionInfoLabel">Min</span>
            <div className="PositionValueContainer">
              <div className="ValueAction" onClick={increaseMaxTick}>
                <FaPlus />
              </div>
              <span className="PositionValue">
                {returnLoadingState(
                  formatNumberWithDecimals(
                    convertTickToPriceRange(
                      minTick,
                      maxTick,
                      token0.decimal,
                      token1.decimal
                    ).priceRangeToken1.lower
                  )
                )}
              </span>
              <div className="ValueAction" onClick={decreaseMaxTick}>
                <FaMinus />
              </div>
            </div>
            <span className="PositionInfoName">
              {token1.name}-per-{token0.name}
            </span>
            <span className="PositionInfoName">
              {returnLoadingState(
                formatNumberWithDecimals(
                  convertTickToPrice(maxTick, token0.decimal, token1.decimal)
                )
              )}
            </span>
          </motion.div>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${"PositionInfo"} ${
              isAnimateMaxTickBorder ? "animate-border" : ""
            }`}
          >
            <span className="PositionInfoLabel">Max</span>
            <div className="PositionValueContainer">
              <div className="ValueAction" onClick={increaseMinTick}>
                <FaPlus />
              </div>
              <span className="PositionValue">
                {returnLoadingState(
                  formatNumberWithDecimals(
                    convertTickToPriceRange(
                      minTick,
                      maxTick,
                      token0.decimal,
                      token1.decimal
                    ).priceRangeToken1.upper
                  )
                )}
              </span>
              <div className="ValueAction" onClick={decreaseMinTick}>
                <FaMinus />
              </div>
            </div>
            <span className="PositionInfoName">
              {token1.name}-per-{token0.name}
            </span>
            <span className="PositionInfoName">
              {returnLoadingState(
                formatNumberWithDecimals(
                  convertTickToPrice(minTick, token0.decimal, token1.decimal)
                )
              )}
            </span>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${"PositionInfo"} ${
              isAnimateMinTickBorder ? "animate-border" : ""
            }`}
          >
            <span className="PositionInfoLabel">Min</span>
            <div className="PositionValueContainer">
              <div className="ValueAction" onClick={increaseMinTick}>
                <FaPlus />
              </div>
              <span className="PositionValue">
                {returnLoadingState(
                  formatNumberWithDecimals(
                    convertTickToPrice(minTick, token0.decimal, token1.decimal)
                  )
                )}
              </span>
              <div className="ValueAction" onClick={decreaseMinTick}>
                <FaMinus />
              </div>
            </div>
            <span className="PositionInfoName">
              {token1.name}-per-{token0.name}
            </span>
            <span className="PositionInfoName">
              {returnLoadingState(
                formatNumberWithDecimals(
                  convertTickToPriceRange(
                    minTick,
                    maxTick,
                    token0.decimal,
                    token1.decimal
                  ).priceRangeToken1.upper
                )
              )}
            </span>
          </motion.div>
          <motion.div
            transition={{ delay: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${"PositionInfo"} ${
              isAnimateMaxTickBorder ? "animate-border" : ""
            }`}
          >
            <span className="PositionInfoLabel">Max</span>
            <div className="PositionValueContainer">
              <div className="ValueAction" onClick={increaseMaxTick}>
                <FaPlus />
              </div>
              <span className="PositionValue">
                {returnLoadingState(
                  formatNumberWithDecimals(
                    convertTickToPrice(maxTick, token0.decimal, token1.decimal)
                  )
                )}
              </span>
              <div className="ValueAction" onClick={decreaseMaxTick}>
                <FaMinus />
              </div>
            </div>
            <span className="PositionInfoName">
              {token1.name}-per-{token0.name}
            </span>
            <span className="PositionInfoName">
              {returnLoadingState(
                formatNumberWithDecimals(
                  convertTickToPriceRange(
                    minTick,
                    maxTick,
                    token0.decimal,
                    token1.decimal
                  ).priceRangeToken1.lower
                )
              )}
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
};
