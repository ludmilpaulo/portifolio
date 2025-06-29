import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProviderWrapper from "@/components/ProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
  description: "Explore Ludmil Paulo's personal portfolio, showcasing innovative software engineering projects, expertise in full stack development, and mobile app solutions. Dive into a world of technology and discover a range of skills from front-end to back-end development.",
  keywords: "software engineering, full stack development, mobile app development, technology, Ludmil Paulo",
  authors: [
    { name: "Ludmil Paulo", url: "https://ludmilpaulo.com" },
  ],
  openGraph: {
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Welcome to Ludmil Paulo's portfolio, where technology meets innovation. Explore projects in software engineering, full stack development, and mobile app creation, and learn about Ludmil's professional experiences and technical skills.",
    url: "https://ludmilpaulo.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://ludmilpaulo.com/media/avatar/lud.jpeg", // Use an appropriate image URL here
        width: 1200,
        height: 630,
        alt: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ludmilpaulo", // Replace with your actual Twitter handle if needed
    creator: "@ludmilpaulo", // Replace with your actual Twitter handle if needed
    title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
    description: "Discover Ludmil Paulo's work in software engineering, full stack development, and mobile app projects. A portfolio filled with tech innovation and professional insights.",
    images: [
      {
        url: "https://ludmilpaulo.com/media/avatar/lud.jpeg", // Use an appropriate image URL here
        alt: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
      },
    ],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
          <ProviderWrapper>
            <Header />
            {children}
          </ProviderWrapper>
        </div>
      </body>
    </html>
  );
}