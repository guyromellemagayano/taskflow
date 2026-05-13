/**
 * @file client.ts
 * @author Guy Romelle Magayano
 * @description REST API client utilities for TanStack Query
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TOKEN_KEY = "taskflow_access_token";
const CONTENT_TYPE_HEADER = "Content-Type";
const CONTENT_TYPE_JSON = "application/json";
const CONTENT_TYPE_PROBLEM_JSON = "application/problem+json";
const DEFAULT_ERROR_MESSAGE = "Request failed";

// `localStorage` is synchronous and expensive, so we cache reads in memory
let tokenCache: string | null | undefined = undefined;

/** Get cached access token from `localStorage` */
function getCachedToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached value if available
  if (tokenCache !== undefined) {
    return tokenCache;
  }

  // Read from `localStorage` and cache
  tokenCache = localStorage.getItem(TOKEN_KEY);
  return tokenCache;
}

/** Clear token cache (call when token changes) */
export function clearTokenCache(): void {
  tokenCache = undefined;
}

/** Update token cache (call when token is set) */
export function setTokenCache(token: string | null): void {
  tokenCache = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
}

/** Get access token from `localStorage` for `Authorization` header */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
  };

  const token = getCachedToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/** Generic fetch wrapper for REST API calls */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
  const url = endpoint.startsWith("http")
    ? endpoint
    : normalizedBaseUrl === "/api" && normalizedEndpoint === "/api"
      ? "/api"
      : `${normalizedBaseUrl}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
    credentials: "include", // Include cookies for httpOnly tokens
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const isJson =
      contentType?.includes(CONTENT_TYPE_JSON) ||
      contentType?.includes(CONTENT_TYPE_PROBLEM_JSON);

    let errorMessage = response.statusText || DEFAULT_ERROR_MESSAGE;

    if (isJson) {
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        // If JSON parsing fails, use statusText
      }
    } else {
      // For non-JSON errors, try to read as text
      try {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      } catch {
        // If text parsing fails, use statusText
      }
    }

    throw new Error(errorMessage || `HTTP ${response.status}`);
  }

  return response.json();
}

export interface ApiInfoResponse {
  message: string;
  version: string;
  endpoints: Record<string, string>;
}

export interface HealthCheckResponse {
  status: string;
}

/** Query keys for TanStack Query */
export const apiKeys = {
  all: ["api"] as const,
  info: () => [...apiKeys.all, "info"] as const,
  health: () => [...apiKeys.all, "health"] as const,
};
