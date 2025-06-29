import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { Project } from "@/hooks/types";
import { useState } from "react";

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -top-9 z-30 w-max max-w-xs bg-black text-white text-xs rounded px-2 py-1 pointer-events-none shadow-md transform -translate-x-1/2">
          {text}
        </span>
      )}
    </span>
  );
};

const truncateText = (htmlContent: string, maxLength: number): string => {
  if (typeof window === "undefined") return htmlContent;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || "";
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const ProjectCard: React.FC<Project> = ({
  title,
  description,
  image,
  demo,
  github,
  tools,
  slug,
}) => {
  const truncatedDescription = truncateText(description, 100);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{
        scale: 1.045,
        boxShadow: "0 12px 32px #0093e944",
        transition: { duration: 0.3 },
      }}
      className="flex flex-col bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-blue-100 group"
      tabIndex={0}
      aria-label={`Project card: ${title}`}
    >
      <Link
        href={{
          pathname: "/projectDetails",
          query: { title, image, description, link: demo, slug, github, tools: JSON.stringify(tools) },
        }}
        tabIndex={-1}
        className="flex flex-col flex-1 focus:outline-none"
      >
        {/* Image */}
        <div className="relative w-full h-52 rounded-t-2xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex-1 px-6 py-4 flex flex-col">
          <h3 className="font-extrabold text-2xl mb-1 text-blue-700">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{truncatedDescription}</p>
          {/* Tools */}
          <div>
            <span className="text-xs text-gray-500 font-medium">Tech Stack:</span>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1 no-scrollbar">
              {tools.map((tool) => (
                <Tooltip key={tool.id} text={tool.description}>
                  <span className="inline-flex items-center bg-gradient-to-r from-cyan-50 to-blue-100 px-2 py-1 rounded-full text-xs shadow border border-blue-200">
                    <Image
                      src={tool.image}
                      alt={tool.title}
                      width={22}
                      height={22}
                      className="rounded-full mr-1 border"
                    />
                    {tool.title}
                  </span>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-b-2xl">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-yellow-600 font-bold transition"
            aria-label={`Demo for ${title}`}
          >
            <FaExternalLinkAlt className="mr-2" />
            Demo
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-yellow-600 font-bold transition"
            aria-label={`GitHub for ${title}`}
          >
            <FaGithub className="mr-2" />
            GitHub
          </a>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
