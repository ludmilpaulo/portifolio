"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGetTestimonialsQuery } from "@/store/testimonialsApi";

const AUTO_ADVANCE_MS = 5000; // 5 seconds

function TestimonialsSection() {
  const { data: testimonials = [], isLoading, isError } = useGetTestimonialsQuery();
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance logic
  useEffect(() => {
    if (!testimonials.length) return;
    if (isHovered) return; // Pause on hover

    intervalRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length, isHovered]);

  // Reset idx if testimonials data changes
  useEffect(() => {
    setIdx(0);
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-400 rounded-full animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 py-12">
        Error loading testimonials. Please try again later.
      </div>
    );
  }
  if (!testimonials.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        No testimonials yet. Be the first to leave one!
      </div>
    );
  }

  const safeIdx = Math.max(0, Math.min(idx, testimonials.length - 1));
  const testimonial = testimonials[safeIdx];

  return (
    <section
      className="relative py-12 px-2 sm:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10 text-blue-800 dark:text-cyan-200 tracking-widest">
        Testimonials
      </h2>
      <div className="flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={testimonial?.id || testimonial?.name}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-full mx-auto bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl px-6 md:px-10 py-8 text-center flex flex-col items-center border-2 border-blue-100 dark:border-cyan-800 hover:shadow-blue-300/30 transition"
          >
            {testimonial.avatar && testimonial.avatar !== "/testimonials/default.jpg" ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={72}
                height={72}
                className="rounded-full border-4 border-blue-200 mb-4 shadow object-cover"
              />
            ) : (
              <div className="w-18 h-18 rounded-full border-4 border-blue-200 mb-4 shadow bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <blockquote className="text-lg text-gray-800 dark:text-cyan-100 italic mb-3">
              “{testimonial.text}”
            </blockquote>
            <span className="text-blue-700 dark:text-cyan-200 font-bold">{testimonial.name}</span>
            <span className="text-gray-400 dark:text-cyan-400 text-sm">{testimonial.role}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((t, i) => (
          <button
            key={t.id || t.name}
            onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`w-4 h-4 rounded-full ring-2 ring-blue-100 dark:ring-cyan-700 transition
              ${i === safeIdx ? "bg-blue-500 dark:bg-cyan-300 scale-110 shadow-lg" : "bg-blue-200 dark:bg-cyan-800"}`}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          aria-label="Previous testimonial"
          className="text-blue-600 dark:text-cyan-300 font-bold px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-cyan-900"
        >
          &larr; Prev
        </button>
        <button
          onClick={() => setIdx((prev) => (prev + 1) % testimonials.length)}
          aria-label="Next testimonial"
          className="text-blue-600 dark:text-cyan-300 font-bold px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-cyan-900"
        >
          Next &rarr;
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-cyan-700 mt-4">
        Auto-advances every 5 seconds. Pause by hovering.
      </p>
    </section>
  );
}

export default TestimonialsSection;
