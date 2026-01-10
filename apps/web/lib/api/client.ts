/** REST API client utilities for TanStack Query */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

/** Get access token from localStorage for Authorization header */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("taskflow_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/** Generic fetch wrapper for REST API calls */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
    credentials: "include", // Include cookies for httpOnly tokens
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText || "Request failed",
    }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/** API response types */
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
