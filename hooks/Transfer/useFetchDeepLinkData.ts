import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import useTransferStore from "@/store/transfer-store";
import useFetchDefaultTokens from "./useFetchDefaultTokens";

import { Token } from "@/store/types/token-type";
import { GET_DEEP_LINK_DATA } from "@/components/graphql/queries/getDeepLinkData";
import { DEFAULT_GETCHAIN, DEFAULT_PAYCHAIN } from "@/utils/constants";

const useFetchDeepLinkData = () => {
  const searchParams = useSearchParams();
  const { getDefaultTokens: getDefaultPayToken, loading: fallbackLoading } =
    useFetchDefaultTokens({
      chainId: DEFAULT_PAYCHAIN,
      actionType: "From",
      isSkip: false,
    });
  const { getDefaultTokens: getDefaultGetToken, loading: fallbackGetLoading } =
    useFetchDefaultTokens({
      chainId: DEFAULT_GETCHAIN,
      actionType: "To",
      isSkip: false,
    });
  const { loading, error, data } = useQuery(GET_DEEP_LINK_DATA, {
    variables: {
      sourceChain: Number(searchParams.get("sourcechain")),
      sourceToken: searchParams.get("sourcetoken"),
      destinationChain: Number(searchParams.get("destinationchain")),
      destinationToken: searchParams.get("destinationtoken"),
    },
    skip:
      !Number(searchParams.get("sourcechain")) ||
      !searchParams.get("sourcetoken") ||
      !Number(searchParams.get("destinationchain")) ||
      !searchParams.get("destinationtoken"),
    onError: () => {
      /**
       * If search params are not valid fetch default tokens.
       */
      getDefaultPayToken(DEFAULT_PAYCHAIN);
      getDefaultGetToken(DEFAULT_GETCHAIN);
    },
  });

  useEffect(() => {
    if (data && data.getTokenDataFromAddress) {
      const response = data.getTokenDataFromAddress;
      const sourceTokenObject: Token = {
        id: response.sourceToken.id,
        isBridge: response.sourceToken.isBridge,
        isNative: response.sourceToken.isNative,
        isDefault: response.sourceToken.isDefault,
        isStable: response.sourceToken.isStable,
        name: response.sourceToken.name,
        address: response.sourceToken.address,
        zrc20Address: response.sourceToken.zrc20Address,
        chain: {
          chainId: response.sourceToken.chain.chainId,
          chainLogo: response.sourceToken.chain.chainLogo,
          name: response.sourceToken.chain.name,
        },
        decimal: response.sourceToken.decimal,
        tokenLogo: response.sourceToken.tokenLogo,
        pythId: response.sourceToken.pythId,
        curveIndex: response.sourceToken.curveIndex,
        unsupported: response.sourceToken.unsupported,
        isUniV3Supported: response.sourceToken.isUniV3Supported,
      };
      const destinationTokenObject: Token = {
        id: response.destinationToken.id,
        isBridge: response.destinationToken.isBridge,
        isNative: response.destinationToken.isNative,
        isDefault: response.destinationToken.isDefault,
        isStable: response.destinationToken.isStable,
        name: response.destinationToken.name,
        address: response.destinationToken.address,
        zrc20Address: response.destinationToken.zrc20Address,
        chain: {
          chainId: response.destinationToken.chain.chainId,
          chainLogo: response.destinationToken.chain.chainLogo,
          name: response.destinationToken.chain.name,
        },
        decimal: response.destinationToken.decimal,
        tokenLogo: response.destinationToken.tokenLogo,
        pythId: response.destinationToken.pythId,
        curveIndex: response.destinationToken.curveIndex,
        unsupported: response.destinationTokenObject.unsupported,
        isUniV3Supported: response.destinationTokenObject.isUniV3Supported,
      };
      useTransferStore.getState().setPayToken(sourceTokenObject);
      useTransferStore.getState().setPayChain(sourceTokenObject.chain.chainId);
      useTransferStore
        .getState()
        .setPayChainGasTokenId(response.sourceGasTokenID);
      useTransferStore
        .getState()
        .setPayChainGasToken(response.sourceChainGasToken);
      useTransferStore.getState().setGetToken(destinationTokenObject);
      useTransferStore
        .getState()
        .setGetChain(destinationTokenObject.chain.chainId);
      useTransferStore
        .getState()
        .setGetChainGasTokenId(response.destinationGasTokenID);
      useTransferStore
        .getState()
        .setGetChainGasToken(response.destinationChainGasToken);
    }
  }, [data]);

  //   useEffect(() => {
  //     const sourceChain = Number(searchParams.get("sourcechain"));
  //     const sourceToken = searchParams.get("sourcetoken");
  //     const destinationChain = Number(searchParams.get("destinationchain"));
  //     const destinationToken = searchParams.get("destinationtoken");
  //     console.log(sourceChain, sourceToken, destinationChain, destinationToken);
  //   }, []);

  return {
    loading: loading || fallbackLoading || fallbackGetLoading,
    error,
  };
};

export default useFetchDeepLinkData;
