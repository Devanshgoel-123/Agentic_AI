import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_DEFAULT_BRIDGEABLE_TOKENS } from "@/components/graphql/queries/getDefaultTokenByChainId";
import { Token } from "@/store/types/token-type";
import useDustAggregatorStore from "@/store/dust-aggregator-store";

interface Props {
  chainId: number;
  actionType: string;
}

const useFetchDefaultChainDetails = ({ chainId, actionType }: Props) => {
  const [getDefaultTokensForChain, { loading, error, data }] = useLazyQuery(
    GET_DEFAULT_BRIDGEABLE_TOKENS
  );

  const handleGetDefaultTokens = (chain: number) => {
    getDefaultTokensForChain({ variables: { chainId: chain } });
  };

  useEffect(() => {
    if (data && data.getAllDefaultBridgeableTokensForChain) {
      const response = data.getAllDefaultBridgeableTokensForChain[0];
      const defaultDestinationGasToken =
        data.getAllDefaultBridgeableTokensForChain.filter(
          (item: Token) => item.isNative === true
        )[0];
      const defaultSourceGasToken =
        data.getAllDefaultBridgeableTokensForChain.filter(
          (item: Token) => item.isNative === true
        )[0];
      const tokenObject: Token = {
        id: response.id,
        isBridge: response.isBridge,
        isNative: response.isNative,
        isDefault: response.isDefault,
        isStable: response.isStable,
        name: response.name,
        address: response.address,
        zrc20Address: response.zrc20Address,
        chain: {
          chainId: response.chain.chainId,
          chainLogo: response.chain.chainLogo,
          name: response.chain.name,
        },
        decimal: response.decimal,
        tokenLogo: response.tokenLogo,
        pythId: response.pythId,
        curveIndex: response.curveIndex,
        unsupported: response.unsupported,
        isUniV3Supported: response.isUniV3Supported,
      };
      const DestinationGasTokenObject: Token = {
        id: defaultDestinationGasToken.id,
        isBridge: defaultDestinationGasToken.isBridge,
        isNative: defaultDestinationGasToken.isNative,
        isDefault: defaultDestinationGasToken.isDefault,
        isStable: defaultDestinationGasToken.isStable,
        name: defaultDestinationGasToken.name,
        address: defaultDestinationGasToken.address,
        zrc20Address: defaultDestinationGasToken.zrc20Address,
        chain: {
          chainId: defaultDestinationGasToken.chain.chainId,
          chainLogo: defaultDestinationGasToken.chain.chainLogo,
          name: defaultDestinationGasToken.chain.name,
        },
        decimal: defaultDestinationGasToken.decimal,
        tokenLogo: defaultDestinationGasToken.tokenLogo,
        pythId: defaultDestinationGasToken.pythId,
        curveIndex: defaultDestinationGasToken.curveIndex,
        unsupported: defaultDestinationGasToken.unsupported,
        isUniV3Supported: response.isUniV3Supported,
      };
      const SourceGasTokenObject: Token = {
        id: defaultSourceGasToken.id,
        isBridge: defaultSourceGasToken.isBridge,
        isNative: defaultSourceGasToken.isNative,
        isDefault: defaultSourceGasToken.isDefault,
        isStable: defaultSourceGasToken.isStable,
        name: defaultSourceGasToken.name,
        address: defaultSourceGasToken.address,
        zrc20Address: defaultSourceGasToken.zrc20Address,
        chain: {
          chainId: defaultSourceGasToken.chain.chainId,
          chainLogo: defaultSourceGasToken.chain.chainLogo,
          name: defaultSourceGasToken.chain.name,
        },
        decimal: defaultSourceGasToken.decimal,
        tokenLogo: defaultSourceGasToken.tokenLogo,
        pythId: defaultSourceGasToken.pythId,
        curveIndex: defaultSourceGasToken.curveIndex,
        unsupported: defaultDestinationGasToken.unsupported,
        isUniV3Supported: response.isUniV3Supported,
      };
      if (actionType === "source") {
        useDustAggregatorStore
          .getState()
          .setDefaultSourceChainDetails(tokenObject);
        useDustAggregatorStore
          .getState()
          .setSourceChainGasToken(SourceGasTokenObject);
      } else {
        useDustAggregatorStore
          .getState()
          .setDefaultDestinationChainDetails(tokenObject);
        useDustAggregatorStore
          .getState()
          .setDestinationToken(DestinationGasTokenObject);
        useDustAggregatorStore
          .getState()
          .setDestinationChainGasToken(DestinationGasTokenObject);
      }
    }
  }, [data, actionType]);

  return {
    loading,
    error,
    getDefaultTokens: handleGetDefaultTokens,
  };
};

export default useFetchDefaultChainDetails;
