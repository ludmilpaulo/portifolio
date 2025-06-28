"use client";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaExternalLinkAlt, FaGithub, FaClock, FaCheckCircle, FaHourglassHalf, FaClone } from "react-icons/fa";
import { motion } from "framer-motion";

// Mock status label/icon mapping for demo:
const STATUS_MAP: Record<number, { label: string; icon: JSX.Element; color: string }> = {
  1: { label: "Clone", icon: <FaClone />, color: "bg-yellow-100 text-yellow-700" },
  2: { label: "Live", icon: <FaCheckCircle />, color: "bg-green-100 text-green-700" },
  3: { label: "Upcoming", icon: <FaHourglassHalf />, color: "bg-blue-100 text-blue-700" },
  4: { label: "In Progress", icon: <FaClock />, color: "bg-purple-100 text-purple-700" },
};

const toolsFromParams = (searchParams: URLSearchParams): { id: number; title: string; image: string; description: string }[] => {
  // This is a mock. You should wire up your own way of passing tools or fetching project details by slug.
  // Here, expect tools as a JSON string param (for demo/dev):
  try {
    const t = searchParams.get("tools");
    if (t) return JSON.parse(t);
  } catch {}
  return [];
};

const ProjectDetails = () => {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);

  // Project params
  const title = searchParams.get("title") || "";
  const image = searchParams.get("image") || "";
  const description = searchParams.get("description") || "";
  const link = searchParams.get("link") || "";
  const github = searchParams.get("github") || "";
  const status = Number(searchParams.get("status") || 2); // Default to 2 (Live)
  const tools = useMemo(() => toolsFromParams(searchParams), [searchParams]);

  // Animated tilt for image (only on desktop)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 24; // -12deg..12deg
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 16; // -8deg..8deg
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  // Metadata section
  const statusMeta = STATUS_MAP[status] ?? STATUS_MAP[2];

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center min-h-screen pt-24 pb-12 px-4 md:px-10 bg-gradient-to-tr from-blue-50 via-cyan-50 to-blue-100">
      {/* IMAGE with Parallax Tilt */}
      <motion.div
        className="w-full md:w-5/12 flex-shrink-0 flex justify-center items-center select-none"
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{}}
      >
        <motion.div
          style={{
            rotateX: tilt.y,
            rotateY: -tilt.x,
            transition: "transform 0.25s cubic-bezier(0.25,1,0.5,1)",
          }}
          className="relative w-full h-80 md:h-[480px] shadow-2xl rounded-3xl overflow-hidden bg-white border border-blue-100"
        >
          <Image
            alt={title}
            src={image}
            fill
            className="object-cover rounded-3xl pointer-events-none"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </motion.div>
      </motion.div>

      {/* DETAILS */}
      <div className="w-full md:w-7/12 mt-10 md:mt-0 md:ml-10 bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl border border-blue-100">
        {/* Title + Status */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <p className="uppercase text-xs tracking-widest text-blue-400 mb-1">{title}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 drop-shadow-sm leading-tight">{title}</h1>
          </div>
          <span className={`ml-4 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${statusMeta.color}`}>
            {statusMeta.icon}
            {statusMeta.label}
          </span>
        </div>

        {/* Project Metadata */}
        <div className="flex flex-wrap gap-4 mt-6">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-200 hover:scale-105"
            >
              <FaExternalLinkAlt />
              Live Demo
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-200 hover:scale-105"
            >
              <FaGithub />
              GitHub
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {tools.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-blue-700 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 shadow hover:bg-yellow-100 cursor-pointer transition"
                  title={tool.description}
                >
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    width={28}
                    height={28}
                    className="rounded-full border border-gray-200 shadow mr-1"
                  />
                  <span className="font-semibold text-blue-700">{tool.title}</span>
                  {/* Tooltip */}
                  <span className="hidden group-hover:block absolute z-30 mt-10 p-2 text-xs bg-black text-white rounded">{tool.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAILS TOGGLE */}
        <button
          className="flex items-center mt-8 mb-3 group text-blue-600 hover:text-yellow-500 font-semibold focus:outline-none"
          aria-label="Show or hide project details"
          onClick={() => setShow((v) => !v)}
        >
          <span className="mr-2">Details</span>
          <FaChevronDown
            className={`transition-transform duration-300 ${show ? "rotate-180" : "rotate-0"} group-hover:text-yellow-500`}
            size={20}
          />
        </button>

        {/* Project Description */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            show ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="bg-blue-50/60 rounded-xl p-5 shadow-inner text-gray-700 leading-relaxed text-base prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
};

const SuspenseProjectDetails = () => (
  <Suspense fallback={
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-50">
      <div className="text-blue-700 text-xl font-semibold animate-pulse">Loading project details…</div>
    </div>
  }>
    <ProjectDetails />
  </Suspense>
);

export default SuspenseProjectDetails;
