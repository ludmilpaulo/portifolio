import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start a project",
  description:
    "Start a software project with Ludmil Paulo. Full-stack development with Python, Django, Next.js, and TypeScript. Based in Cape Town and open to international work.",
  path: "/project-inquiry",
});

export default function ProjectInquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
