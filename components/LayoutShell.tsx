"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const showHeader = !isDashboard;

  return (
    <div className="min-h-screen bg-slate-50/80">
      {showHeader && <Header />}
      {children}
    </div>
  );
}
