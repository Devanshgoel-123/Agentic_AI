import { gql } from "@apollo/client";

export const GET_TOKEN_DOLLAR_VALUE = gql`
  query ($tokenId: Float!) {
    getDollarValueForToken(dollarValueTokenData: { tokenId: $tokenId }) {
      price
      expo
    }
  }
`;
