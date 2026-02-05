"use client";
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Endpoint: reuse the existing Next API route that proxies the backend.
const GRAPHQL_ENDPOINT = "/api/graphql";

let apolloClient: ApolloClient<any> | null = null;

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "same-origin",
    fetchOptions: { cache: "no-store" },
  });

  const authLink = setContext((_, { headers }) => {
    // Read token lazily at request time
    let token: string | null = null;
    try {
      token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    } catch {
      token = null;
    }
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache({
      resultCaching: true,
      typePolicies: {
        Query: {
          fields: {
            // You can define normalized keys here if adopting real GraphQL later
          },
        },
      },
    }),
    devtools: {
      enabled: process.env.NODE_ENV !== "production",
    },
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
        nextFetchPolicy: "cache-first",
      },
      query: {
        fetchPolicy: "cache-first",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}


