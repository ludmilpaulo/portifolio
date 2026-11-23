import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Reset client password" },
  robots: { index: false, follow: false },
};

export default function ClientForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
