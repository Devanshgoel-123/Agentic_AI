"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

import { motion } from "framer-motion";
import lottie from "lottie-web";
import { ApolloError } from "@apollo/client";
import { simulateContract } from "@wagmi/core";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";
import { useShallow } from "zustand/react/shallow";

import { ValueType } from "@/hooks/Rewards/useFetchIncentivization";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { config } from "@/config";
import { PoolContractType } from "@/store/types/pool-type";

import { ChainIds } from "@/utils/enums";
import useSendClaimTransaction from "@/hooks/Rewards/useSendClaimTransaction";

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  value: ValueType | null;
  proofs: string[] | null;
  contract: PoolContractType | undefined;
}

export const IncentivesHeadingContainer = ({
  loading,
  error,
  value,
  proofs,
  contract,
}: Props) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const animationContainer = useRef<HTMLDivElement>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const { handleOpenWallet } = useWalletConnectStore(
    useShallow((state) => ({
      handleOpenWallet: state.handleOpen,
    }))
  );

  const { sendClaimTransaction, loading: claimLoading } =
    useSendClaimTransaction({
      contract: contract,
      chainId: 7000,
    });

  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current as HTMLDivElement,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Lottie/Incentives.json",
    });
  }, []);

  useEffect(() => {
    if (value && proofs && contract) {
      const result = simulateContract(config, {
        abi: contract?.abi,
        address: contract?.address as `0x${string}`,
        functionName: contract?.functionName,
        args: contract?.args,
      });
      result
        .then(() => {
          return null;
        })
        .catch((error) => {
          const errorObject = JSON.parse(JSON.stringify(error));
          if (errorObject.cause.reason === "Already claimed") {
            setIsClaimed(true);
          }
        });
    }

    return () => {
      setIsClaimed(false);
    };
  }, [value, proofs, contract]);

  const renderButtonState = () => {
    if (!address) {
      return (
        <div className="ClaimButton" onClick={handleOpenWallet}>
          Connect Wallet
        </div>
      );
    } else {
      if (loading || claimLoading) {
        return (
          <div className="ClaimButton">
            <CustomSpinner size={"20"} color="#323227" />
          </div>
        );
      } else if (error) {
        return null;
      } else if (chainId && chainId !== ChainIds.ZETACHAIN) {
        return (
          <div
            className="ClaimButton"
            onClick={() => {
              switchChain?.({ chainId: 7000 });
            }}
          >
            Switch Network
          </div>
        );
      } else {
        if (value && proofs) {
          if (isClaimed) {
            return <div className="ClaimButtonInActive">Claimed</div>;
          } else {
            return (
              <div className="ClaimButton" onClick={sendClaimTransaction}>
                Claim Now
              </div>
            );
          }
        } else {
          return <div className="ClaimButtonInActive">Not Eligible</div>;
        }
      }
    }
  };

  return (
    <motion.div
      transition={{ delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="IncentivesHeadingContainer"
    >
      <div className="BackdropContainer" ref={animationContainer}></div>
      <span className="Heading">
        <span className="Green">ZETA-Solana </span>Campaign.
      </span>
      <span className="SubHeading">$10k Incentives to be distributed</span>
      <span className="LabelText">Next Distribution on : 2 March</span>
      {renderButtonState()}
    </motion.div>
  );
};
