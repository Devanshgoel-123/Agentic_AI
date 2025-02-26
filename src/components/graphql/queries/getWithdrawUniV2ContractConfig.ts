import { gql } from "@apollo/client";

export const GET_WITHDRAW_CONTRACT_CONFIG = gql`
  query (
    $tokenAId: Float!
    $tokenBId: Float!
    $tokenLPAmount: String!
    $minAmountTokenA: String!
    $minAmountTokenB: String!
  ) {
    getWidthUniV2ContractConfig(
      withdrawUniv2ContractConfigInput: {
        tokenAId: $tokenAId
        tokenBId: $tokenBId
        tokenLPAmount: $tokenLPAmount
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
