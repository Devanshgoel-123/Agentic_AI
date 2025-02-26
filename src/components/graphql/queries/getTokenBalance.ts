import { gql } from "@apollo/client";

export const GET_TOKEN_BALANCE = gql`
  query ($walletAddress: String!, $tokenId: Float!, $type: String!) {
    getBalanceOfTokenForUserWallet(
      balanceOfTokenWalletData: {
        walletAddress: $walletAddress
        tokenId: $tokenId
        type: $type
      }
    ) {
      balance
    }
  }
`;
