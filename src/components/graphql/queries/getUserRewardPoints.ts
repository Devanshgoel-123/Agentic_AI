import { gql } from "@apollo/client";

export const GET_USER_REWARD_POINTS = gql`
 query ($walletAddress: String!) {
  getRewardsForUser(
  walletAddress:$walletAddress
  ) {
    total_points,
    nft_captain,
    nft_mariner,
    nft_skipper,
    nft_voyager,
    nft_navigator,
    cross_chain_points,
    add_liquidity_points,
    rewards_multiplier
}
  }
`;
