"use client";
import React from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import { useBoolean } from "usehooks-ts";

import CustomIcon from "@/components/common/CustomIcon";
import { CIRCLE_ARROW, CIRCLE_ARROW_UP, OPEN_ICON_ARROW } from "@/utils/images";
import { getExplorerLinkForHashAndChainId } from "@/utils/constants";

interface Props {
  sourceChainAmount: string;
  sourceChainImage: string;
  destChainImage: string;
  sourceTokenImage: string;
  destTokenImage: string;
  sourceChainHash: string;
  sourceTokenName: string;
  sourceChainId: number;
  destinationChainId: number;
  createdAt: number;
  zetaChainHash?: string;
  destChainHash?: string;
}

export const TransferActivityCard = ({
  sourceChainAmount,
  sourceChainImage,
  destChainImage,
  sourceTokenImage,
  destTokenImage,
  sourceChainHash,
  zetaChainHash,
  destChainHash,
  sourceChainId,
  destinationChainId,
  sourceTokenName,
  createdAt,
}: Props) => {
  const { value: showHash, setValue } = useBoolean();
  const handleOpenHash = (hash: string, isCCTX: boolean) => {
    const link = getExplorerLinkForHashAndChainId(sourceChainId, hash, isCCTX);
    window.open(link, "target:blank");
  };

  /**
   * get time stamp from unix timestamp.
   * @returns
   */
  const getTimeStamp = () => {
    const timestamp = createdAt; // Unix timestamp (seconds)
    const date = new Date(timestamp * 1000); // Convert to milliseconds

    const formattedDate = date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return formattedDate;
  };
  return (
    <motion.div className="ActivityCard">
      <div className="TokenDetailsContainer">
        <div className="TokenContainer">
          <div className="TokenLogo">
            <CustomIcon src={sourceTokenImage} />
            <div className="ChainLogo">
              <CustomIcon src={sourceChainImage} />
            </div>
          </div>
          <div className="ArrowIcon">
            <CustomIcon src={CIRCLE_ARROW} />
          </div>
          <div className="TokenLogo">
            <CustomIcon src={destTokenImage} />
            <div className="ChainLogo">
              <CustomIcon src={destChainImage} />
            </div>
          </div>
        </div>
      </div>
      <div className="TimeStamp">{getTimeStamp()}</div>
      <div className="TransactionDetails">
        <div className="DetailsContainer">
          <span>
            Transferred {Number(sourceChainAmount).toFixed(3)} {sourceTokenName}
          </span>
          <div
            style={{
              transform: showHash ? "rotate(0deg)" : "rotate(180deg)",
            }}
            className="ArrowDown"
            onClick={() => {
              setValue((prev) => !prev);
            }}
          >
            <CustomIcon src={CIRCLE_ARROW_UP} />
          </div>
        </div>
      </div>
      {showHash && (
        <motion.div
          transition={{ delay: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="TransactionHashContainer"
        >
          <div
            className="TransactionHash"
            onClick={() => {
              handleOpenHash(
                sourceChainHash,
                sourceChainId !== destinationChainId
              );
            }}
          >
            <span className="HashType">Source Chain</span>
            <div className="OpenIcon">
              <CustomIcon src={OPEN_ICON_ARROW} />
            </div>
          </div>
          {zetaChainHash && destChainHash && (
            <>
              <div className="TransactionHash">
                <span className="HashType">ZetaChain Chain</span>
                <div className="OpenIcon">
                  <CustomIcon src={OPEN_ICON_ARROW} />
                </div>
              </div>
              <div className="TransactionHash">
                <span className="HashType">Destination Chain</span>
                <div className="OpenIcon">
                  <CustomIcon src={OPEN_ICON_ARROW} />
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
