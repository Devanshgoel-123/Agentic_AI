import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import useTransferStore from "@/store/transfer-store";
import useWalletConnectStore from "@/store/wallet-store";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { GET_TOKEN_BALANCE } from "@/components/graphql/queries/getTokenBalance";
import { Token } from "@/store/types/token-type";
import { convertBigIntToUIFormat } from "@/utils/number";
import { ChainIds, WALLET_TYPES } from "@/utils/enums";

interface Props {
  walletAddress: `0x${string}` | undefined;
  isRefetch?: boolean;
  tokenDetails?: Token;
  balance?: string;
  setterFunction?: (token: Token, balance: string) => void;
  setterCallBack?: () => void;
}

const useFetchTokenBalance = ({
  isRefetch,
  tokenDetails,
  balance,
  setterFunction,
  setterCallBack,
}: Props) => {
  const { address } = useAccount();
  const { publicKey } = useWallet();
  const { payChain } = useTransferStore(
    useShallow((state) => ({
      payChain: state.payChain,
    }))
  );

  const { btcWalletAddress } = useWalletConnectStore();
  const { loading, error, data } = useQuery(GET_TOKEN_BALANCE, {
    variables: {
      walletAddress:
        Number(tokenDetails?.chain.chainId) === ChainIds.BITCOIN
          ? btcWalletAddress
          : Number(tokenDetails?.chain.chainId) === ChainIds.SOLANA
          ? publicKey
          : address,
      tokenId: Number(tokenDetails?.id),
      type:
        Number(tokenDetails?.chain.chainId) === ChainIds.BITCOIN
          ? WALLET_TYPES.BITCOIN
          : Number(tokenDetails?.chain.chainId) === ChainIds.SOLANA
          ? WALLET_TYPES.SOLANA
          : WALLET_TYPES.EVM,
    },
    skip:
      (!address &&
        tokenDetails?.chain.chainId !== ChainIds.BITCOIN &&
        tokenDetails?.chain.chainId !== ChainIds.SOLANA) ||
      (tokenDetails?.chain.chainId === ChainIds.BITCOIN && !btcWalletAddress) ||
      (tokenDetails?.chain.chainId === ChainIds.SOLANA && !publicKey) ||
      (balance !== undefined && !isRefetch),
    fetchPolicy: "no-cache",
    pollInterval: isRefetch ? 5000 : 0,
    onCompleted: (data) => {
      /**
       * !Important
       * set data from response if balance is undefined
       * and isRefetch is false
       * to update data in sorted manner.
       */
      if (!balance && !isRefetch) {
        setterFunction?.(
          tokenDetails as Token,
          data.getBalanceOfTokenForUserWallet.balance
        );
        setterCallBack?.();
      }
    },
  });

  useEffect(() => {
    if (data && data.getBalanceOfTokenForUserWallet && isRefetch) {
      const formattedBalance = convertBigIntToUIFormat(
        data.getBalanceOfTokenForUserWallet.balance,
        Number(tokenDetails?.decimal)
      ).toString();
      useTransferStore
        .getState()
        .setPayTokenBalance(formattedBalance.toString());
    }
  }, [data, isRefetch, tokenDetails]);

  return {
    loading,
    error,
    data:
      data && data.getBalanceOfTokenForUserWallet
        ? {
            balance: data.getBalanceOfTokenForUserWallet.balance,
          }
        : {
            balance: "0",
          },
  };
};

export default useFetchTokenBalance;
