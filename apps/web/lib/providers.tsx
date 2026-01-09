"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { apolloClient } from "./graphql/client";

// Mantine theme configuration with dark mode support
const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: "blue",
  defaultRadius: "md",
  // Phase 1: Basic theme
  // Phase 2: Will add more theme customization
});

// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}
