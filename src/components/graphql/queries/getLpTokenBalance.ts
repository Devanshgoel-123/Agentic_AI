import { gql } from "@apollo/client";

export const GET_LPTOKEN_BALANCE = gql`
  query ($slug: String!, $walletAddress: String!) {
    getLpBalance(
      LpBalanceInput: { slug: $slug, walletAddress: $walletAddress }
    ) {
      lpBalance
    }
  }
`;
