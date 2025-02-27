import { useQuery } from "@apollo/client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import useTransferStore from "@/store/transfer-store";

import { GET_QUOTE_FOR_TRANSACTION } from "@/components/graphql/queries/getQuoteForTransaction";
import { ContractConfig, Token } from "@/store/types/token-type";
import {
  convertBigIntToUIFormat,
  convertUIFormatToBigInt,
} from "@/utils/number";
import useWalletConnectStore from "@/store/wallet-store";
import useFetchTokenDollarValue from "./useFetchTokenDollarValue";
import { ChainIds } from "@/utils/enums";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  fromAmount: string;
  fromChainId: number;
  fromToken: Token | undefined;
  toChainId: number;
  toToken: Token | undefined;
  fromTokenId: number;
  toTokenId: number;
  slippage: number;
  walletAddress: `0x${string}` | undefined;
  isSkip: boolean;
  isRefetch?: boolean;
  timerFunction?: React.Dispatch<React.SetStateAction<number>>;
}

const useFetchQuoteForTransaction = ({
  fromAmount,
  fromChainId,
  fromToken,
  toChainId,
  toToken,
  fromTokenId,
  toTokenId,
  slippage,
  walletAddress,
  isSkip,
  isRefetch,
  timerFunction,
}: Props) => {
  const { btcWalletAddress, destinationAddress } = useWalletConnectStore();
  const { publicKey } = useWallet();
  const { data: fromTokenDollarValue } = useFetchTokenDollarValue({
    tokenId: useTransferStore.getState().payChainGasTokenId as number,
  });
  const { data: toTokenDollarValue } = useFetchTokenDollarValue({
    tokenId: useTransferStore.getState().getChainGasTokenId as number,
  });

  const returnWalletAddress = () => {
    if (toChainId === ChainIds.BITCOIN) {
      return btcWalletAddress
        ? btcWalletAddress
        : destinationAddress
        ? destinationAddress
        : "";
    } else if (toChainId === ChainIds.SOLANA) {
      return publicKey ? publicKey : "";
    } else {
      return undefined;
    }
  };

  const { loading, error, data, refetch } = useQuery(
    GET_QUOTE_FOR_TRANSACTION,
    {
      variables: {
        fromAmount: convertUIFormatToBigInt(
          fromAmount,
          Number(fromToken?.decimal ?? 18)
        ).toString(),
        fromChainId: fromChainId,
        toChainId: toChainId,
        fromTokenId: fromTokenId,
        toTokenId: toTokenId,
        slippage: slippage,
        walletAddress:
          !walletAddress || typeof walletAddress === undefined
            ? ""
            : walletAddress,
        btcWalletAddress: returnWalletAddress(),
      },
      skip: isSkip,
      fetchPolicy: isRefetch ? "no-cache" : "cache-first",
    }
  );

  const timerFunctionRef = useRef<Dispatch<SetStateAction<number>> | undefined>(
    timerFunction
  );

  useEffect(() => {
    if (isRefetch && !isSkip) {
      const interval = setInterval(() => {
        timerFunctionRef.current?.((prevTimer: number) => {
          if (prevTimer <= 0) {
            refetch();
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRefetch, refetch, isSkip, timerFunctionRef]);

  useEffect(() => {
    if (data && data.getQuoteForBridgeData) {
      console.log("the data is:",data)
      useTransferStore
        .getState()
        .setTokenOutAmount(
          isNaN(data.getQuoteForBridgeData.quoteAmount)
            ? "0"
            : convertBigIntToUIFormat(
                data.getQuoteForBridgeData.quoteAmount,
                toToken?.decimal ?? 18
              )
        );
      useTransferStore
        .getState()
        .setEstimatedReceived(
          isNaN(data.getQuoteForBridgeData.estimatedRecievedAmount)
            ? "0"
            : convertBigIntToUIFormat(
                data.getQuoteForBridgeData.estimatedRecievedAmount,
                toToken?.decimal ?? 18
              )
        );
      useTransferStore
        .getState()
        .setDestinationGas(
          (
            Number(data.getQuoteForBridgeData.destChainGasFees) *
            Number(toTokenDollarValue)
          ).toString()
        );
      useTransferStore
        .getState()
        .setMinimumReceived(
          isNaN(data.getQuoteForBridgeData.minimumReceived)
            ? "0"
            : convertBigIntToUIFormat(
                Number(
                  data.getQuoteForBridgeData.minimumReceived
                ).toLocaleString("fullwide", { useGrouping: false }),
                toToken?.decimal ?? 18
              )
        );
      useTransferStore
        .getState()
        .setSourceChainGas(
          (
            Number(data.getQuoteForBridgeData.srcChainGasFees) *
            Number(fromTokenDollarValue)
          ).toString()
        );
      useTransferStore
        .getState()
        .setZetaChainGas(data.getQuoteForBridgeData.zetaFees.toString());
      useTransferStore
        .getState()
        .setProtocolFee(data.getQuoteForBridgeData.protocolFees);
      useTransferStore.getState().setRoute(data.getQuoteForBridgeData.route);
      if (data.getQuoteForBridgeData.contractConfig) {
        const configResponse: ContractConfig =
          data.getQuoteForBridgeData.contractConfig;
        const config = {
          address: configResponse?.address,
          abi: configResponse?.abi,
          args: configResponse?.args,
          functionName: configResponse?.functionName,
          to: configResponse?.to,
          value: configResponse?.value?.toString(),
          data: configResponse.data,
        };
        useTransferStore.getState().setContractConfig(config);
      }
      useTransferStore
        .getState()
        .setEstimatedTime(
          Math.ceil(Number(data.getQuoteForBridgeData.estimatedTime))
        );
    }
  }, [data, fromToken, toToken]);

  return { loading, error, refetch };
};

export default useFetchQuoteForTransaction;
