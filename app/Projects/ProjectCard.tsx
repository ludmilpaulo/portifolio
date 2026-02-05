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
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(0, 147, 233, 0.08)",
        transition: { duration: 0.3 },
      }}
      className="flex flex-col bg-white dark:bg-slate-900/95 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 group overflow-hidden"
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
            alt={`${title} - Software Development Project`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="lazy"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>

        {/* Details */}
        <div className="flex-1 px-6 py-4 flex flex-col">
          <h3 className="font-bold text-xl mb-1.5 text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 leading-relaxed">{truncatedDescription}</p>
          {/* Tools */}
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tech Stack</span>
            <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1 no-scrollbar scrollbar-thin">
              {tools.map((tool) => (
                <Tooltip key={tool.id} text={tool.description}>
                  <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200/80 dark:border-slate-600/80">
                    <Image
                      src={tool.image}
                      alt={`${tool.title} technology icon`}
                      width={22}
                      height={22}
                      className="rounded-full mr-1 border"
                      loading="lazy"
                      quality={80}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      sizes="22px"
                    />
                    {tool.title}
                  </span>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t border-slate-200/80 dark:border-slate-700/80 px-6 py-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-b-2xl">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#0093E9] dark:text-cyan-400 hover:text-[#0066b3] dark:hover:text-cyan-300 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0093E9] focus-visible:ring-offset-2 rounded"
            aria-label={`View demo for ${title}`}
          >
            <FaExternalLinkAlt className="w-4 h-4" aria-hidden />
            Demo
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 rounded"
            aria-label={`View GitHub repo for ${title}`}
          >
            <FaGithub className="w-4 h-4" aria-hidden />
            GitHub
          </a>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
