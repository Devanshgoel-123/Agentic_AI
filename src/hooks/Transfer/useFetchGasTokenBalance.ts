import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import useWalletConnectStore from "@/store/wallet-store";

import { GET_TOKEN_BALANCE } from "@/components/graphql/queries/getTokenBalance";
import { ChainIds, WALLET_TYPES } from "@/utils/enums";
import { convertBigIntToUIFormat } from "@/utils/number";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  tokenId: number | undefined;
  tokenDecimal: number | undefined;
  sourceChain: number | undefined;
}

const useFetchGasTokenBalance = ({
  tokenId,
  sourceChain,
  tokenDecimal,
}: Props) => {
  const { address } = useAccount();
  const { btcWalletAddress } = useWalletConnectStore();
  const { publicKey } = useWallet();
  const { loading, error, data } = useQuery(GET_TOKEN_BALANCE, {
    variables: {
      walletAddress:
        Number(sourceChain) === ChainIds.BITCOIN ? btcWalletAddress : address,
      tokenId: Number(tokenId),
      type:
        Number(sourceChain) === ChainIds.BITCOIN
          ? WALLET_TYPES.BITCOIN
          : Number(sourceChain) === ChainIds.SOLANA
          ? WALLET_TYPES.SOLANA
          : WALLET_TYPES.EVM,
    },
    skip:
      !address ||
      (sourceChain === ChainIds.BITCOIN && !btcWalletAddress) ||
      (sourceChain === ChainIds.SOLANA && !publicKey) ||
      !tokenId ||
      !sourceChain ||
      !tokenDecimal,
    fetchPolicy: "no-cache",
  });

  return {
    loading,
    error,
    data:
      data && data.getBalanceOfTokenForUserWallet
        ? {
            balance: convertBigIntToUIFormat(
              data.getBalanceOfTokenForUserWallet.balance,
              Number(tokenDecimal)
            ).toString(),
          }
        : {
            balance: "0",
          },
  };
};

export default useFetchGasTokenBalance;
