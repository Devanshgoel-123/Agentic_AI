import { gql } from "@apollo/client";

export const GET_APPROVAL_STATUS = gql`
  query (
    $contractAddress: String!
    $amount: String!
    $tokenId: Float!
    $walletAddress: String!
  ) {
    getApprovalStatusForWallet(
      approvalInput: {
        contractAddress: $contractAddress
        amount: $amount
        tokenId: $tokenId
        walletAddress: $walletAddress
      }
    ) {
      approvalStatus
      approvalConfig {
        address
        abi
        args
        functionName
      }
    }
  }
`;
