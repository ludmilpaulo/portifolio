import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RootProviders from "@/components/RootProviders";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ludmilpaulo.com'),
  title: {
    default: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer | Portfolio",
    template: "%s | Ludmil Paulo - Software Engineer"
  },
  description: "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, TypeScript, and mobile app development. Building scalable web applications, mobile apps, and innovative digital solutions. Available for freelance projects and consulting.",
  keywords: [
    "software engineer",
    "full stack developer", 
    "react developer",
    "node.js developer",
    "python developer",
    "typescript developer",
    "mobile app development",
    "web development",
    "javascript",
    "next.js developer",
    "django developer",
    "portfolio",
    "Ludmil Paulo",
    "senior developer",
    "tech consultant",
    "software architect",
    "digital solutions",
    "freelance developer",
    "web applications",
    "mobile applications",
    "API development",
    "database design",
    "cloud computing",
    "AWS developer",
    "responsive design",
    "UI/UX development"
  ],
  authors: [
    { name: "Ludmil Paulo", url: "https://ludmilpaulo.com" },
  ],
  creator: "Ludmil Paulo",
  publisher: "Ludmil Paulo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ludmilpaulo.com",
    siteName: "Ludmil Paulo Portfolio",
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, and mobile app development. Building scalable web applications and innovative digital solutions.",
    images: [
      {
        url: "/avatar/lud.jpeg",
        width: 1200,
        height: 630,
        alt: "Ludmil Paulo - Senior Software Engineer & Full Stack Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ludmilpaulo",
    creator: "@ludmilpaulo",
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, and mobile app development.",
    images: ["/avatar/lud.jpeg"],
  },
  alternates: {
    canonical: "https://ludmilpaulo.com",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "technology",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Ludmil Paulo Portfolio',
    'application-name': 'Ludmil Paulo Portfolio',
    'msapplication-TileColor': '#0093E9',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#0093E9',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ludmil Paulo",
    "jobTitle": "Senior Software Engineer & Full Stack Developer",
    "description": "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, TypeScript, and mobile app development. Building scalable web applications and innovative digital solutions.",
    "url": "https://ludmilpaulo.com",
    "image": "https://ludmilpaulo.com/avatar/lud.jpeg",
    "sameAs": [
      "https://linkedin.com/in/ludmilpaulo",
      "https://github.com/ludmilpaulo",
      "https://twitter.com/ludmilpaulo"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Full Stack Development", 
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Django",
      "JavaScript",
      "TypeScript",
      "Mobile App Development",
      "Web Development",
      "API Development",
      "Database Design",
      "Cloud Computing",
      "AWS",
      "Responsive Design",
      "UI/UX Development"
    ],
    "alumniOf": "Software Engineering",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Software Engineer"
    },
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Software Development Services",
        "description": "Full stack web development, mobile app development, API development, and software consulting services"
      }
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Software Engineer",
      "occupationLocation": {
        "@type": "Country",
        "name": "Global"
      },
      "skills": [
        "React", "Next.js", "Node.js", "Python", "Django", "TypeScript", 
        "JavaScript", "Mobile Development", "Web Development", "API Development"
      ]
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ludmil.pythonanywhere.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preload" href="/avatar/lud.jpeg" as="image" type="image/jpeg" />
        <meta name="theme-color" content="#0093E9" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ludmil Paulo Portfolio" />
        <link rel="apple-touch-icon" href="/avatar/lud.jpeg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50`} suppressHydrationWarning>
        <RootProviders>
          <LayoutShell>{children}</LayoutShell>
        </RootProviders>
      </body>
    </html>
  );
}