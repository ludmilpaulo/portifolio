"use client";
import { ReactNode, useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { getApolloClient } from "@/lib/apolloClient";

export default function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => getApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}


