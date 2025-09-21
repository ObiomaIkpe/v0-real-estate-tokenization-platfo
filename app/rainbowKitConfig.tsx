"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { Chain } from "wagmi/chains"

const hederaTestnet = {
  id: 296,  // Hedera Testnet chain ID :contentReference[oaicite:0]{index=0}
  name: 'hedera-testnet',
  nativeCurrency: {
    name: 'Hedera',
    symbol: 'HBAR',
    decimals: 18, // note: check actual decimals; many sources say 18 for EVM-compatible token. :contentReference[oaicite:1]{index=1}
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'], // example RPC from Chainlist etc. :contentReference[oaicite:2]{index=2}
    },
  },
  blockExplorers: {
    default: {
      name: 'Hashscan Testnet',
      url: 'https://hashscan.io/testnet', // Hedera testnet explorer :contentReference[oaicite:3]{index=3}
    },
  },
  testnet: true,
} as const satisfies Chain;

export default getDefaultConfig({
    appName: "REALiFi",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [hederaTestnet],
    ssr: false,
})
