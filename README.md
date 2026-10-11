# Agentic_AI

### Multi-chain AI DeFi agent: swaps, bridging, liquidity, and dust clean-up by chat

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?logo=langchain&logoColor=white) ![Coinbase AgentKit](https://img.shields.io/badge/Coinbase%20AgentKit-0052FF?logo=coinbase&logoColor=white) ![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white) ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)

A chat-driven DeFi app. A LangGraph agent with Coinbase AgentKit action providers turns prompts into on-chain actions across EVM chains, Solana, and Bitcoin:

- Token transfers and swaps, plus **cross-chain bridging** through Squid
- **Liquidity** on Uniswap v2/v3 and Curve
- A **dust aggregator** that sweeps small balances into one token
- Wallets via wagmi, Solana wallet adapter, and sats-connect; state in Zustand

```mermaid
flowchart LR
    U["User prompt"] --> UI["Next.js + MUI app"]
    UI --> A["LangGraph agent<br/>OpenAI / Gemini"]
    A --> AP["AgentKit action providers"]
    AP --> Sq["Squid<br/>cross-chain swaps"]
    AP --> Dex["Uniswap v2/v3 · Curve"]
    AP --> Dust["Dust aggregator"]
    UI --> W["wagmi · Solana adapter · sats-connect"]
    W --> Chains["EVM · Solana · Bitcoin"]
    Sq & Dex & Dust --> Chains
```

---

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

////

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
