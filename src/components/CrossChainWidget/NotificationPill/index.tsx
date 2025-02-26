import React, { Fragment } from "react";
import "./styles.scss";

import useFetchTokenDollarValue from "@/hooks/Transfer/useFetchTokenDollarValue";
import useTransferStore from "@/store/transfer-store";

import { motion } from "framer-motion";
import { IoMdInformationCircle } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";

interface Props {
  loading: boolean;
  error: any;
}

export const NotificationPill = ({ loading, error }: Props) => {
  const { data: payTokenDollarValue } = useFetchTokenDollarValue({
    tokenId: useTransferStore.getState().payToken?.id as number,
  });

  const { data: getTokenDollarValue } = useFetchTokenDollarValue({
    tokenId: useTransferStore.getState().getToken?.id as number,
  });

  const renderPriceImpact = () => {
    const tokenInDollar =
      Number(useTransferStore.getState().tokenInAmount) *
      Number(payTokenDollarValue);
    const tokenOutDollar =
      Number(useTransferStore.getState().tokenOutAmount) *
      Number(getTokenDollarValue);
    const priceImpact = (
      (Math.abs(tokenOutDollar - tokenInDollar) / tokenInDollar) *
      100
    ).toFixed(2);
    if (
      Number(priceImpact) > 5 &&
      Number(useTransferStore.getState().tokenInAmount) !== 0 &&
      Number(useTransferStore.getState().tokenOutAmount) !== 0 &&
      !loading &&
      !error
    ) {
      return (
        <motion.div
          transition={{ delay: 1 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="NotificationPillContainer"
        >
          <motion.div
            transition={{ delay: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="PillIconRed"
          >
            <RiErrorWarningFill />
          </motion.div>
          <span className="PillText">
            Warning: High Price Impact{" "}
            <span className="Red">{priceImpact}% </span>
            Trade at your own risk.
          </span>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          transition={{ delay: 1 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="NotificationPillContainer"
        >
          <motion.div
            transition={{ delay: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="PillIcon"
          >
            <IoMdInformationCircle />
          </motion.div>
          <span className="PillText">
            Note: To swap within ZetaChain, select ZetaChain in both the
            &apos;From&apos; and &apos;To&apos; chain fields and earn 2x Eddy
            Points.
          </span>
        </motion.div>
      );
    }
  };
  return <Fragment>{renderPriceImpact()}</Fragment>;
};
