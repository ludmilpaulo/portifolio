"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import ExperienceCard from "./ExperienceCard";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { Experience } from "@/hooks/types";

const CARD_WIDTH = 380; // px, including gap

const WorkExperience: React.FC = () => {
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Swipe to scroll logic
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollRef.current)
        scrollRef.current.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    },
    onSwipedRight: () => {
      if (scrollRef.current)
        scrollRef.current.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    },
    trackMouse: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
        <div className="w-14 h-14 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !data?.experiences?.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
        <div className="text-white text-lg font-semibold">Could not load experiences. Try again later.</div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0093E9] via-cyan-100 to-[#80D0C7] py-20 overflow-x-hidden">
      {/* Animated Header */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-widest mb-16 drop-shadow"
      >
        Work Experience
      </motion.h2>
      {/* Scrollable Cards */}
      <div
        {...handlers}
        ref={scrollRef}
        className="w-full flex gap-8 sm:gap-10 overflow-x-auto px-4 sm:px-12 pb-6
                  scrollbar-thin scrollbar-thumb-blue-300/60 scrollbar-track-blue-100/60
                  snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Work experience scroll area"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {data.experiences.map((exp: Experience, i: number) => (
          <motion.div
            key={exp.id}
            className="snap-center flex-shrink-0"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 * i }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0093e955" }}
            whileFocus={{ scale: 1.04, boxShadow: "0 8px 32px #0093e955" }}
          >
            <ExperienceCard expData={exp} />
          </motion.div>
        ))}
      </div>
      {/* Mobile swipe hint */}
      <div className="block sm:hidden text-center text-white/70 text-xs mt-3 animate-pulse select-none">
        Swipe left/right to view more
      </div>
      {/* Soft shadow overlay edges for polish */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[#0093E9] to-transparent opacity-70" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#80D0C7] to-transparent opacity-70" />
    </section>
  );
};

export default WorkExperience;
