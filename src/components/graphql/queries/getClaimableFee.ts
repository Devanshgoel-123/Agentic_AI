import { gql } from "@apollo/client";

export const GET_CLAIMABLE_FEE_FOR_WALLET = gql`
  query ($nftId: Float!) {
    getClaimableFees(
      claimableFeesInput: {
        nftId: $nftId
        owner: "0x298A74d9D61F2C4249Fe665e752D327236d46560"
      }
    ) {
      claimableFeesToken0
      claimableFeesToken1
    }
  }
`;
