import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  languages: { en: "/", pt: "/pt" },
});

export default function Page() {
  return <HomePage locale="en" />;
}
