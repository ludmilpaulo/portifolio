import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://ludmilpaulo.com"),
  title: {
    default: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer | Portfolio",
    template: "%s | Ludmil Paulo - Software Engineer",
  },
  description:
    "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, TypeScript, and mobile app development.",
  keywords: [
    "software engineer",
    "full stack developer",
    "react developer",
    "portfolio",
    "Ludmil Paulo",
  ],
  authors: [{ name: "Ludmil Paulo", url: "https://ludmilpaulo.com" }],
  creator: "Ludmil Paulo",
  publisher: "Ludmil Paulo",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ludmilpaulo.com",
    siteName: "Ludmil Paulo Portfolio",
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Senior Software Engineer & Full Stack Developer. Building scalable web and mobile solutions.",
    images: [{ url: "/avatar/lud.jpeg", width: 1200, height: 630, alt: "Ludmil Paulo", type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ludmilpaulo",
    creator: "@ludmilpaulo",
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Senior Software Engineer & Full Stack Developer. Building scalable web and mobile solutions.",
    images: ["/avatar/lud.jpeg"],
  },
  alternates: { canonical: "https://ludmilpaulo.com" },
  category: "technology",
  other: {
    "theme-color": "#0093E9",
    "application-name": "Ludmil Paulo Portfolio",
  },
};

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ludmil Paulo",
    jobTitle: "Senior Software Engineer & Full Stack Developer",
    description: "Senior Software Engineer & Full Stack Developer with 7+ years of experience.",
    url: "https://ludmilpaulo.com",
    image: "https://ludmilpaulo.com/avatar/lud.jpeg",
    sameAs: [
      "https://linkedin.com/in/ludmilpaulo",
      "https://github.com/ludmilpaulo",
      "https://twitter.com/ludmilpaulo",
    ],
    knowsAbout: ["Software Engineering", "React", "Next.js", "Node.js", "Python", "TypeScript", "Web Development"],
    worksFor: { "@type": "Organization", name: "Freelance Software Engineer" },
  };
}
