import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Reset admin password" },
  robots: { index: false, follow: false },
};

export default function AdminForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
