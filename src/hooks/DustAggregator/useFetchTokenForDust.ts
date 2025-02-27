"use client";
import { useQuery } from "@apollo/client";

import { ResponseToken } from "@/store/types/token-type";
import { GET_DEFAULT_BRIDGEABLE_DUST_TOKENS } from "@/components/graphql/queries/getDefaultDustTokensByChainId";

interface Props {
  chainId: number;
  allowFetch: boolean;
  chainType:string;
  
}

const useFetchTokenForDust = ({ chainId, allowFetch,chainType }: Props) => {
  const { loading, error, data } = useQuery(GET_DEFAULT_BRIDGEABLE_DUST_TOKENS, {
    variables: {
      chainId: chainId,
      chainType: chainType
    },
    skip: allowFetch,
  });
  return {
    loading,
    error,
    data:
      data && data.getAllBridgableTokensForChainDustAggregator
        ? data.getAllBridgableTokensForChainDustAggregator.map((item: ResponseToken) => ({
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
            feeTier:item.feeTier,
            intermediateToken:item.intermediateToken
          }))
        : [],
  };
};

export default useFetchTokenForDust;
