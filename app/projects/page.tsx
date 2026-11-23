import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Software project case studies by Ludmil Paulo, a full-stack developer in Cape Town. Python, Django, Next.js, TypeScript, and API development.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsView />;
}
