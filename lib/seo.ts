import type { Metadata } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const HOME_TITLE = "Ludmil Paulo | Software Engineer & Full-Stack Developer";
export const HOME_DESCRIPTION =
  "Explore Ludmil Paulo’s work in Python, Django, Next.js and TypeScript. Based in Cape Town and open to international roles, projects and partnerships.";

export const HOME_OG_ALT = "Ludmil Paulo, Software Engineer and Full-Stack Developer, based in Cape Town";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  languages?: { en: string; pt: string };
};

export function pageMetadata({ title, description, path, absoluteTitle, languages }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const portuguese = path === "/pt" || path.startsWith("/pt/");
  const fullTitle = absoluteTitle ? title : `${title} | Ludmil Paulo - Software Engineer`;
  const alternates: Metadata["alternates"] = { canonical: url };
  if (languages) {
    alternates.languages = {
      en: absoluteUrl(languages.en),
      pt: absoluteUrl(languages.pt),
      "x-default": absoluteUrl(languages.en),
    };
  }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: "Ludmil Paulo",
      locale: portuguese ? "pt_PT" : "en_US",
      alternateLocale: portuguese ? ["en_US"] : ["pt_PT"],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: HOME_OG_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function verificationMetadata(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

export function personAndWebsiteSchema() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: "Ludmil Paulo",
        jobTitle: "Software Engineer & Full-Stack Developer",
        description: HOME_DESCRIPTION,
        url,
        image: `${url}/avatar/lud.jpeg`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cape Town",
          addressCountry: "ZA",
        },
        sameAs: [
          "https://www.facebook.com/ludmilpaulo/",
          "https://linkedin.com/in/ludmilpaulo",
          "https://github.com/ludmilpaulo",
          "https://twitter.com/ludmilpaulo",
        ],
        knowsAbout: [
          "Software Engineering",
          "Full-Stack Development",
          "Python",
          "Django",
          "Next.js",
          "TypeScript",
          "API Development",
          "Technical Operations",
        ],
        worksFor: { "@type": "Organization", name: "Freelance Software Engineer" },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: "Ludmil Paulo",
        url,
        description: HOME_DESCRIPTION,
        inLanguage: ["en", "pt"],
        publisher: { "@id": `${url}/#person` },
      },
    ],
  };
}
