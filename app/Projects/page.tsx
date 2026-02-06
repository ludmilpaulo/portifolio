"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaClone,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import ProjectCard from "./ProjectCard";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { Project, Competence } from "@/hooks/types";

// Tab config
const TAB_CONFIG: { label: string; icon: React.ReactNode; status: number }[] = [
  { label: "Live", icon: <FaCheckCircle />, status: 2 },
  { label: "Upcoming", icon: <FaHourglassHalf />, status: 3 },
  { label: "In Progress", icon: <FaClock />, status: 4 },
  { label: "Clone", icon: <FaClone />, status: 1 },
];

const getAllTools = (projects: Project[]): Competence[] => {
  const all: { [id: number]: Competence } = {};
  projects.forEach((p) =>
    p.tools.forEach((tool) => {
      all[tool.id] = tool;
    })
  );
  return Object.values(all);
};

const Projects: React.FC = () => {
  // RTK Query
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const projects = useMemo<Project[]>(() => data?.projects ?? [], [data?.projects]);

  const [activeTab, setActiveTab] = useState<number>(2);
  const [search, setSearch] = useState("");
  const [toolId, setToolId] = useState<number | "">("");

  // Tools for filter dropdown
  const tools = useMemo(() => getAllTools(projects), [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((p) => Number(p.status) === Number(activeTab));
    if (search.trim())
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase())
      );
    if (toolId)
      filtered = filtered.filter((p) =>
        p.tools.some((tool) => tool.id === toolId)
      );
    return filtered;
  }, [projects, activeTab, search, toolId]);

  // Handle swipe change for mobile
  const handleSwiperTabChange = (swiper: any) => {
    setActiveTab(TAB_CONFIG[swiper.activeIndex].status);
  };

  return (
    <section className="relative py-12 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Tabs for desktop */}
      <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
        {TAB_CONFIG.map(({ label, icon, status }) => (
          <button
            key={label}
            className={`
              relative flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold transition-all duration-200
              ${
                activeTab === status
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-400
            `}
            tabIndex={0}
            onClick={() => setActiveTab(status)}
            aria-pressed={activeTab === status}
            aria-label={label}
          >
            {icon}
            <span>{label}</span>
            {activeTab === status && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-3/4 rounded-full bg-white bg-opacity-70"
                style={{ zIndex: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Swiper Tabs for mobile */}
      <div className="md:hidden mb-8">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          grabCursor
          slidesPerView={1.5}
          centeredSlides
          spaceBetween={10}
          onSlideChange={handleSwiperTabChange}
          initialSlide={TAB_CONFIG.findIndex((t) => t.status === activeTab)}
          className="w-full max-w-md mx-auto"
          style={{ minHeight: 70 }}
        >
          {TAB_CONFIG.map(({ label, icon, status }) => (
            <SwiperSlide key={label}>
              <button
                onClick={() => setActiveTab(status)}
                className={`w-full flex flex-col items-center px-4 py-2 rounded-full transition-all ${
                  activeTab === status
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700"
                }`}
                aria-pressed={activeTab === status}
                aria-label={label}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-semibold">{label}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-10">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 w-full md:w-1/3"
        >
          <FaSearch className="text-gray-400" />
          <input
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-base text-gray-800"
            aria-label="Search projects"
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-red-500"
            >
              <FaTimesCircle />
            </button>
          )}
        </motion.div>

        {/* Tech Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 mt-3 md:mt-0"
        >
          <span className="font-medium text-gray-600 text-sm">Filter by Tech:</span>
          <select
            value={toolId}
            onChange={(e) =>
              setToolId(e.target.value ? Number(e.target.value) : "")
            }
            className="bg-transparent outline-none text-base text-gray-800"
            aria-label="Filter by tech"
          >
            <option value="">All</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.title}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Projects Grid (desktop/tablet) or Carousel (mobile) */}
      <LayoutGroup>
        <motion.div
          layout
          className="hidden md:grid gap-10 md:grid-cols-2 xl:grid-cols-3 min-h-[300px]"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="col-span-full flex justify-center items-center min-h-[180px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-t-4 border-b-4 border-blue-400 rounded-full animate-spin mb-4" />
                  <div className="text-blue-700 font-semibold">
                    Loading projects...
                  </div>
                </div>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                className="col-span-full flex flex-col items-center py-16"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/error.svg"
                  alt="Error"
                  width={140}
                  height={140}
                  className="mb-6 opacity-70"
                  unoptimized
                />
                <div className="text-xl text-red-400 text-center mb-2">
                  Error loading projects.
                </div>
                <div className="text-sm text-gray-400 text-center">
                  Please try again later.
                </div>
              </motion.div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                className="col-span-full flex flex-col items-center py-16"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/no-data.svg"
                  alt="No projects"
                  width={140}
                  height={140}
                  className="mb-6 opacity-70"
                  unoptimized
                />
                <div className="text-xl text-gray-400 text-center mb-2">
                  No projects in this category yet.
                </div>
                <div className="text-sm text-gray-400 text-center">
                  Check back soon for more updates!
                </div>
              </motion.div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
        {/* Mobile carousel (auto-advances) */}
        <div className="md:hidden">
          <Swiper
            modules={[EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            slidesPerView={1}
            coverflowEffect={{
              rotate: 24,
              stretch: 0,
              depth: 150,
              modifier: 1.7,
              slideShadows: true,
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            style={{ paddingBottom: 48 }}
            className="w-full"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <SwiperSlide key={project.id}>
                  <ProjectCard {...project} />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="flex flex-col items-center py-16">
                  <Image
                    src="/no-data.svg"
                    alt="No projects"
                    width={120}
                    height={120}
                    className="mb-4 opacity-60"
                    unoptimized
                  />
                  <div className="text-base text-gray-400 text-center mb-1">
                    No projects in this category.
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </LayoutGroup>
    </section>
  );
};

export default Projects;
