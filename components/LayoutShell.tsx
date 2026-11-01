"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { baseUrl } from "@/hooks/fetchData";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const showHeader = !isDashboard;

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
      return;
    }
    fetch(`${baseUrl}api/track-visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50/80">
      {showHeader && <Header />}
      {children}
    </div>
  );
}
