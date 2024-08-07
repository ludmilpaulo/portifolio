import React from "react";
import ExperienceCard from "./ExperienceCard";
import { motion } from "framer-motion";

interface ExperienceData {
  [x: string]: any;
  title: string;
  description: string;
  the_year: string;
}

type Props = {
  directionLeft?: Boolean;
};

const WorkExperience = ({ workData }: any) => {
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
      className="h-screen flex relative overflow-hidden flex-col text-left md:flex-row max-w-full px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Experience
      </h3>
      <div className="w-full flex space-x-5 overflow-x-scroll p-10 snap-x snap-mandatory scrollbar scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-700 scrollbar-track-gray-400">
        {workData.map((exp: any) => (
          <ExperienceCard key={exp.id} expData={exp} />
        ))}
      </div>
    </motion.div>
  );
};

export default WorkExperience;
