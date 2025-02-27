import { BTC_WALLET_IDS, EVM_WALLETS_ID, SOLANA_WALLET_IDS } from "./enums";
import { hex, base64 } from "@scure/base";
import * as btc from "@scure/btc-signer";
import * as bitcoin from "bitcoinjs-lib";

export const supportedWallets = [
  {
    id: "metaMaskSDK",
    name: "MetaMask",
    image: "https://asset.eddy.finance/wallet/metamask.svg",
    walletURL: "",
  },
  {
    id: "io.rabby",
    name: "Rabby",
    image: "https://asset.eddy.finance/wallet/rabby.svg",
    walletURL: "https://rabby.io/",
  },
  {
    id: "com.okex.wallet",
    name: "OKX Wallet",
    image: "https://asset.eddy.finance/wallet/okx.svg",
    walletURL:
      "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
  },
  {
    id: "app.keplr",
    name: "Keplr",
    image: "https://asset.eddy.finance/wallet/keplr.svg",
    walletURL: "https://www.keplr.app/",
  },
  {
    id: "coinbaseWalletSDK",
    name: "Coinbase",
    image: "https://asset.eddy.finance/wallet/cbw.svg",
    walletURL: "https://www.coinbase.com/en-ca/wallet",
  },
  {
    id: "coin98.com",
    name: "Coin98",
    image: "https://asset.eddy.finance/wallet/coin98.svg",
    walletURL: "https://coin98.com/",
  },
  {
    id: "com.bitget.web3",
    name: "Bitget",
    image: "https://asset.eddy.finance/wallet/bitget.svg",
    walletURL: "https://web3.bitget.com/en/",
  },
  {
    id: "pro.tokenpocket",
    name: "TokenPocket",
    image: "https://asset.eddy.finance/wallet/token-pocket.svg",
    walletURL: "https://www.tokenpocket.pro/",
  },
  {
    id: EVM_WALLETS_ID.WALLET_CONNECT,
    name: "WalletConnect",
    image: "https://asset.eddy.finance/wallet/wallet-connect.svg",
    walletURL: "https://www.tokenpocket.pro/",
  },
  {
    id: [EVM_WALLETS_ID.BINANCE_WEB3, EVM_WALLETS_ID.BINANCE_WEB_CHROME],
    name: "Binance",
    image: "https://asset.eddy.finance/logo/binance.svg",
    walletURL: "https://www.binance.com/en/web3wallet",
  },
];

export const supportedBTCWallets = [
  {
    id: BTC_WALLET_IDS.XDEFI,
    name: "XDeFi",
    image: "https://asset.eddy.finance/wallet/xdefi.svg",
    walletURL: "https://go.xdefi.io/eddyfinance",
  },
  {
    id: BTC_WALLET_IDS.OKX,
    name: "OKX",
    image: "https://asset.eddy.finance/wallet/okx.svg",
    walletURL:
      "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
  },
  {
    id: BTC_WALLET_IDS.UNISAT,
    name: "Unisat",
    image: "https://asset.eddy.finance/wallet/unisat.svg",
    walletURL: "https://unisat.io/",
  },
  // {
  //   id: BTC_WALLET_IDS.XVERSE,
  //   name: "xverse",
  //   image: "https://asset.eddy.finance/wallet/xverse-logo.svg",
  //   walletURL: "https://www.xverse.app/download",
  // },
];

export const supportedSolanaWallets = [
  {
    id: SOLANA_WALLET_IDS.PHANTOM,
    name: "Phantom",
    image: "https://asset.eddy.finance/wallet/phantom.svg",
    walletURL: "https://phantom.app",
  },
  {
    id: SOLANA_WALLET_IDS.BACKPACK,
    name: "Backpack",
    image: "https://asset.eddy.finance/logo/backpack.svg",
    walletURL: "https://backpack.app/",
  },
  // {
  //   id: SOLANA_WALLET_IDS.OKX,
  //   name: "OKX Wallet",
  //   image: "https://asset.eddy.finance/wallet/okx.svg",
  //   walletURL:
  //     "https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
  // },
];

