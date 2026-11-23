import type { Metadata } from "next";
import SkillsView from "./SkillsView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description:
    "Skills of Ludmil Paulo: Python, Django, Next.js, TypeScript, API development, and technical operations.",
  path: "/skills",
});

export default function SkillsPage() {
  return <SkillsView />;
}
