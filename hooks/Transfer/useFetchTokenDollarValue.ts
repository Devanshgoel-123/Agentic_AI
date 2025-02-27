"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
} from "@apollo/client";

import { GET_TOKEN_DOLLAR_VALUE } from "@/components/graphql/queries/getDollarValueOfToken";

interface Props {
  tokenId: number;
  tokenAmount?: string;
}

const useFetchTokenDollarValue = ({ tokenId, tokenAmount }: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_TOKEN_DOLLAR_VALUE, {
    variables: { tokenId: tokenId },
    skip: !tokenId,
  });
 
  const refetchRef =
    useRef<
      (
        variables?: Partial<OperationVariables> | undefined
      ) => Promise<ApolloQueryResult<any>>
    >(refetch);

  useEffect(() => {
    if (tokenAmount) {
      refetchRef.current();
    }
  }, [tokenAmount, refetchRef]);
  
  return {
    loading,
    error,
    data:
      data && data.getDollarValueForToken
        ? Number(data.getDollarValueForToken.price) /
          10 ** Math.abs(data.getDollarValueForToken.expo)
        : 0,
  };
};

export default useFetchTokenDollarValue;
