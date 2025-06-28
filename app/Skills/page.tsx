"use client";

import { fetchMyInfo } from "@/hooks/fetchData";
import { Competence } from "@/hooks/types";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const SkillTooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -top-10 z-30 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-xl whitespace-nowrap transform -translate-x-1/2
                          dark:bg-white dark:text-gray-900 border dark:border-gray-200">
          {text}
        </span>
      )}
    </span>
  );
};

const SkillProgress: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full mt-3">
    <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.3, type: "spring" }}
        className="absolute left-0 top-0 h-full rounded-full
          bg-gradient-to-r from-green-400 via-blue-400 to-cyan-300
          dark:from-cyan-500 dark:via-blue-600 dark:to-blue-400
          shadow-[0_0_14px_0px_rgba(59,130,246,0.25)]"
        style={{ width: `${value}%` }}
      />
      {/* Glowing effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: value > 90 ? 0.55 : 0 }}
        transition={{ duration: 1 }}
        className="absolute left-0 top-0 h-full rounded-full
          bg-gradient-to-r from-yellow-400 to-transparent blur-md pointer-events-none"
        style={{ width: `${value}%` }}
      />
    </div>
    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 font-semibold">{value}%</div>
  </div>
);

const SkillsPage: React.FC = () => {
  const [competences, setCompetences] = useState<Competence[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setCompetences(data.competences);
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, type: "spring" }}
      className="min-h-screen flex flex-col items-center
        bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
        pb-16"
    >
      {/* Header */}
      <div className="mt-24 mb-14 text-center">
        <h2 className="uppercase tracking-widest text-gray-600 dark:text-cyan-200 text-4xl font-extrabold drop-shadow">Skills</h2>
        <h4 className="mt-2 uppercase tracking-[3px] text-gray-500 dark:text-gray-400 text-base">
          Hover over a skill for details
        </h4>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-7xl px-4 sm:px-8">
        {competences.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="group flex flex-col items-center 
              bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl
              shadow-2xl dark:shadow-blue-950 border border-blue-100 dark:border-blue-900
              rounded-3xl px-6 py-7
              hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-900/80
              hover:shadow-blue-300/30 dark:hover:shadow-cyan-400/40
              transition-all duration-300 relative overflow-hidden
              before:absolute before:inset-0 before:rounded-3xl
              before:border-2 before:border-blue-200 dark:before:border-cyan-900
              before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
            "
            tabIndex={0}
          >
            <SkillTooltip text={skill.description}>
              <motion.div
                whileHover={{
                  scale: 1.13,
                  rotate: -3,
                  filter: "drop-shadow(0px 6px 14px #3b82f6cc)",
                }}
                whileTap={{ scale: 0.97 }}
                className="transition-transform"
              >
                <Image
                  src={skill.image}
                  alt={skill.title}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-blue-100 dark:border-cyan-400 object-cover shadow-lg dark:shadow-cyan-900"
                />
              </motion.div>
            </SkillTooltip>
            <div className="mt-4 font-bold text-lg text-blue-800 dark:text-cyan-200 text-center drop-shadow">{skill.title}</div>
            <SkillProgress value={parseInt(skill.percentage, 10)} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default SkillsPage;
