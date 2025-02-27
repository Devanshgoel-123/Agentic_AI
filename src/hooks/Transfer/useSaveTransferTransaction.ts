import { useRef } from "react";
import { useAccount } from "wagmi";
import { useMutation } from "@apollo/client";
import useTransferStore from "@/store/transfer-store";
import useWalletConnectStore from "@/store/wallet-store";

import { ADD_TRANSFER_TRANSACTION } from "@/components/graphql/mutations/addTransferTransaction";
import { ChainIds, TRANSFER_ACTION_TYPE } from "@/utils/enums";

const useSaveTransferTransaction = () => {
  const [createSwap] = useMutation(ADD_TRANSFER_TRANSACTION);
  const previousHash = useRef<string | null>(null); // Store previous hash
  const handleSubmitTransaction = async (hash: string, address: string) => {
    if (previousHash.current === hash) {
      return;
    }
    try {
      await createSwap({
        variables: {
          walletAddress: address,
          sourceChainHash: hash,
          sourceChainId: useTransferStore.getState().payChain,
          destChainId: useTransferStore.getState().getChain,
          type:
            useTransferStore.getState().payChain ===
            useTransferStore.getState().getChain
              ? TRANSFER_ACTION_TYPE.SWAP
              : TRANSFER_ACTION_TYPE.BRIDGE,
          sourceChainImage:
            useTransferStore.getState().payToken?.chain.chainLogo,
          destChainImage: useTransferStore.getState().getToken?.chain.chainLogo,
          sourceChainTokenName: useTransferStore.getState().payToken?.name,
          sourceTokenImage: useTransferStore.getState().payToken?.tokenLogo,
          destTokenImage: useTransferStore.getState().getToken?.tokenLogo,
          sourceChainAmount: useTransferStore.getState().tokenInAmount,
          zetaChainHash: "",
          destChainHash: "",
        },
      });
      previousHash.current = hash;
    } catch (err) {
      console.error(err);
      throw new Error(`Error in saving transfer transactions:${err}`);
    }
  };

  return { handleSubmitTransaction };
};

export default useSaveTransferTransaction;
