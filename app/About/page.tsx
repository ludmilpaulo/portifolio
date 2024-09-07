"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";
import { Transition } from '@headlessui/react';
import { AiOutlineDownload, AiOutlineWhatsApp } from "react-icons/ai";
import { MdEmail, MdPhone } from "react-icons/md";

const About = () => {
  const [aboutMe, setAboutMe] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setAboutMe(data.info[0]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <span className="text-white font-semibold text-lg">Loading your profile...</span>
          </div>
        </div>
      </Transition>
    );
  }

  if (!aboutMe) {
    return <div className="text-center text-red-500">Error loading data. Please try again later.</div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] min-h-screen py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="max-w-5xl mx-auto px-6 md:px-10 py-12 space-y-12"
      >
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row space-y-10 md:space-x-8">
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
            className="flex flex-col space-y-6 md:w-2/3"
          >
            <h4 className="text-4xl font-semibold text-gray-900">
              A brief{" "}
              <span className="underline decoration-yellow-500 text-yellow-500">
                introduction
              </span>
            </h4>
            <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: aboutMe.mini_about }} />
            <p className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutMe.about }} />
          </motion.div>
        </div>

        {/* Contact and Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 text-lg text-gray-700">
              <MdPhone className="text-blue-500" />
              <span>{aboutMe.phone}</span>
            </div>
            <div className="flex items-center space-x-4 text-lg text-gray-700">
              <MdEmail className="text-red-500" />
              <a href={`mailto:${aboutMe.email}`} className="text-blue-500 hover:underline">
                {aboutMe.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <a
              href={`https://wa.me/${aboutMe.phone}`}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineWhatsApp className="text-xl" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={aboutMe.cv}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
              download
            >
              <AiOutlineDownload className="text-xl" />
              <span>Download My CV</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
