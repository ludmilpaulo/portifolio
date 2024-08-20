"use client";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import {
  FaInfoCircle,
  FaBriefcase,
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
  FaGraduationCap,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [header, setHeader] = useState<Info | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setHeader(data.info[0]); // Assuming you want the first info object
        console.log("header data", data);
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      }
    };

    fetchData();
  }, []);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (!header) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <>
      <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center bg-gradient-to-r from-[#0093E9] to-[#80D0C7] shadow-lg">
        <motion.div
          initial={{ x: -500, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="flex flex-row items-center space-x-4"
        >
          {header.facebook && (
            <SocialIcon
              url={header.facebook}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header.linkedin && (
            <SocialIcon
              url={header.linkedin}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header.twitter && (
            <SocialIcon
              url={header.twitter}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header.github && (
            <SocialIcon
              url={header.github}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header.instagram && (
            <SocialIcon
              url={header.instagram}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ x: 500, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="hidden md:flex flex-row items-center text-white cursor-pointer space-x-2 sm:space-x-4"
        >
          <Link href="/About">
            <div className="heroButton flex flex-col items-center space-y-1 text-xs sm:text-sm">
              <FaInfoCircle className="text-lg sm:text-xl" />
              <span>About</span>
            </div>
          </Link>
          <Link href="/Experience">
            <div className="heroButton flex flex-col items-center space-y-1 text-xs sm:text-sm">
              <FaBriefcase className="text-lg sm:text-xl" />
              <span>Experience</span>
            </div>
          </Link>
          <Link href="/Skills">
            <div className="heroButton flex flex-col items-center space-y-1 text-xs sm:text-sm">
              <FaTools className="text-lg sm:text-xl" />
              <span>Skills</span>
            </div>
          </Link>
          <Link href="/Projects">
            <div className="heroButton flex flex-col items-center space-y-1 text-xs sm:text-sm">
              <FaProjectDiagram className="text-lg sm:text-xl" />
              <span>Projects</span>
            </div>
          </Link>
          <Link href="/Education">
            <div className="heroButton flex flex-col items-center space-y-1 text-xs sm:text-sm">
              <FaGraduationCap className="text-lg sm:text-xl" />
              <span>Education</span>
            </div>
          </Link>
        </motion.div>

        {/* Menu Button on Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={handleDrawerToggle} className="text-white text-2xl">
            {drawerOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Drawer Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center transition-transform duration-500 ease-in-out transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-white text-black rounded-lg p-8 shadow-lg w-80 space-y-6">
          <Link href="/About" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2">
              <FaInfoCircle className="text-lg" />
              <span>About</span>
            </div>
          </Link>
          <Link href="/Experience" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-lg" />
              <span>Experience</span>
            </div>
          </Link>
          <Link href="/Skills" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2">
              <FaTools className="text-lg" />
              <span>Skills</span>
            </div>
          </Link>
          <Link href="/Projects" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2">
              <FaProjectDiagram className="text-lg" />
              <span>Projects</span>
            </div>
          </Link>
          <Link href="/Education" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-lg" />
              <span>Education</span>
            </div>
          </Link>
        </div>
      </div>
      {/* Inquiry Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
