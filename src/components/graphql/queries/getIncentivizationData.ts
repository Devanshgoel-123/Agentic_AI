import { gql } from "@apollo/client";

export const GET_INCENTIVIZATION_DATA = gql`
  query ($address: String!, $week: Float!) {
    getProofForAddress(proofInput: { address: $address, week: $week }) {
      value
      proof
      contractConfig {
        abi
        address
        args
        functionName
      }
    }
  }
`;
