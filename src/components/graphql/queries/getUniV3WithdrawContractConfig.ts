import { gql } from "@apollo/client";

export const GET_WITHDRAW_UNIV3_CONTRACT_CONFIG = gql`
  query (
    $contract: String!
    $nftId: String!
    $liquidity: String!
    $amount0Min: String!
    $amount1Min: String!
    $recipient: String!
  ) {
    getWithdrawContractConfigUniV3(
      withdrawUniv3ContractConfigInput: {
        contract: $contract
        nftId: $nftId
        liquidity: $liquidity
        amount0Min: $amount0Min
        amount1Min: $amount1Min
        recipient: $recipient
      }
    ) {
      address
      abi
      args
      functionName
    }
  }
`;
