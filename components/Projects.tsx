import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import Link from "next/link";

const Projects = ({ myProjects }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % myProjects.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [myProjects.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-50"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Projects
      </h3>

      <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20">
        {myProjects.map((project: any, index: number) => (
          <div
            key={project.id}
            className={`w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen ${
              index === activeIndex ? "" : "hidden"
            }`}
          >
            <motion.img
              initial={{
                y: -300,
                opacity: 0,
              }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src={project.image}
              alt=""
              className="rounded-lg shadow-lg"
            />

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
              <h4 className="text-4xl font-semibold text-center">
                <span className="underline decoration-[#F7AB0A]/50">
                  {project.title}
                </span>
              </h4>
              <div className="flex justify-center space-x-6">
                {project?.demo && (
                  <SocialIcon
                    url={project.demo}
                    fgColor="white"
                    bgColor="transparent"
                  />
                )}
                {project?.github && (
                  <SocialIcon
                    url={project.github}
                    fgColor="white"
                    bgColor="transparent"
                  />
                )}
              </div>
              <p className="text-lg text-center md:text-left text-gray-200">
                {project?.description
                  ?.slice(0, 200)
                  .replace("<p>", "")
                  .replace("</p>", "")
                  .replace("<br />", "")}
              </p>
            </div>
            <Link
              href={{
                pathname: "/ProjectDetails",
                query: {
                  id: project.id,
                  name: project.title,
                  description: project.description,
                  image_url: project.image,
                  demo: project.demo,
                  github: project.github,
                  tools: JSON.stringify(project?.tools),
                },
              }}
            >
              <button className="heroButton">Read More</button>
            </Link>
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-[#F7AB0A]/10 left-0 h-[500px] -skew-y-12" />
    </motion.div>
  );
};

export default Projects;
