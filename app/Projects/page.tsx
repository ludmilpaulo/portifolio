"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaClock, FaHourglassHalf, FaClone } from "react-icons/fa";
import ProjectCard from "./ProjectCard";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Project } from "@/hooks/types";

const TAB_CONFIG: { label: string; icon: React.ReactNode; status: number }[] = [
  { label: "Live", icon: <FaCheckCircle />, status: 2 },
  { label: "Upcoming", icon: <FaHourglassHalf />, status: 3 },
  { label: "In Progress", icon: <FaClock />, status: 4 },
  { label: "Clone", icon: <FaClone />, status: 1 },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<number>(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setProjects(data.projects);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative py-10 px-4 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {TAB_CONFIG.map(({ label, icon, status }) => (
          <button
            key={label}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold transition-all duration-200
              ${
                activeTab === status
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => setActiveTab(status)}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid gap-10 md:grid-cols-2 xl:grid-cols-3"
        aria-live="polite"
      >
        <AnimatePresence>
          {projects
            .filter((p) => p.status === activeTab)
            .map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Projects;
