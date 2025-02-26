"use client";
import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import { useBoolean } from "usehooks-ts";

import CustomIcon from "@/components/common/CustomIcon";
import {
  CIRCLE_ADD,
  CIRCLE_ARROW_UP,
  CIRCLE_MINUS,
  OPEN_ICON_ARROW,
} from "@/utils/images";
import { CurvePoolLabel } from "./CurvePoolLabel";
import { POOL_ACTION_TYPE, POOL_TYPE } from "@/utils/enums";
import { UniV2PoolLabel } from "./UniV2PoolLabel";
import { getExplorerLinkForHashAndChainId } from "@/utils/constants";

interface Props {
  type: string;
  poolName: string;
  poolType: string;
  poolTokenImages: string[];
  sourceChainHash: string;
  sourceChainId: number;
  sourceChainImage: string;
}

export const PoolsActivityCard = ({
  type,
  poolName,
  poolType,
  poolTokenImages,
  sourceChainHash,
  sourceChainId,
  sourceChainImage,
}: Props) => {
  const { value: showHash, setValue } = useBoolean();

  /**
   * Function to open transaction hash based on sourceChainId and sourceChainHash
   */
  const handleOpenHash = () => {
    const link = getExplorerLinkForHashAndChainId(
      sourceChainId,
      sourceChainHash
    );
    window.open(link, "target:blank");
  };
  return (
    <motion.div className="PoolActivityCard">
      <div className="TokenDetailsContainer">
        <div className="TokenContainer">
          <div className="ArrowIcon">
            <CustomIcon
              src={type === POOL_ACTION_TYPE.ADD ? CIRCLE_ADD : CIRCLE_MINUS}
            />
          </div>
          {poolTokenImages.length <= 2 &&
            poolTokenImages.map((el, index) => (
              <div key={index} className="TokenLogo">
                <CustomIcon src={el} />
                <div className="ChainLogo">
                  <CustomIcon src={sourceChainImage} />
                </div>
              </div>
            ))}
          {poolTokenImages.length === 4 &&
            poolTokenImages.map((el, index) => (
              <div key={index} className="TokenLogoSmall">
                <CustomIcon src={el} />
                <div className="ChainLogo">
                  <CustomIcon src={sourceChainImage} />
                </div>
              </div>
            ))}
        </div>
        {poolType === POOL_TYPE.CURVE ? <CurvePoolLabel /> : <UniV2PoolLabel />}
      </div>
      <div className="TransactionDetails">
        <div className="DetailsContainer">
          <span>
            {type === POOL_ACTION_TYPE.ADD
              ? "Liquidity added"
              : "Liquidity Removed"}
          </span>
          <div
            style={{
              transform: showHash ? "rotate(180deg)" : "rotate(0deg)",
            }}
            className="ArrowDown"
            onClick={() => {
              setValue((prev) => !prev);
            }}
          >
            <CustomIcon src={CIRCLE_ARROW_UP} />
          </div>
        </div>
        <span className="PoolName">{poolName}</span>
      </div>
      {showHash && (
        <motion.div
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="TransactionHashContainer"
        >
          <div className="TransactionHash" onClick={handleOpenHash}>
            <span className="HashType">Source Chain</span>
            <div className="OpenIcon">
              <CustomIcon src={OPEN_ICON_ARROW} />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
