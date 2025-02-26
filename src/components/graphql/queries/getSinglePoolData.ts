import { gql } from "@apollo/client";

export const GET_SINGLE_POOLS = gql`
  query ($chainId: Float!, $slug: String!) {
    getIndividualPool(individualPoolInput: { slug: $slug, chainId: $chainId }) {
      chainId
      name
      tvl
      apy
      lpFee
      lpTokenAddress
      lpTokenImage
      lpSymbol
      lpTokenDecimals
      totalReserve {
        tokenName
        tokenImage
        tokenAddress
        tokenDecimal
        pythid
        reserves
      }
      contractAddress
      routerAddress
      dailyVolume
      poolType
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
        curveIndex
        zrc20Address
      }
    }
  }
`;
