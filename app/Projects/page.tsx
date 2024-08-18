"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Project, Competence } from "@/hooks/types";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const [myProjects, setMyProjects] = useState<{ projects: Project[] } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setMyProjects({ projects: data.projects });
        console.log("Project data", data);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mx-auto px-8 pt-56">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myProjects?.projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.demo}
            demo={project.demo}
            github={project.github}
            tools={project.tools}  // Passing tools to the ProjectCard component
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
