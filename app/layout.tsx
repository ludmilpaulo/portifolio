import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProviderWrapper from "@/components/ProviderWrapper";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ludmilpaulo.com'),
  title: {
    default: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    template: "%s | Ludmil Paulo"
  },
  description: "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, and mobile app development. Building scalable web applications and innovative digital solutions.",
  keywords: [
    "software engineer",
    "full stack developer", 
    "react developer",
    "node.js developer",
    "python developer",
    "mobile app development",
    "web development",
    "javascript",
    "typescript",
    "portfolio",
    "Ludmil Paulo",
    "senior developer",
    "tech consultant",
    "software architect",
    "digital solutions"
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
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ludmil Paulo",
    "jobTitle": "Senior Software Engineer & Full Stack Developer",
    "description": "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, and mobile app development.",
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
      "Node.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "Mobile App Development",
      "Web Development"
    ],
    "alumniOf": "Software Engineering",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  return (
    <html lang="en" className={inter.variable}>
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
        <meta name="theme-color" content="#0093E9" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <PerformanceMonitor />
        <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
          <ProviderWrapper>
            <Header />
            <main role="main">
              {children}
            </main>
          </ProviderWrapper>
        </div>
      </body>
    </html>
  );
}