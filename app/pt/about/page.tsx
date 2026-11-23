import type { Metadata } from "next";
import AboutView from "../../about/AboutView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sobre",
  description:
    "Sobre Ludmil Paulo, engenheiro de software e desenvolvedor full-stack na Cidade do Cabo. Python, Django, Next.js, TypeScript, desenvolvimento de APIs e operações técnicas. Aberto a oportunidades internacionais.",
  path: "/pt/about",
  languages: { en: "/about", pt: "/pt/about" },
});

export default function PortugueseAboutPage() {
  return <AboutView locale="pt" />;
}
