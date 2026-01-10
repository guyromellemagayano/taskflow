/** TanStack Query hooks for REST API calls */

import { useQuery } from "@tanstack/react-query";
import { apiFetch, apiKeys, type ApiInfoResponse, type HealthCheckResponse } from "./client";

/** Hook to fetch API information */
export function useApiInfo() {
  return useQuery<ApiInfoResponse>({
    queryKey: apiKeys.info(),
    queryFn: () => apiFetch<ApiInfoResponse>("/api"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/** Hook to check API health */
export function useApiHealth() {
  return useQuery<HealthCheckResponse>({
    queryKey: apiKeys.health(),
    queryFn: () => apiFetch<HealthCheckResponse>("/health"),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}
