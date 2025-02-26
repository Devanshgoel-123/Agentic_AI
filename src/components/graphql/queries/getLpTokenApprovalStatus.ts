import { gql } from "@apollo/client";

export const GET_LPTOKEN_APPROVAL_STATUS = gql`
  query (
    $contractAddress: String!
    $amount: String!
    $lpTokenAddress: String!
    $walletAddress: String!
    $poolChainId: Float!
  ) {
    getLpTokenApprovalStatus(
      lpApprovalInput: {
        contractAddress: $contractAddress
        amount: $amount
        walletAddress: $walletAddress
        lpTokenAddress: $lpTokenAddress
        poolChainId: $poolChainId
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
