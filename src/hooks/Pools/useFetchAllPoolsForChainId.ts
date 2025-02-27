import { useQuery } from "@apollo/client";
import { GET_ALL_POOLS } from "@/components/graphql/queries/getPoolsData";

interface Props {
  sortByTVL: boolean;
  isAscending: boolean;
}

const useFetchAllPoolsForChainId = ({ sortByTVL, isAscending }: Props) => {
  const { loading, error, data } = useQuery(GET_ALL_POOLS, {
    variables: {
      chainId: 7000,
      sortByTvl: sortByTVL,
      isAscending: isAscending,
    },
  });

  return {
    loading,
    error,
    data: data && data.getPools ? data.getPools : [],
  };
};

export default useFetchAllPoolsForChainId;
