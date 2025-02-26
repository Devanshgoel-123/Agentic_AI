import { gql } from "@apollo/client";

export const GET_DEPOSIT_CURVE_CONTRACT_CONFIG = gql`
  query (
    $contract: String!
    $tokenAmounts: [CurveDepositTokens!]!
    $minLpAmount: String!
  ) {
    getCurveDepositContractConfig(
      depositCurveContractConfigInput: {
        contract: $contract
        tokenAmounts: $tokenAmounts
        minLpAmount: $minLpAmount
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
