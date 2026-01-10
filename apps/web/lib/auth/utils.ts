/** Authentication utilities for token management - supports httpOnly cookies and localStorage fallback */

const ACCESS_TOKEN_KEY = "taskflow_access_token";
const REFRESH_TOKEN_KEY = "taskflow_refresh_token";

/** Store access token in localStorage */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/** Get access token (prefers cookies, falls back to localStorage) */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    // Try localStorage first (for GraphQL responses)
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      return token;
    }
    // httpOnly cookies are automatically sent by browser, but we can't read them here
    // The backend will read them from the request
    // For client-side checks, we rely on localStorage or a /me endpoint
  }
  return null;
}

/** Store refresh token in localStorage */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/** Get refresh token from localStorage */
export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/** Clear all tokens from localStorage */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/** Check if user is authenticated (has access token) */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
