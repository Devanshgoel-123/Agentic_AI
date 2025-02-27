import { useQuery } from "@apollo/client";
import { PositionsResponse } from "@/store/types/pool-type";
import { GET_POSITIONS_FOR_WALLET } from "@/components/graphql/queries/getPositions";

interface Props {
  wallet: `0x${string}` | undefined;
}

const useFetchPositionsForWallet = ({ wallet }: Props) => {
  const { loading, error, data } = useQuery(GET_POSITIONS_FOR_WALLET, {
    variables: {
      owner: wallet,
    },
  });

  return {
    loading,
    error,
    data:
      data && data.getPositionData
        ? (data.getPositionData.positions as PositionsResponse[])
        : [],
    contract:
      data && data.getPositionData
        ? data.getPositionData.postionManagerAddress
        : "",
  };
};

export default useFetchPositionsForWallet;
