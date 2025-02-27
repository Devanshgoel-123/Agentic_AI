import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import useTransferStore from "@/store/transfer-store";

import { GET_DEFAULT_BRIDGEABLE_TOKENS } from "@/components/graphql/queries/getDefaultTokenByChainId";
import { Token } from "@/store/types/token-type";
import { useAgentStore } from "@/store/agent-store";

interface Props {
  chainId: number;
  actionType: string;
  isSkip: boolean;
}

const useFetchDefaultTokens = ({ chainId, actionType, isSkip}: Props) => {
  const [getDefaultTokensForChain, { loading, error, data }] = useLazyQuery(
    GET_DEFAULT_BRIDGEABLE_TOKENS
  );

  const handleGetDefaultTokens = (chain: number) => {
    getDefaultTokensForChain({ variables: { chainId: chain } });
  };

  useEffect(() => {
    if (data && data.getAllDefaultBridgeableTokensForChain) {
      const response = data.getAllDefaultBridgeableTokensForChain[0];
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
        if (actionType === "From") {
          useTransferStore.getState().setPayToken(tokenObject);
          useTransferStore.getState().setPayChainGasTokenId(tokenObject.id);
          useTransferStore.getState().setPayChainGasToken(tokenObject);
        } else {
          useTransferStore.getState().setGetToken(tokenObject);
          useTransferStore.getState().setGetChainGasTokenId(tokenObject.id);
          useTransferStore.getState().setGetChainGasToken(tokenObject);
      }
    }
  }, [data, actionType]);

  return {
    loading,
    error,
    getDefaultTokens: handleGetDefaultTokens,
  };
};

export default useFetchDefaultTokens;
