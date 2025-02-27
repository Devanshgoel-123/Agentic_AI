"use client";
import { useQuery } from "@apollo/client";

import { ResponseToken } from "@/store/types/token-type";
import { GET_BRIDGEABLE_TOKENS } from "@/components/graphql/queries/getTokenByChainId";
import useTransferStore from "@/store/transfer-store";
import { ChainIds } from "@/utils/enums";
import { useAgentStore } from "@/store/agent-store";

interface Props {
  chainId: number;
  allowFetch: boolean;
  actionType: string;
}

const useFetchTokens = ({ chainId, allowFetch, actionType }: Props) => {
  const { loading, error, data } = useQuery(GET_BRIDGEABLE_TOKENS, {
    variables: {
      chainId: chainId,
      isSwap:
        useTransferStore.getState().payChain ===
        useTransferStore.getState().getChain,
      isSrcTokenUnsupported: actionType === "From",
    },
    skip: allowFetch,
    fetchPolicy: "no-cache",
  });
  return {
    loading,
    error,
    data:
      data && data.getAllBridgableTokensForChain
        ? data.getAllBridgableTokensForChain.map((item: ResponseToken) => ({
            id: item.id,
            isBridge: item.isBridge,
            isNative: item.isNative,
            isDefault: item.isDefault,
            isStable: item.isStable,
            address: item.address,
            zrc20Address: item.zrc20Address,
            name: item.name,
            chain: {
              chainId: item.chain.chainId,
              chainLogo: item.chain.chainLogo,
              name: item.chain.name,
            },
            decimal: item.decimal,
            tokenLogo: item.tokenLogo,
            pythId: item.pythId,
            unsupported: item.unsupported,
            isUniV3Supported: item.isUniV3Supported,
          }))
        : [],
  };
};

export default useFetchTokens;
