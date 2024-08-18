"use client";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Competence } from "@/hooks/types";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import Image from "next/image";

type Props = {
  directionLeft?: boolean;
};

const Skills: React.FC<Props> = ({ directionLeft }) => {
  const [mySkills, setMySkills] = useState<{ competences: Competence[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setMySkills({ competences: data.competences });
        console.log("work data", data);
      } catch (error) {
        console.error("Failed to fetch work data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 1.5,
      }}
      whileInView={{
        opacity: 1,
      }}
      className="flex relative flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Skills
      </h3>

      <h3 className="absolute top-36 uppercase tracking-[3px] text-gray-500 text-sm">
        Hover over a skill for current proficiency
      </h3>

      <div className="grid grid-cols-4 gap-5 mt-16">
        {mySkills?.competences.map((skill) => (
          <div key={skill.id} className="group relative flex flex-col items-center cursor-pointer">
            <motion.div
              initial={{
                x: directionLeft ? -200 : 200,
                opacity: 0,
              }}
              transition={{ duration: 1 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <Image
                src={skill.image}
                alt={skill.title}
                className="rounded-full border border-gray-500 object-cover w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
                width={128}
                height={128}
              />
              <h4 className="mt-2 text-lg font-semibold">{skill.title}</h4>
            </motion.div>

            <Tooltip title={skill.description} placement="top">
              <div className="w-full mt-2">
                <LinearProgress
                  variant="determinate"
                  value={parseInt(skill.percentage)} // Ensure percentage is a number
                  className="w-24 h-3 md:w-28 md:h-3 xl:w-32 xl:h-4 rounded-full"
                />
                <p className="text-center mt-1 text-sm text-gray-600">{skill.percentage}</p>
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Skills;
