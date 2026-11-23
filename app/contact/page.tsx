import type { Metadata } from "next";
import ContactView from "./ContactView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Ludmil Paulo in Cape Town to book a meeting, discuss a software project, or talk about an international engineering role.",
  path: "/contact",
  languages: { en: "/contact", pt: "/pt/contact" },
});

export default function ContactPage() {
  return <ContactView locale="en" />;
}
