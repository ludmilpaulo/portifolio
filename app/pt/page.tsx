import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { pageMetadata } from "@/lib/seo";

const title = "Ludmil Paulo | Engenheiro de Software e Desenvolvedor Full-Stack";
const description =
  "Conheça o trabalho de Ludmil Paulo em Python, Django, Next.js e TypeScript. Na Cidade do Cabo e aberto a oportunidades, projetos e parcerias internacionais.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/pt",
  absoluteTitle: true,
  languages: { en: "/", pt: "/pt" },
});

export default function PortugueseHomePage() {
  return <HomePage locale="pt" />;
}
