/**
 * @file apollo.ts
 * @author Guy Romelle Magayano
 * @description Apollo Client utility functions
 */

const ERROR_MESSAGES = {
  authRequired: "Authentication required. Please log in again.",
  forbidden: "You don't have permission to perform this action.",
  serverError: "Server error. Please try again later.",
  networkError: "Network error. Please check your connection.",
  unexpected: "An unexpected error occurred",
} as const;

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** Extract error message from Apollo Client error */
export function extractErrorMessage(err: unknown): string {
  const apolloError = err as {
    graphQLErrors?: Array<{ message?: string }>;
    networkError?: { message?: string; statusCode?: number };
    message?: string;
  };

  if (apolloError.graphQLErrors?.[0]?.message) {
    return apolloError.graphQLErrors[0].message;
  }

  if (apolloError.networkError) {
    const { statusCode, message } = apolloError.networkError;
    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
      return ERROR_MESSAGES.authRequired;
    }

    if (statusCode === HTTP_STATUS.FORBIDDEN) {
      return ERROR_MESSAGES.forbidden;
    }

    if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      return ERROR_MESSAGES.serverError;
    }

    return message || ERROR_MESSAGES.networkError;
  }

  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }

  return ERROR_MESSAGES.unexpected;
}
