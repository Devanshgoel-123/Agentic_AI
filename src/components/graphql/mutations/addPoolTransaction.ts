import { gql } from "@apollo/client";

export const ADD_POOL_TRANSACTION = gql`
  mutation AddPoolEvent(
    $walletAddress: String!
    $sourceChainHash: String!
    $type: String!
    $poolTokenImages: [String!]!
    $poolType: String!
    $poolName: String!
    $sourceChainImage: String!
    $destChainImage: String!
    $sourceChainId: Int!
  ) {
    addPoolEvent(
      poolData: {
        walletAddress: $walletAddress
        sourceChainHash: $sourceChainHash
        type: $type
        poolTokenImages: $poolTokenImages
        poolType: $poolType
        poolName: $poolName
        sourceChainImage: $sourceChainImage
        destChainImage: $destChainImage
        sourceChainId: $sourceChainId
      }
    ) {
      id
      walletAddress
      sourceChainHash
      poolName
      poolType
      poolTokenImages
      type
      sourceChainId
    }
  }
`;
