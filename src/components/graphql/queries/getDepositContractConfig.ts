import { gql } from "@apollo/client";

export const GET_DEPOSIT_CONTRACT_CONFIG = gql`
  query (
    $tokenAId: Float!
    $tokenBId: Float!
    $tokenAAmount: String!
    $tokenBAmount: String!
    $minAmountTokenA: String!
    $minAmountTokenB: String!
  ) {
    getDepositUniV2ContractConfig(
      depositUniv2ContractConfigInput: {
        tokenAId: $tokenAId
        tokenBId: $tokenBId
        tokenAAmount: $tokenAAmount
        tokenBAmount: $tokenBAmount
        minAmountTokenA: $minAmountTokenA
        minAmountTokenB: $minAmountTokenB
      }
    ) {
      address
      abi
      functionName
      args
      value
    }
  }
`;
