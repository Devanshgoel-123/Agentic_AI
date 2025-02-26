import { gql } from "@apollo/client";

export const GET_DEPOSIT_UNIV3_CONTRACT_CONFIG = gql`
  query (
    $isToken0Native: Boolean!
    $isToken1Native: Boolean!
    $contract: String!
    $token0: String!
    $token1: String!
    $tickLower: String!
    $tickUpper: String!
    $fee: String!
    $amount0Desired: String!
    $amount1Desired: String!
    $amount0Min: String!
    $amount1Min: String!
    $recipient: String!
  ) {
    getDepositContractConfigUniV3(
      depositUniv3ContractConfigInput: {
        isToken0Native: $isToken0Native
        isToken1Native: $isToken1Native
        contract: $contract
        token0: $token0
        token1: $token1
        tickLower: $tickLower
        tickUpper: $tickUpper
        fee: $fee
        amount0Desired: $amount0Desired
        amount1Desired: $amount1Desired
        amount0Min: $amount0Min
        amount1Min: $amount1Min
        recipient: $recipient
      }
    ) {
      address
      abi
      args
      functionName
      value
    }
  }
`;
