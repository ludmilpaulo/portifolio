"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import { useGetMyInfoQuery } from "@/store/myInfoApi";

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 30, scale: 0.96 },
};

const Education: React.FC = () => {
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const education = data?.education ?? [];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3 }}
      className="relative min-h-screen py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100
                 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
                 flex flex-col items-center"
    >
      {/* Floating background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-16 -left-32 w-72 h-72 bg-gradient-to-br from-cyan-300/25 via-blue-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-blue-300/25 via-cyan-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
        className="z-10 uppercase tracking-[16px] text-blue-700 dark:text-cyan-200 text-3xl font-bold mb-14 text-center drop-shadow"
      >
        Education
      </motion.h2>

      {/* Cards grid */}
      <AnimatePresence mode="wait">
        <div className="z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl px-4">
          {isLoading ? (
            <motion.div
              key="loading"
              className="col-span-full flex flex-col items-center min-h-[200px]"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-14 h-14 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin mb-4" />
              <div className="text-blue-700 font-semibold">Loading education...</div>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              className="col-span-full flex flex-col items-center min-h-[200px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/error.svg"
                alt="Error"
                width={90}
                height={90}
                className="mb-4 opacity-60"
                unoptimized
              />
              <div className="text-red-500 text-lg mb-1">Error loading education data.</div>
              <div className="text-gray-400 text-center text-sm">Please try again later.</div>
            </motion.div>
          ) : education.length === 0 ? (
            <motion.div
              key="empty"
              className="col-span-full flex flex-col items-center min-h-[200px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/no-data.svg"
                alt="No education"
                width={90}
                height={90}
                className="mb-4 opacity-60"
                unoptimized
              />
              <div className="text-gray-500 text-lg">No education records yet.</div>
            </motion.div>
          ) : (
            education.map((edu, i) => (
              <motion.div
                key={edu.id}
                className="group bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl border-2 border-blue-100 dark:border-cyan-800
                           p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.66 + i * 0.05, type: "spring" }}
                tabIndex={0}
              >
                <div className="absolute -top-8 -right-10 w-28 h-28 rounded-full bg-gradient-to-tr from-blue-100 via-cyan-50 to-white blur-2xl group-hover:scale-110 transition" />
                <FaGraduationCap className="text-5xl text-blue-400 dark:text-cyan-300 mb-5 drop-shadow" />
                <h4 className="text-xl font-bold text-blue-900 dark:text-cyan-200 mb-1">{edu.title}</h4>
                <div
                  className="text-gray-700 dark:text-cyan-100 text-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: edu.description }}
                />
                <span className="mt-auto text-xs font-medium text-blue-600 dark:text-cyan-400 tracking-wide">
                  {edu.the_year}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </AnimatePresence>
    </motion.section>
  );
};

export default Education;
