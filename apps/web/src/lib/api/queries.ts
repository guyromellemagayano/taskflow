/**
 * @file queries.ts
 * @author Guy Romelle Magayano
 * @description TanStack Query hooks for REST API calls
 */

import { useQuery } from "@tanstack/react-query";

import {
  apiFetch,
  type ApiInfoResponse,
  apiKeys,
  type HealthCheckResponse,
} from "./client";

const STALE_TIME_API_INFO = 5 * 60 * 1000; // 5 minutes
const STALE_TIME_HEALTH = 1 * 60 * 1000; // 1 minute
const REFETCH_INTERVAL_HEALTH = 30 * 1000; // 30 seconds
const QUERY_RETRY_COUNT = 1;

const fetchApiInfo = () => apiFetch<ApiInfoResponse>("/api");
const fetchApiHealth = () => apiFetch<HealthCheckResponse>("/health");

/** Hook to fetch API information */
export function useApiInfo() {
  return useQuery<ApiInfoResponse>({
    queryKey: apiKeys.info(),
    queryFn: fetchApiInfo,
    staleTime: STALE_TIME_API_INFO,
    retry: QUERY_RETRY_COUNT,
  });
}

/** Hook to check API health */
export function useApiHealth() {
  return useQuery<HealthCheckResponse>({
    queryKey: apiKeys.health(),
    queryFn: fetchApiHealth,
    staleTime: STALE_TIME_HEALTH,
    retry: QUERY_RETRY_COUNT,
    refetchInterval: REFETCH_INTERVAL_HEALTH,
  });
}
