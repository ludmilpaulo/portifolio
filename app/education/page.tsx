import type { Metadata } from "next";
import EducationView from "./EducationView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Education",
  description: "Education of Ludmil Paulo, a software engineer and full-stack developer based in Cape Town.",
  path: "/education",
});

export default function EducationPage() {
  return <EducationView />;
}
