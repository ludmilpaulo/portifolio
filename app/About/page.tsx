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
        setAboutMe(data.info[0]); // Assuming you want the first info object
        setLoading(false);
        console.log("about data", data);
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
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>
    );
  }

  if (!aboutMe) {
    return <div>Error loading data.</div>;
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

        {/* Contact Info Section */}
        <div className="bg-white mt-12 max-w-7xl mx-auto px-6 md:px-10">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
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
            <div className="flex items-center space-x-4 text-lg text-gray-700 mt-4">
              <AiOutlineWhatsApp className="text-green-500" />
              <a
                href={`https://wa.me/${aboutMe.phone}`}
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Let Chat on WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center space-x-4 text-lg text-gray-700 mt-4">
              <AiOutlineDownload className="text-purple-500" />
              <a
                href={aboutMe.cv}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
                download
              >
                <span>Download My CV</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
