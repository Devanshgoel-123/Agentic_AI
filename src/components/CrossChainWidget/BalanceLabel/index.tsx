"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import dynamic from "next/dynamic";

import { useAccount } from "wagmi";
import useFetchTokenBalance from "@/hooks/Transfer/useFetchTokenBalance";
import useTransferStore from "@/store/transfer-store";
import { useShallow } from "zustand/react/shallow";
import { MdError } from "react-icons/md";

const CustomTextLoader = dynamic(() =>
  import("@/components/common/CustomTextLoader").then(
    (mod) => mod.CustomTextLoader
  )
);

interface Props {
  handleClick: () => void;
}

const returnPayTokenBalance = (
  loading: boolean,
  error: any,
  payTokenBalance: string,
  handleClick: () => void
) => {
  if (loading) {
    return (
      <span className="TokenBalance">
        <CustomTextLoader
          text={`Balance: ${
            Number(payTokenBalance) === 0
              ? "0.00"
              : Number(payTokenBalance).toFixed(8)
          }`}
        />
      </span>
    );
  } else if (error) {
    return (
      <span className="TokenBalance">
        Balance: <MdError />
      </span>
    );
  } else {
    return (
      <span className="TokenBalance" onClick={handleClick}>
        Balance:{" "}
        {Number(payTokenBalance) === 0
          ? "0.00"
          : Number(payTokenBalance).toFixed(8)}
      </span>
    );
  }
};

export const BalanceLabel = ({ handleClick }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { address } = useAccount();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { payToken, payTokenBalance, tokenInAmount } = useTransferStore(
    useShallow((state) => ({
      payToken: state.payToken,
      payTokenBalance: state.payTokenBalance,
      tokenInAmount: state.tokenInAmount,
    }))
  );

  const { loading, error } = useFetchTokenBalance({
    walletAddress: address,
    isRefetch: true,
    tokenDetails: payToken,
  });

  return (
    <>
      {isMounted &&
        returnPayTokenBalance(loading, error, payTokenBalance, handleClick)}
    </>
  );
};
