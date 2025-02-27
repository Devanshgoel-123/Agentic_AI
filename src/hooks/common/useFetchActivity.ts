import { GET_TX_HISTORY } from "@/components/graphql/queries/getTransactionHistoryForWallet";
import { TransactionHistory } from "@/store/types/transaction-type";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface Props {
  currentPage: number;
  limit: number;
}

const useFetchActivity = ({ currentPage, limit }: Props) => {
  const { address } = useAccount();
  const [items, setItems] = useState<TransactionHistory[]>([]);
  const { loading, error, data, fetchMore } = useQuery(GET_TX_HISTORY, {
    variables: {
      walletAddress: address,
      currentPage: currentPage,
      limit: limit,
    },
    skip: !address,
  });

  useEffect(() => {
    setItems([]);
  }, [address]);

  useEffect(() => {
    if (data && data.getTxnHistoryForWallet) {
      setItems((prev) => [
        ...prev,
        ...(data.getTxnHistoryForWallet
          .userTransactions as TransactionHistory[]),
      ]);
    }
  }, [data]);
  return {
    loading,
    error,
    data: items,
    total:
      data && data.getTxnHistoryForWallet
        ? data.getTxnHistoryForWallet.totalPages
        : 1,
    fetchMore,
  };
};

export default useFetchActivity;
