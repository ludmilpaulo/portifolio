import type { Metadata } from "next";
import ContactView from "../../contact/ContactView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contacte Ludmil Paulo na Cidade do Cabo para marcar uma reunião, falar de um projeto de software ou de uma oportunidade internacional.",
  path: "/pt/contact",
  languages: { en: "/contact", pt: "/pt/contact" },
});

export default function PortugueseContactPage() {
  return <ContactView locale="pt" />;
}
