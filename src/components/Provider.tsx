"use client";
import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import config from "@/src/config";
import merge from "lodash.merge";
const Provider = ({
  children,
}: {
  children?: ReactNode;
  onclick?: () => void;
}) => {
  const queryClient = new QueryClient();
  const alphaTheme = merge(darkTheme(), {
    colors: {
      modalBackground: "#000",
    },
  });
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={alphaTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Provider;
