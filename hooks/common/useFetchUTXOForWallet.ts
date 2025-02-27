import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_BTC_WALLET_UTXO } from "@/components/graphql/queries/getUTXOForWallet";

const useFetchUTXOForWallet = () => {
  const [getBTCUtxo] = useLazyQuery(GET_BTC_WALLET_UTXO);

  return {
    getBTCUtxo,
  };
};

export default useFetchUTXOForWallet;
