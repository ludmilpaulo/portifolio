import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
  description: "Welcome to Ludmil Paulo's personal portfolio. Discover innovative projects, comprehensive skills, and professional experiences of a Senior Software Engineer and Full Stack Developer.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
      <Header/>
        {children}
        </div>
        </body>
    </html>
  );
}
