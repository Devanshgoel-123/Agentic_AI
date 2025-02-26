import { gql } from "@apollo/client";

export const GET_ALL_POOLS = gql`
  query ($chainId: Float!, $sortByTvl: Boolean!, $isAscending: Boolean!) {
    getPools(
      poolInput: {
        chainId: $chainId
        sortByTvl: $sortByTvl
        isAscending: $isAscending
      }
    ) {
      name
      tvl
      apy
      lpFee
      slug
      poolType
      lpTokenImage
      lpSymbol
      boostInfo {
        boost
        isBoosted
        tokenName
        tokenImage
      }
      tokens {
        id
        name
        tokenLogo
        chain {
          name
          chainId
          chainLogo
        }
        address
        pythId
        decimal
        isNative
      }
    }
  }
`;
