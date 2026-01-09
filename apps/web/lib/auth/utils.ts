/**
 * Authentication utilities for token management
 */

const ACCESS_TOKEN_KEY = "taskflow_access_token";
const REFRESH_TOKEN_KEY = "taskflow_refresh_token";

/**
 * Store access token in localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

/**
 * Store refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * Check if user is authenticated (has access token)
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
