"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Experience } from "@/hooks/types";

const WorkExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setExperiences(data.experiences);
      } catch (error) {
        console.error("Failed to fetch work data:", error);
      }
    };

    fetchData();
  }, []);

  if (!experiences.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
        <div className="text-white text-lg font-semibold">Loading...</div>
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
      <div className="w-full flex gap-6 overflow-x-auto px-6 sm:px-12
                      scrollbar-thin scrollbar-thumb-blue-300/60 scrollbar-track-blue-100/60
                      hover:scrollbar-thumb-blue-500/80 snap-x snap-mandatory"
           tabIndex={0}
           aria-label="Work experience scroll area"
      >
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} expData={exp} />
        ))}
      </div>
    </section>
  );
};

export default WorkExperience;
