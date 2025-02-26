import type { Metadata } from "next";
import "./globals.css";

import dynamic from "next/dynamic";

import AppKitProvider from "@/context";

// import SideNavigation from "@/components/SideNavigation";
// import NextTopLoader from "nextjs-toploader";

import NextTopLoader from "nextjs-toploader";
import { usePathname } from "next/navigation";
import SolanaWalletContextProvider from "@/context/SolanaContextProvider";

const MobileNavigation = dynamic(() =>
  import("@/components/MobileNavigation").then((mod) => mod.MobileNavigation)
);

const DynamicHeader = dynamic(() => import("@/components/Header"));

export const metadata: Metadata = {
  title: "Eddy Finance | Universal DEX",
  description: "Cross chain bridge for native transfers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Eddy Finance | Universal DEX</title>
        <meta
          name="EddyFinance"
          content="Cross chain bridge for native transfers"
        />
        <link
          rel="preload"
          href="/fonts/Manrope-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Manrope-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Manrope-Light.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Manrope-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {[
          "zerofee",
          "aerodrome",
          "aerodrome_bg",
          "brett_bg",
          "brett",
          "btc",
          "cb_btc_bg",
          "cb_btc",
          "star_btc",
          "star_cbbtc",
          "star_token",
          "base_banner",
          "cbBTC_centre_asset",
          "degen",
          "dust_banner_bg",
          "solana_logo"
        ].map((image) => (
          <link
            key={image}
            rel="preload"
            href={`/assets/images/${image}.svg`}
            as="image"
          />
        ))}
      

      </head>
      <body>
        
        <NextTopLoader showSpinner={false} color="#7BF179" />
        <SolanaWalletContextProvider>
          <AppKitProvider>
            <div className="AppWrapper">
              {/* <SideNavigation /> */}
              <div className="AppContainer">
                <DynamicHeader />
                <div style={{ display: "flex", flex: 1, overflow: "auto" }}>
                  {children}
                </div>
                <MobileNavigation />
              </div>
            </div>
          </AppKitProvider>
        </SolanaWalletContextProvider>
      </body>
    </html>
  );
}
