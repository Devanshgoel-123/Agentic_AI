import { useQuery } from "@apollo/client";
import { GET_SINGLE_POOLS } from "@/components/graphql/queries/getSinglePoolData";
import { SinglePoolResponse } from "@/store/types/pool-type";
import { EDDY_LOGO } from "@/utils/images";

interface Props {
  poolId: string;
}

const useFetchSinglePoolData = ({ poolId }: Props) => {
  const { loading, error, data } = useQuery(GET_SINGLE_POOLS, {
    variables: { chainId: 7000, slug: poolId },
  });

  return {
    loading,
    error,
    data:
      data && data.getIndividualPool
        ? (data.getIndividualPool as SinglePoolResponse)
        : ({
            chainId: 7000,
            name: "",
            tvl: 0,
            apy: 0,
            lpFee: 0,
            lpTokenAddress: "",
            lpTokenImage: EDDY_LOGO,
            lpTokenDecimals: 18,
            lpSymbol: "",
            totalReserve: [],
            contractAddress: "",
            routerAddress: "",
            dailyVolume: 0,
            poolType: "",
            boostInfo: [],
            tokens: [],
          } as SinglePoolResponse),
  };
};

export default useFetchSinglePoolData;
