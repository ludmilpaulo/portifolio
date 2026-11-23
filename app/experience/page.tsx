import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Work experience of Ludmil Paulo, a software engineer and full-stack developer based in Cape Town and open to international roles.",
  path: "/experience",
});

export default function ExperiencePage() {
  return <ExperienceView />;
}
