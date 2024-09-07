"use client";

import { fetchMyInfo } from "@/hooks/fetchData";
import { Competence } from "@/hooks/types";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import Image from "next/image";

const SkillsPage: React.FC = () => {
  const [mySkills, setMySkills] = useState<{ competences: Competence[] } | null>(null);
  const directionLeft = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setMySkills({ competences: data.competences });
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1 }}
      className="relative flex flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center"
    >
      {/* Page Header */}
      <div className="absolute top-24 text-center">
        <h3 className="uppercase tracking-[20px] text-gray-600 text-3xl font-bold">
          Skills
        </h3>
        <h3 className="mt-2 uppercase tracking-[3px] text-gray-500 text-sm sm:text-xs">
          Hover over a skill for current proficiency
        </h3>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-28 px-4 sm:px-8">
        {mySkills?.competences.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ x: directionLeft ? -200 : 200, opacity: 0 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group relative flex flex-col items-center bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Skill Image */}
            <Image
              src={skill.image}
              alt={skill.title}
              className="rounded-full border-2 border-gray-200 object-cover w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 xl:w-36 xl:h-36 filter group-hover:grayscale transition duration-300 ease-in-out"
              width={144}
              height={144}
            />
            <h4 className="mt-3 text-lg sm:text-xl font-semibold text-gray-700">{skill.title}</h4>

            {/* Skill Progress Bar */}
            <Tooltip title={skill.description} placement="top" arrow>
              <div className="w-full mt-4">
                <LinearProgress
                  variant="determinate"
                  value={parseInt(skill.percentage, 10)}
                  className="w-24 sm:w-28 md:w-32 xl:w-36 h-2 sm:h-3 xl:h-4 rounded-full bg-gray-200"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #4ade80, #3b82f6)',
                  }}
                />
                <p className="text-center mt-2 text-sm sm:text-base font-medium text-gray-600">
                  {skill.percentage}%
                </p>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsPage;
