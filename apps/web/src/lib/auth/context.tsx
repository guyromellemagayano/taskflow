/**
 * @file context.tsx
 * @author Guy Romelle Magayano
 * @description Authentication context for the application
 */

"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

import type { AuthPayload, User } from "@taskflow/shared";

import { extractErrorMessage } from "@web/lib/utils/apollo";

import { clearTokens, getRefreshToken } from "./utils";

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

interface MeQueryData {
  me: User;
}

interface LoginMutationData {
  login: AuthPayload;
}

interface RegisterMutationData {
  register: AuthPayload;
}

interface RefreshTokenMutationData {
  refreshToken: AuthPayload;
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

export const AuthProvider = function ({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Token refresh queue to prevent race conditions
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  // Check if user is authenticated on mount
  const {
    data: meData,
    loading: meLoading,
    error: meError,
    refetch: refetchMe,
  } = useQuery<MeQueryData>(ME_QUERY, {
    errorPolicy: "all",
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  // Login mutation
  const [loginMutation] = useMutation<LoginMutationData>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { user } = data.login;
      clearTokens();
      setUser(user);
      router.push("/");
    },
    onError: (error) => {
      const errorMessage =
        extractErrorMessage(error) ||
        "Login failed. Please check your credentials and try again.";
      throw new Error(errorMessage);
    },
  });

  // Register mutation
  const [registerMutation] = useMutation<RegisterMutationData>(
    REGISTER_MUTATION,
    {
      onCompleted: (data) => {
        const { user } = data.register;
        clearTokens();
        setUser(user);
        router.push("/");
      },
      onError: (error) => {
        const errorMessage =
          extractErrorMessage(error) ||
          "Registration failed. Please try again.";
        throw new Error(errorMessage);
      },
    }
  );

  // Refresh token mutation
  const [refreshTokenMutation] = useMutation<RefreshTokenMutationData>(
    REFRESH_TOKEN_MUTATION,
    {
      onCompleted: (data) => {
        const { user } = data.refreshToken;
        clearTokens();
        setUser(user);
        // Refetch user data
        refetchMe();
      },
      onError: () => {
        // If refresh fails, logout
        clearTokens();
        setUser(null);
        router.push("/login");
      },
    }
  );

  /** Logout mutation */
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

  /** Login function */
  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    },
    [loginMutation]
  );

  /** Register function */
  const register = useCallback(
    async (email: string, password: string) => {
      await registerMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    },
    [registerMutation]
  );

  /** Logout function */
  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    await logoutMutation({
      variables: {
        input: {
          ...(refreshToken && { refreshToken }),
        },
      },
    });
  }, [logoutMutation]);

  /** Refresh token function with race condition prevention */
  const refreshToken = useCallback(async () => {
    // If a refresh is already in progress, wait for it
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshTokenValue = getRefreshToken();
    // Create a promise for this refresh operation
    const refreshPromise = (async () => {
      try {
        await refreshTokenMutation({
          variables: {
            input: {
              ...(refreshTokenValue && { refreshToken: refreshTokenValue }),
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
  }, [refreshTokenMutation]);

  // Update user when me query completes or errors
  const meUser = meData?.me;
  const isUnauthorizedError = Boolean(
    meError &&
    ((
      meError as {
        networkError?: { statusCode?: number };
        graphQLErrors?: Array<{ extensions?: { code?: string } }>;
      }
    ).graphQLErrors?.[0]?.extensions?.code === "UNAUTHENTICATED" ||
      (
        meError as {
          networkError?: { statusCode?: number };
        }
      ).networkError?.statusCode === 401)
  );

  useEffect(() => {
    if (meUser) {
      setUser(meUser);
      setLoading(false);
    } else if (meError) {
      // If error is 401, clear tokens
      if (isUnauthorizedError) {
        clearTokens();
      }
      setUser(null);
      setLoading(false);
    } else if (!meLoading && !meData?.me) {
      setUser(null);
      clearTokens();
      setLoading(false);
    }
  }, [meUser, meLoading, meError, isUnauthorizedError, meData]);

  const value: AuthContextType = {
    user,
    loading: loading || meLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
