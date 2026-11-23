import type { Metadata } from "next";
import AboutView from "./AboutView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Ludmil Paulo, a software engineer and full-stack developer in Cape Town. Work spans Python, Django, Next.js, TypeScript, API development, and technical operations. Open to international opportunities.",
  path: "/about",
  languages: { en: "/about", pt: "/pt/about" },
});

export default function AboutPage() {
  return <AboutView locale="en" />;
}
