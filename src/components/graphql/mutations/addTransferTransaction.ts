import { gql } from "@apollo/client";

export const ADD_TRANSFER_TRANSACTION = gql`
  mutation CreateSwap(
    $walletAddress: String!
    $sourceChainTokenName: String!
    $sourceChainHash: String!
    $sourceChainId: Int!
    $destChainId: Int!
    $sourceChainImage: String!
    $destChainImage: String!
    $sourceTokenImage: String!
    $destTokenImage: String!
    $sourceChainAmount: String!
    $type: String!
  ) {
    createSwap(
      createSwapData: {
        walletAddress: $walletAddress
        sourceChainTokenName: $sourceChainTokenName
        sourceChainHash: $sourceChainHash
        sourceChainId: $sourceChainId
        destChainId: $destChainId
        sourceChainImage: $sourceChainImage
        destChainImage: $destChainImage
        sourceTokenImage: $sourceTokenImage
        destTokenImage: $destTokenImage
        sourceChainAmount: $sourceChainAmount
        type: $type
      }
    ) {
      id
      walletAddress
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
    }
  }
`;
