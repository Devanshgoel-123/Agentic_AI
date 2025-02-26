import { gql } from "@apollo/client";

export const GET_BTC_WALLET_VALIDATION = gql`
  query ($address: String!) {
    getValidationForBitcoinAddress(
      bitcoinValidatorInput: { address: $address }
    ) {
      isValid
    }
  }
`;
