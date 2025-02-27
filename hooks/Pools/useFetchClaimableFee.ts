import { useQuery } from "@apollo/client";
import { GET_CLAIMABLE_FEE_FOR_WALLET } from "@/components/graphql/queries/getClaimableFee";

interface Props {
  wallet: `0x${string}` | undefined;
  nftId: number;
  isSkip: boolean;
}

const useFetchClaimableFee = ({ wallet, nftId, isSkip }: Props) => {
  const { loading, error, data } = useQuery(GET_CLAIMABLE_FEE_FOR_WALLET, {
    variables: { nftId: nftId },
    skip: isSkip,
  });

  return {
    loading,
    error,
    data:
      data && data.getClaimableFees
        ? data.getClaimableFees
        : {
            claimableFeesToken0: "0",
            claimableFeesToken1: "0",
          },
  };
};

export default useFetchClaimableFee;
