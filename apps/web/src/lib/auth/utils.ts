/**
 * @file utils.ts
 * @author Guy Romelle Magayano
 * @description Authentication utilities for token management - supports `httpOnly` cookies and `localStorage` fallback
 */

import { clearTokenCache, setTokenCache } from "@web/lib/api/client";

const ACCESS_TOKEN_KEY = "taskflow_access_token";
const REFRESH_TOKEN_KEY = "taskflow_refresh_token";

let accessTokenCache: string | null | undefined = undefined;
let refreshTokenCache: string | null | undefined = undefined;

/** Store access token in `localStorage` and update caches */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    // Update both caches to keep them in sync
    accessTokenCache = token;
    setTokenCache(token);
  }
}

/** Get access token (prefers cookies, falls back to `localStorage`) */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached value if available
  if (accessTokenCache !== undefined) {
    return accessTokenCache;
  }

  // Read from `localStorage` and cache
  // Try `localStorage` first (for GraphQL responses)
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  accessTokenCache = token;
  if (token) {
    return token;
  }
  // `httpOnly` cookies are automatically sent by browser, but we can't read them here
  // The backend will read them from the request
  // For client-side checks, we rely on `localStorage` or a /me endpoint
  return null;
}

/** Store refresh token in `localStorage` and update cache */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    // Update cache to keep it in sync
    refreshTokenCache = token;
  }
}

/** Get refresh token from `localStorage` */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached value if available
  if (refreshTokenCache !== undefined) {
    return refreshTokenCache;
  }

  // Read from `localStorage` and cache
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  refreshTokenCache = token;
  return token;
}

/** Clear all tokens from `localStorage` and clear cache */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Clear both caches to keep them in sync
    accessTokenCache = undefined;
    refreshTokenCache = undefined;
    clearTokenCache();
  }
}

/** Check if user is authenticated (has access token) */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
