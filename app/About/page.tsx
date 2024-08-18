"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";

const About = () => {
  const [aboutMe, setAboutMe] = useState<Info | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setAboutMe(data.info[0]); // Assuming you want the first info object
        console.log("about data", data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };

    fetchData();
  }, []);

  if (!aboutMe) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-10 md:space-y-0 md:space-x-8"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col md:flex-row space-y-6 md:space-y-0">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex-shrink-0 w-full md:w-1/3 flex justify-center"
          >
            <Image
              src={aboutMe.avatar}
              alt="Avatar"
              className="rounded-full object-cover shadow-lg"
              width={320}
              height={320}
            />
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col space-y-6"
          >
            <h4 className="text-3xl md:text-4xl font-semibold text-gray-800">
              Here is a{" "}
              <span className="underline decoration-yellow-500 text-yellow-500">
                little
              </span>{" "}
              background
            </h4>
            <p className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: aboutMe.mini_about }} />
            <p className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: aboutMe.about }} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
