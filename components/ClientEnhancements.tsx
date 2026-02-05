"use client";
import dynamic from "next/dynamic";

const PerformanceMonitor = dynamic(() => import("@/components/PerformanceMonitor"), { ssr: false });
const FloatingActionButton = dynamic(() => import("@/components/FloatingActionButton"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });

export default function ClientEnhancements() {
  return (
    <>
      <PerformanceMonitor />
      <ScrollProgress />
      <ParticleBackground />
      <FloatingActionButton />
    </>
  );
}

