"use client";

/** Authentication context and provider */

import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./utils";

// GraphQL queries and mutations
const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      createdAt
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        createdAt
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        createdAt
      }
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        createdAt
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout($input: RefreshTokenInput!) {
    logout(input: $input)
  }
`;

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Token refresh queue to prevent race conditions
  const refreshPromiseRef = React.useRef<Promise<void> | null>(null);

  // Check if user is authenticated on mount
  const {
    data: meData,
    loading: meLoading,
    refetch: refetchMe,
  } = useQuery(ME_QUERY, {
    skip: !getAccessToken(), // Skip if no token
    errorPolicy: "all",
    fetchPolicy: "network-only", // Always fetch fresh data
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      } else {
        setUser(null);
        clearTokens();
      }
      setLoading(false);
    },
    onError: (error) => {
      // If error is 401, clear tokens
      const networkError = error.networkError as
        | { statusCode?: number }
        | undefined;
      const isUnauthorized =
        error.graphQLErrors?.[0]?.extensions?.code === "UNAUTHENTICATED" ||
        networkError?.statusCode === 401;

      if (isUnauthorized) {
        clearTokens();
      }
      setUser(null);
      setLoading(false);
    },
  });

  // Login mutation
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { accessToken, refreshToken, user } = data.login;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      router.push("/");
    },
    onError: (error) => {
      // Extract user-friendly error message
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        "Login failed. Please check your credentials and try again.";
      // Error will be handled by the component calling login()
      throw new Error(errorMessage);
    },
  });

  // Register mutation
  const [registerMutation] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const { accessToken, refreshToken, user } = data.register;
      // Store tokens in localStorage as fallback (cookies are set by REST endpoint)
      // For GraphQL, we store in localStorage since GraphQL can't set cookies directly
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      router.push("/");
    },
    onError: (error) => {
      // Extract user-friendly error message
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        "Registration failed. Please try again.";
      // Error will be handled by the component calling register()
      throw new Error(errorMessage);
    },
  });

  // Refresh token mutation
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION, {
    onCompleted: (data) => {
      const { accessToken, refreshToken } = data.refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      // Refetch user data
      refetchMe();
    },
    onError: () => {
      // If refresh fails, logout
      clearTokens();
      setUser(null);
      router.push("/login");
    },
  });

  // Logout mutation
  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      clearTokens();
      setUser(null);
      router.push("/login");
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearTokens();
      setUser(null);
      router.push("/login");
    },
  });

  // Login function
  const login = async (email: string, password: string) => {
    await loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  // Register function
  const register = async (email: string, password: string) => {
    await registerMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  // Logout function
  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await logoutMutation({
        variables: {
          input: {
            refreshToken,
          },
        },
      });
    } else {
      // If no refresh token, just clear local state
      clearTokens();
      setUser(null);
      router.push("/login");
    }
  };

  // Refresh token function with race condition prevention
  const refreshToken = async () => {
    // If a refresh is already in progress, wait for it
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    // Create a promise for this refresh operation
    const refreshPromise = (async () => {
      try {
        await refreshTokenMutation({
          variables: {
            input: {
              refreshToken: refreshTokenValue,
            },
          },
        });
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        clearTokens();
        setUser(null);
        throw error;
      } finally {
        // Clear the promise reference when done
        refreshPromiseRef.current = null;
      }
    })();

    // Store the promise so concurrent calls can wait for it
    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };

  // Update user when me query completes
  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    } else if (!meLoading && !getAccessToken()) {
      setUser(null);
    }
  }, [meData, meLoading]);

  const value: AuthContextType = {
    user,
    loading: loading || meLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
