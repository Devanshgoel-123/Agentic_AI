"use client";
import React, { ReactNode,useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";


import { config } from "@/config";
import client from "@/lib/apolloClient";
import RewardsModal from "@/components/AppModals/RewardsModal";
import mixpanel from "mixpanel-browser";
import CustomToast from "@/components/common/CustomToasts";
import TransactionNotification from "@/components/Notifications/TransactionNotification";
import TransactionNotificationForDust from "@/components/DustAggregatorWidget/TransactionNotification";

const queryClient = new QueryClient();


export default function AppKitProvider({ children }: { children: ReactNode }) {
  useEffect(()=>{
    mixpanel.init(`${process.env.NEXT_PUBLIC_MIXPANEL_ID}`,{
      track_pageview:"url-with-path",
      persistence:"localStorage",
      debug:false,
    })
  },[])
  return (
    <ApolloProvider client={client}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            Components={{
              /**TODO: Find correct type for this. */
              //@ts-ignore
              custom: CustomToast,
              // rewardsModal: RewardsModal,
              txnNotification: TransactionNotification,
              txnNotificationDust: TransactionNotificationForDust,
            }}
          >
            {children}
          </SnackbarProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}
