import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

import { getAccessToken } from "@web/lib/auth/utils";

const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URL || "/graphql";

// HTTP link to GraphQL endpoint
// credentials: "include" ensures cookies are sent with requests
const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
  credentials: "include", // Required for httpOnly cookies
});

/** Add legacy bearer tokens for non-cookie sessions when present. */
const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  };
});

// Create Apollo Client instance with optimized cache configuration
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tasks: {
            // Replace the current page with the latest server result.
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    },
  },
});
