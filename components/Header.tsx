"use client";
import { baseUrl, fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { Transition } from "@headlessui/react";
import {
  FaInfoCircle,
  FaBriefcase,
  FaTools,
  FaProjectDiagram,
  FaBlogger,
  FaEnvelope,
  FaGraduationCap,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [header, setHeader] = useState<Info | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading to true when submission starts

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch(`${baseUrl}submit-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Step 3: Set loading to false when submission is done
    }
  };

  return (
    <>
      <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center bg-gradient-to-r from-[#0093E9] to-[#80D0C7] shadow-lg">
        <motion.div
          initial={{ x: -500, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="flex flex-row items-center space-x-4"
        >
          {header?.facebook && (
            <SocialIcon
              url={header.facebook}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header?.linkedin && (
            <SocialIcon
              url={header.linkedin}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header?.twitter && (
            <SocialIcon
              url={header.twitter}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header?.github && (
            <SocialIcon
              url={header.github}
              fgColor="white"
              bgColor="transparent"
              className="hover:scale-110 transition-transform duration-300"
            />
          )}
          {header?.instagram && (
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

        <div className="md:hidden flex items-center">
          <button onClick={handleDrawerToggle} className="text-white text-2xl">
            {drawerOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Drawer Menu */}
      <Transition
        show={drawerOpen}
        enter="transition-transform duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 w-64 bg-white text-black shadow-lg z-50 flex flex-col space-y-6 py-8 px-6">
          <button
            className="self-end text-gray-500 text-2xl"
            onClick={handleDrawerToggle}
          >
            <FaTimes />
          </button>
          <Link href="/About" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2 text-lg">
              <FaInfoCircle />
              <span>About</span>
            </div>
          </Link>
          <Link href="/Experience" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2 text-lg">
              <FaBriefcase />
              <span>Experience</span>
            </div>
          </Link>
          <Link href="/Skills" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2 text-lg">
              <FaTools />
              <span>Skills</span>
            </div>
          </Link>
          <Link href="/Projects" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2 text-lg">
              <FaProjectDiagram />
              <span>Projects</span>
            </div>
          </Link>
          <Link href="/Education" onClick={handleDrawerToggle}>
            <div className="flex items-center space-x-2 text-lg">
              <FaGraduationCap />
              <span>Education</span>
            </div>
          </Link>
        </div>
      </Transition>

      {/* Get in Touch Icon */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={handleModalToggle}
          className="flex flex-col items-center p-3 bg-gradient-to-r from-[#0093E9] to-[#80D0C7] rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <FaEnvelope className="text-2xl text-white" />
          <span className="text-xs text-white">Get in touch</span>
        </button>
      </div>

      {/* Inquiry Form Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white text-black p-6 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Contact Me</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields for name, email, and message */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="p-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
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
                  className="px-4 py-2 text-white bg-gradient-to-r from-[#0093E9] to-[#80D0C7] rounded-md"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
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
    </>
  );
};

export default Header;
