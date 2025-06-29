"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";

const TestimonialForm = dynamic(() => import("@/components/TestimonialForm"), { ssr: false });

export default function LeaveTestimonialPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center
      bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-200
      dark:from-gray-900 dark:via-gray-950 dark:to-blue-900
      overflow-hidden"
    >
      {/* Floating Orbs/Brand shapes */}
      <div className="pointer-events-none absolute z-0 inset-0">
        <div className="absolute -top-16 -left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-100/30 rounded-full blur-2xl" />
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-96 h-24 bg-gradient-to-r from-cyan-100/30 via-blue-100/20 to-transparent rounded-2xl blur-2xl" />
      </div>

      <Suspense
        fallback={
          <motion.div
            className="z-10 bg-white/90 dark:bg-gray-900/90 border-2 border-blue-100 dark:border-cyan-800 rounded-2xl px-10 py-14 shadow-xl flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-400 rounded-full animate-spin mb-5" />
            <div className="text-blue-700 dark:text-cyan-200 font-semibold text-lg">Loading form…</div>
          </motion.div>
        }
      >
        <motion.div
          className="z-10 w-full max-w-lg"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <TestimonialForm />
        </motion.div>
      </Suspense>
    </div>
  );
}
