import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadata as layoutMetadata, getStructuredData } from "./layout-metadata";
import { I18nProvider } from "@/contexts/I18nContext";

const AppShell = dynamic(
  () => import("@/components/AppShell"),
  {
    loading: () => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0093E9]" />
      </div>
    ),
  }
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = layoutMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = getStructuredData();

  return (
    <html className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://ludmil.pythonanywhere.com" />
        <meta name="theme-color" content="#0093E9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50`} suppressHydrationWarning>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
