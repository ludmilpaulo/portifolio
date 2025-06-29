import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { Experience, Competence } from "@/hooks/types";
import { FaBuilding } from "react-icons/fa";

const StackTooltip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span
      className="relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -top-8 z-30 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-xl whitespace-nowrap
                        transform -translate-x-1/2 border border-blue-300 animate-fade-in"
        >
          {title}
        </span>
      )}
    </span>
  );
};

interface ExperienceCardProps {
  expData: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ expData }) => {
  const { logo, company, title, stack, the_year, description } = expData;

  return (
    <motion.article
      className="flex flex-col rounded-3xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-blue-100
                 items-center space-y-5 flex-shrink-0 w-[320px] sm:w-[375px] md:w-[390px] snap-center
                 p-8 hover:shadow-blue-400/40 transition-all duration-300 group"
      tabIndex={0}
    >
      {/* Logo */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-200 shadow-md bg-white flex items-center justify-center"
      >
        {logo ? (
          <Image
            src={logo}
            alt={`${company} logo`}
            width={144}
            height={144}
            className="rounded-full object-cover"
          />
        ) : (
          <FaBuilding className="text-blue-300 text-5xl" />
        )}
      </motion.div>
      {/* Info */}
      <div className="text-center px-2">
        <h4 className="text-2xl font-bold text-blue-800 dark:text-cyan-200 mb-1">{company}</h4>
        <p className="font-semibold text-lg text-cyan-600 dark:text-cyan-300">{title}</p>
        <div className="flex justify-center flex-wrap gap-2 my-3">
          {stack.length > 0 ? (
            stack.map((item: Competence) => (
              <StackTooltip key={item.id} title={item.title}>
                <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="rounded-full border border-cyan-300 shadow group-hover:scale-110 transition"
                  />
                </div>
              </StackTooltip>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No technologies listed</p>
          )}
        </div>
        <p className="uppercase py-1 text-gray-500 text-xs">{the_year}</p>
        <div className="overflow-y-auto max-h-32 mt-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 pr-1">
          <div className="text-gray-800 dark:text-cyan-100 text-sm leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </motion.article>
  );
};

export default ExperienceCard;
