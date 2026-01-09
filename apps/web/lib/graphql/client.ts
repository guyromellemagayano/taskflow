import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://api.localhost:8000/graphql",
  credentials: "include",
});

// Auth link to add token to requests
const authLink = setContext((_, { headers }) => {
  // Get access token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("taskflow_access_token") : null;

  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  };
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
