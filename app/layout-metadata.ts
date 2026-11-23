import type { Metadata } from "next";
import { HOME_DESCRIPTION, HOME_TITLE, verificationMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: HOME_TITLE,
    template: "%s | Ludmil Paulo - Software Engineer",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "Ludmil Paulo",
    "Software Engineer",
    "Full-Stack Developer",
    "Python",
    "Django",
    "Next.js",
    "TypeScript",
    "API Development",
    "Technical Operations",
    "Cape Town",
  ],
  authors: [{ name: "Ludmil Paulo", url: siteUrl() }],
  creator: "Ludmil Paulo",
  publisher: "Ludmil Paulo",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Ludmil Paulo",
    locale: "en_US",
    alternateLocale: ["pt_PT"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ludmilpaulo",
    creator: "@ludmilpaulo",
  },
  category: "technology",
  ...(verificationMetadata() ? { verification: verificationMetadata() } : {}),
  other: {
    "theme-color": "#0093E9",
    "application-name": "Ludmil Paulo Portfolio",
  },
};

export { personAndWebsiteSchema as getStructuredData } from "@/lib/seo";
