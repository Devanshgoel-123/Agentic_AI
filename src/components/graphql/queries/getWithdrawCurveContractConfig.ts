import { gql } from "@apollo/client";

export const GET_WITHDRAW_CURVE_CONTRACT_CONFIG = gql`
  query (
    $contract: String!
    $minTokenAmounts: [CurveDepositTokens!]!
    $amount: String!
    $isBalanced: Boolean!
    $isDiPool: Boolean!
  ) {
    getCurveWithdrawContractConfig(
      withdrawCurveContractConfigInput: {
        contract: $contract
        isBalanced: $isBalanced
        isDiPool: $isDiPool
        minTokenAmounts: $minTokenAmounts
        amount: $amount
      }
    ) {
      address
      args
      abi
      functionName
      value
    }
  }
`;
