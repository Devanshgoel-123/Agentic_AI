import { gql } from "@apollo/client";

export const GET_BTC_WALLET_UTXO = gql`
  query ($address: String!) {
    getUTXOForBitcoinAddress(bitcoinUtxoInput: { address: $address }) {
      utxo {
        txid
        vout
        value
      }
    }
  }
`;
