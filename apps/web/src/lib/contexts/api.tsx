/**
 * @file api-providers.tsx
 * @author Guy Romelle Magayano
 * @description API-related providers (Apollo Client, TanStack Query)
 */

"use client";

import { type ReactNode, useMemo } from "react";

import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { apolloClient } from "@web/lib/graphql/client";

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_RETRY_COUNT = 1;
const MUTATION_RETRY_COUNT = 1;

// TanStack Query configuration for REST API calls
// Note: GraphQL queries use Apollo Client, TanStack Query is for REST endpoints
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: QUERY_RETRY_COUNT,
        staleTime: QUERY_STALE_TIME,
        // TODO: Include credentials for httpOnly cookies
      },
      mutations: {
        retry: MUTATION_RETRY_COUNT,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Get query client instance */
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // Browser: use singleton pattern to keep the same query client across hot reloads
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

export interface ApiProvidersProps {
  children: ReactNode;
}

export function ApiProviders({ children }: ApiProvidersProps) {
  const queryClient = useMemo(() => getQueryClient(), []);

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApolloProvider>
  );
}
