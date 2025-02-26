"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import useFetchActivity from "@/hooks/common/useFetchActivity";
import useWalletConnectStore from "@/store/wallet-store";

import CustomIcon from "@/components/common/CustomIcon";
import { ARROW_LEFT } from "@/utils/images";
import GradientText from "@/components/common/GradientText";
import { TransferActivityCard } from "../TransferActivityCard";
import { PoolsActivityCard } from "../PoolsActivityCard";
import { TransactionHistory } from "@/store/types/transaction-type";
import { TRANSFER_ACTION_TYPE } from "@/utils/enums";
import { CustomTextLoader } from "@/components/common/CustomTextLoader";
import { PiEmptyBold } from "react-icons/pi";

export const ActivityContainer = () => {
  const { address } = useAccount();
  /**
   * Set current page to -> 1.
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { loading, error, data, total, fetchMore } = useFetchActivity({
    currentPage: currentPage,
    limit: 10,
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  /**
   * Function to trigger refetch to get next page data.
   * @param entries Intersection Observer Objects.
   * !Important -> Don't call this function if currentPage > total
   */
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && currentPage <= total) {
      fetchMore({
        variables: {
          currentPage: currentPage + 1,
          limit: 10,
        },
      }).then(() => {
        setCurrentPage((prev) => prev + 1);
      });
    }
  };

  const handleObserverRef =
    useRef<(entries: IntersectionObserverEntry[]) => void>(handleObserver);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserverRef.current, {
      root: null, // Default: viewport
      rootMargin: "20px",
      threshold: 0.1,
    });
    const observerRefData = observerRef.current;

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRefData) {
        observer.unobserve(observerRefData);
      }
    };
  }, [handleObserverRef]);

  const returnActivityState = () => {
    if (!address) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            useWalletConnectStore.getState().handleOpen();
          }}
          className="ConnectWalletState"
        >
          <span className="Label">
            Please connect your wallet to view transaction history.
          </span>
          <div className="ConnectWalletBtn">Connect Wallet</div>
        </motion.div>
      );
    } else {
      return (
        <>
          {data &&
            data.length > 0 &&
            data.map((el: TransactionHistory, index) =>
              el.type === TRANSFER_ACTION_TYPE.SWAP ||
              el.type === TRANSFER_ACTION_TYPE.BRIDGE ? (
                <TransferActivityCard
                  key={`${el.sourceChainHash}+${index}`}
                  sourceChainAmount={el.sourceChainAmount as string}
                  sourceChainImage={el.sourceChainImage as string}
                  destChainImage={el.destChainImage as string}
                  sourceTokenImage={el.sourceTokenImage as string}
                  destTokenImage={el.destTokenImage as string}
                  sourceChainHash={el.sourceChainHash as string}
                  zetaChainHash={
                    el.zetaChainHash ? el.zetaChainHash : undefined
                  }
                  destChainHash={
                    el.destChainHash ? el.destChainHash : undefined
                  }
                  sourceTokenName={el?.sourceChainTokenName as string}
                  sourceChainId={el.sourceChainId as number}
                  destinationChainId={el.sourceChainId as number}
                  createdAt={el.createdAt as number}
                />
              ) : (
                <PoolsActivityCard
                  key={`${el.sourceChainHash}+${index}`}
                  type={el.type as string}
                  poolName={el.poolName as string}
                  poolType={el.poolType as string}
                  poolTokenImages={el.poolTokenImages as string[]}
                  sourceChainHash={el.sourceChainHash as string}
                  sourceChainId={el.sourceChainId as number}
                  sourceChainImage={el.sourceChainImage as string}
                />
              )
            )}
          {data && data.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="EmptyPlaceHolder"
            >
              <motion.span
                transition={{ delay: 0.2 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="LabelIcon"
              >
                <PiEmptyBold />
              </motion.span>
              <span className="Label">You have no transactions on Eddy V2</span>
              <Link style={{ textDecoration: "none" }} href={"/"}>
                <div className="ConnectWalletBtn">Trade now</div>
              </Link>
            </motion.div>
          )}
          <div ref={observerRef} className="Placeholder">
            {loading && (
              <>
                <CustomTextLoader text="Loading" />
              </>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className="ActivityContainer">
      <div className="HeadingContainer">
        <div
          className="ArrowIcon"
          onClick={() => {
            router.back();
          }}
        >
          <CustomIcon src={ARROW_LEFT} />
        </div>
        <span className="HeadingText">
          <GradientText text="Transactions" />
        </span>
      </div>
      <div className="ActivityCardContainer">{returnActivityState()}</div>
    </div>
  );
};
