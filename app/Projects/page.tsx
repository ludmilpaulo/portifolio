"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaHourglassHalf, FaClone } from "react-icons/fa";
import ProjectCard from "./ProjectCard";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Project } from "@/hooks/types";

const Projects = () => {
  const [myProjects, setMyProjects] = useState<{ projects: Project[] } | null>(null);
  const [activeTab, setActiveTab] = useState<number>(2); // Default to "Live" which is status 2

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setMyProjects({ projects: data.projects });
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      }
    };

    fetchData();
  }, []);

  const renderTabButton = (label: string, icon: JSX.Element, value: number) => (
    <button
      className={`flex items-center py-2 px-4 rounded-t-lg transition-colors duration-300 ${
        activeTab === value
          ? "border-b-4 border-blue-500 text-blue-600 font-semibold"
          : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {icon} <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-md rounded-lg max-w-screen-xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-around border-b-2 border-gray-200 mb-6">
        {renderTabButton("Live", <FaCheckCircle />, 2)}  {/* Live = 2 */}
        {renderTabButton("Upcoming", <FaHourglassHalf />, 3)}  {/* Upcoming = 3 */}
        {renderTabButton("In Progress", <FaClock />, 4)}  {/* In Progress = 4 */}
        {renderTabButton("Clone", <FaClone />, 1)}  {/* Clone = 1 */}
      </div>

      {/* Project Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {myProjects?.projects
          .filter((project) => project.status === activeTab)
          .map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              link={project.demo}
              demo={project.demo}
              github={project.github}
              tools={project.tools}
            />
          ))}
      </motion.div>
    </div>
  );
};

export default Projects;
