import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Client login" },
  robots: { index: false, follow: false },
};

export default function ClientLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