export const UNISAT_BITCOIN_MAINNET = "BITCOIN_MAINNET";
export const XDEFI_BITCOIN_MAINNET = "mainnet";
export const BITCOIN_NETWORK = "livenet";

/**
 * Function to generate psbt hash. (For Unisat & Xverse);
 * @param paymentPublicKeyString Wallet public key (from provider)
 * @param paymentUnspentOutputs utxo object (from backend);
 * @param recipient1 usually btc tss address.
 * @param recipient2 user wallet address.
 * @param amount amount in ui format.
 * @param memoString memo string.
 * @returns psbt hash.
 */
export const createPsbt = async (
  paymentPublicKeyString: string,
  paymentUnspentOutputs: any,
  recipient1: string,
  recipient2: string,
  amount: number, // Amount in BTC
  memoString: string,
  callbackFn: () => void
) => {
  try {
    const bitcoinMainnet = {
      bech32: "bc", // Mainnet bech32 prefix
      pubKeyHash: 0x00, // Mainnet P2PKH
      scriptHash: 0x05, // Mainnet P2SH
      wif: 0x80, // Mainnet WIF (Wallet Import Format)
    };
    const memo = Buffer.from(memoString, "hex");
    const paymentOutput = paymentUnspentOutputs;
    const paymentPublicKey = hex.decode(paymentPublicKeyString);
    const tx = new btc.Transaction({ allowUnknownOutputs: true });

    // create segwit spend
    const p2wpkh = btc.p2wpkh(paymentPublicKey, bitcoinMainnet);
    const p2sh = btc.p2sh(p2wpkh, bitcoinMainnet);

    // set transfer amount in satoshi and calculate change
    const recipient1Amount = BigInt(parseInt(amount.toString()));
    // check this again.
    let fee = 0;
    const requiredInputAmt = recipient1Amount + BigInt(fee);

    let totalAmount = 0,
      inputCount = 0;
    for (let i = 0; i < paymentOutput.length; i++) {
      // payment input
      tx.addInput({
        txid: paymentOutput[i].txid,
        index: paymentOutput[i].vout,
        witnessUtxo: {
          script: p2sh.script ? p2sh.script : Buffer.alloc(0),
          amount: BigInt(paymentOutput[i].value),
        },
        redeemScript: p2sh.redeemScript ? p2sh.redeemScript : Buffer.alloc(0),
        witnessScript: p2sh.witnessScript,
        sighashType: btc.SigHash.SINGLE | btc.SigHash.ALL_ANYONECANPAY,
      });

      totalAmount += paymentOutput[i].value;
      inputCount += 1;

      if (totalAmount >= requiredInputAmt) break;
    }
    console.log(totalAmount, recipient1Amount, "recipient1Amount");
    if (BigInt(totalAmount) - BigInt(recipient1Amount) - BigInt(fee) < 0) {
      console.log(totalAmount, recipient1Amount);
      callbackFn();
      throw new Error("Insufficient Balance.");
    }

    const changeAmount =
      BigInt(totalAmount) - BigInt(recipient1Amount) - BigInt(fee);

    tx.addOutputAddress(recipient1, recipient1Amount, bitcoinMainnet);
    console.log(changeAmount, "change amount");
    if (memo.length > 0) {
      const embed = bitcoin.payments.embed({ data: [memo] });
      if (!embed.output) {
        callbackFn();
        throw new Error("Unable to embed memo");
      }

      tx.addOutput({
        script: embed.output,
        amount: BigInt(0),
      });
    }

    tx.addOutputAddress(recipient2, changeAmount, bitcoinMainnet);

    const psbt = tx.toPSBT(0);
    const psbtB64 = base64.encode(psbt);
    return psbtB64;
  } catch (error) {
    console.log(error);
    callbackFn();
  }
};
