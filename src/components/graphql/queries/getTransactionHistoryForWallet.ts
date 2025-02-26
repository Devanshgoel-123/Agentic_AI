import { gql } from "@apollo/client";

export const GET_TX_HISTORY = gql`
  query ($walletAddress: String!, $currentPage: Int!, $limit: Int!) {
    getTxnHistoryForWallet(
      txnHistInput: {
        walletAddress: $walletAddress
        currentPage: $currentPage
        limit: $limit
      }
    ) {
      currentPage
      totalPages
      totalTransactionsNumber
      userTransactions {
        id
        walletAddress
        type
        poolName
        poolType
        poolTokenImages
        sourceChainHash
        sourceChainId
        destChainId
        sourceChainImage
        destChainImage
        sourceTokenImage
        destTokenImage
        sourceChainAmount
        zetaChainHash
        destChainHash
        createdAt
        sourceChainTokenName
      }
    }
  }
`;
