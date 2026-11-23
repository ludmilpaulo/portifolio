import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Projects" },
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/projects") },
};

export default function ProjectDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
