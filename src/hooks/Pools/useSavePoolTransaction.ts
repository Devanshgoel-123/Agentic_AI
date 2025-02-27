import { useMutation } from "@apollo/client";
import { useAccount } from "wagmi";
import { ADD_POOL_TRANSACTION } from "@/components/graphql/mutations/addPoolTransaction";

const useSavePoolTransaction = () => {
  const { address } = useAccount();
  const [addPool] = useMutation(ADD_POOL_TRANSACTION);
  const handleSubmitTransaction = async (
    hash: string,
    type: string,
    sourceChainId: number,
    sourceChainImage: string,
    destChainImage: string,
    poolImages: String[],
    poolType: String,
    poolName: String
  ) => {
    if (!hash || !address || poolImages.length === 0 || !poolImages) {
      return;
    }

    try {
      await addPool({
        variables: {
          walletAddress: address,
          sourceChainHash: hash,
          type: type,
          poolTokenImages: poolImages,
          sourceChainId: sourceChainId,
          poolType: poolType,
          poolName: poolName,
          sourceChainImage: sourceChainImage,
          destChainImage: destChainImage,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { handleSubmitTransaction };
};

export default useSavePoolTransaction;
