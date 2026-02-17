"use client";
import { ReactNode } from "react";
import RootProviders from "@/components/RootProviders";
import LayoutShell from "@/components/LayoutShell";

/** Wraps app in providers and layout shell. Loaded via dynamic() to avoid layout chunk timeout. */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <RootProviders>
      <LayoutShell>{children}</LayoutShell>
    </RootProviders>
  );
}
