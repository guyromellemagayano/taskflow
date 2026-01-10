"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { apolloClient } from "./graphql/client";
import { AuthProvider } from "./auth/context";

// Mantine theme configuration with dark mode support
const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: "blue",
  defaultRadius: "md",
  // Phase 1: Basic theme
  // Phase 2: Will add more theme customization
});

// TanStack Query configuration for REST API calls
// Note: GraphQL queries use Apollo Client, TanStack Query is for REST endpoints
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Include credentials for httpOnly cookies
      networkMode: "same-origin",
    },
    mutations: {
      retry: 1,
      networkMode: "same-origin",
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
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}
