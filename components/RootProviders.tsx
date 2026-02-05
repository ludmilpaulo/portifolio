"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProviderWrapper from "@/components/ProviderWrapper";
import ApolloProviderWrapper from "@/components/ApolloProviderWrapper";

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProviderWrapper>
        <ApolloProviderWrapper>
          <main role="main">
            {children}
          </main>
        </ApolloProviderWrapper>
      </ProviderWrapper>
    </AuthProvider>
  );
}


