"use client";
import React, { useEffect, useState } from "react";
import { fetchMyInfo } from "@/hooks/fetchData";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const Education = () => {
  const [education, setEducation] = useState<
    { id: number; title: string; description: string; the_year: string }[]
  >([]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await fetchMyInfo();
        setEducation(data.education);
      } catch (error) {
        console.error("Failed to fetch education data:", error);
      }
    };

    fetchEducation();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen flex flex-col text-center md:text-left xl:flex-row max-w-7xl px-10 justify-center mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Education
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-32">
        {education.map((edu) => (
          <motion.div
            key={edu.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-between"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaGraduationCap className="text-6xl text-[#0093E9] mb-4" />
            <h4 className="text-xl text-black font-semibold text-center">{edu.title}</h4>
            <p 
            dangerouslySetInnerHTML={{ __html: edu.description }} 
            className="text-sm text-gray-700 mt-2">
            </p>
            <span className="text-gray-500 mt-4">{edu.the_year}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Education;
