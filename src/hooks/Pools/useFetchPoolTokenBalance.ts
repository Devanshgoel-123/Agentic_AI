import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

import { GET_TOKEN_BALANCE } from "@/components/graphql/queries/getTokenBalance";
import { Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  formattedValueToDecimals,
} from "@/utils/number";
import { WALLET_TYPES } from "@/utils/enums";

interface Props {
  isRefetch?: boolean;
  tokenDetails?: Token;
  setterFunction?: (token: Token, balance: string) => void;
}

const useFetchPoolTokenBalance = ({
  isRefetch,
  tokenDetails,
  setterFunction,
}: Props) => {
  const { address } = useAccount();
  const { loading, error, data } = useQuery(GET_TOKEN_BALANCE, {
    variables: {
      walletAddress: address,
      tokenId: Number(tokenDetails?.id),
      type: WALLET_TYPES.EVM,
    },
    skip: !address,
    fetchPolicy: "no-cache",
    pollInterval: isRefetch ? 5000 : 0,
  });

  const setterFunctionRef = useRef<
    ((token: Token, balance: string) => void) | undefined
  >(setterFunction);
  useEffect(() => {
    if (data && data.getBalanceOfTokenForUserWallet && isRefetch) {
      const formattedBalance = convertBigIntToUIFormat(
        data.getBalanceOfTokenForUserWallet.balance,
        Number(tokenDetails?.decimal)
      ).toString();
      setterFunctionRef.current?.(tokenDetails as Token, formattedBalance);
    }
  }, [data, isRefetch, tokenDetails, setterFunctionRef]);

  return {
    loading,
    error,
    data:
      data && data.getBalanceOfTokenForUserWallet
        ? {
            balance: data.getBalanceOfTokenForUserWallet.balance,
            dollarValueAsset:
              data.getBalanceOfTokenForUserWallet.dollarValueAsset,
          }
        : {
            balance: "0",
            dollarValueAsset: 0,
          },
  };
};

export default useFetchPoolTokenBalance;
