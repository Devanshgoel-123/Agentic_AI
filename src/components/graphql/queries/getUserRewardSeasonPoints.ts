import { gql } from "@apollo/client";

export const GET_REWARD_SEASON_POINTS_FOR_WALLET = gql`
  query getUserDetailsRewards($walletAddress: String!) {
    getUserDetailsRewards(
      userDetailsParams: { walletAddress: $walletAddress }
    ) {
      wallet_address
      total_points
      user_level{
      level
      name
      creative 
      description
      min_points
      max_points
      created_at
      }
      created_at
    }
  }
`;
