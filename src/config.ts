import { http, createConfig } from "wagmi";
import { mainnet, bsc, polygon, zetachain, base } from "wagmi/chains";
import {
  coinbaseWallet,
  metaMask,
  injected,
  safe,
  walletConnect,
} from "wagmi/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";

const connector = getWagmiConnectorV2();

export const config = createConfig({
  chains: [mainnet, bsc, polygon, zetachain, base],
  ssr: true,
  connectors: [
    walletConnect({
      projectId: "06503e1a4366da060f29ba005a4215c8",
    }),
    coinbaseWallet({
      appName: "EddyFinance",
    }),
    connector(),
    metaMask(),
    injected(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [zetachain.id]: http(
      "https://zetachain-mainnet.g.alchemy.com/v2/swQALCkRQkrbnQV48o9SrPOdLp9H3Ijs"
    ),
    [base.id]: http(),
  },
});
