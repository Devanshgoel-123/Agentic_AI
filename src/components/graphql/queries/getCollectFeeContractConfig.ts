import { gql } from "@apollo/client";

export const GET_COLLECT_FEE_UNIV3_CONTRACT_CONFIG = gql`
  query ($contract: String!, $nftId: String!, $recipient: String!) {
    getCollectFeeContractConfigUniV3(
      collectFeeUniv3ContractConfigInput: {
        contract: $contract
        nftId: $nftId
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
