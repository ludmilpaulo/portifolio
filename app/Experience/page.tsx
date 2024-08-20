"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Experience } from "@/hooks/types";

const WorkExperience = () => {
  const [workData, setWorkData] = useState<{ experiences: Experience[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setWorkData({ experiences: data.experiences });
        console.log("work data", data);
      } catch (error) {
        console.error("Failed to fetch work data:", error);
      }
    };

    fetchData();
  }, []);

  if (!workData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
        <div className="text-white text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-r from-[#0093E9] to-[#80D0C7] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative h-full flex flex-col text-center md:text-left md:flex-row max-w-full px-4 sm:px-10 md:px-20 justify-center md:justify-evenly mx-auto items-center"
      >
        <div className="w-full flex space-x-4 overflow-x-auto p-4 md:p-10 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-700 scrollbar-track-gray-400">
          {workData.experiences.map((exp) => (
            <ExperienceCard key={exp.id} expData={exp} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkExperience;
