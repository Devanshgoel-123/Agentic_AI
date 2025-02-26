import { gql } from "@apollo/client";

export const GET_INCREASE_LIQUIDITY_UNIV3_CONTRACT_CONFIG = gql`
  query (
    $contract: String!
    $nftId: String!
    $amount0Desired: String!
    $amount1Desired: String!
    $amount0Min: String!
    $amount1Min: String!
  ) {
    getIncreaseLiquidityContractConfigUniV3(
      increaseLiquidityUniV3ContractConfigInput: {
        contract: $contract
        nftId: $nftId
        amount0Min: $amount0Min
        amount1Min: $amount1Min
        amount0Desired: $amount0Desired
        amount1Desired: $amount1Desired
      }
    ) {
      address
      abi
      args
      functionName
    }
  }
`;
