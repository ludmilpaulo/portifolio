import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const ExperienceCard = ({ expData }: { expData: any }) => {
  const { logo, company, title, stack, the_year, description } = expData;

  return (
    <motion.article
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col rounded-lg items-center space-y-5 flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg snap-center bg-white bg-opacity-90 p-6 sm:p-8 md:p-10 hover:opacity-100 opacity-90 cursor-pointer transition-opacity duration-200 overflow-hidden shadow-xl transform hover:shadow-2xl hover:-translate-y-2"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="flex-shrink-0 w-full flex justify-center"
      >
        {logo ? (
          <Image
            src={logo}
            alt={`${company} logo`}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full object-cover object-center shadow-lg"
            width={192}
            height={192}
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-lg">
            No Logo
          </div>
        )}
      </motion.div>
      <div className="text-center px-4">
        <h4 className="text-xl sm:text-2xl font-light text-gray-900">{company}</h4>
        <p className="font-bold text-lg sm:text-xl mt-1 text-blue-600">{title}</p>
        <div className="flex justify-center flex-wrap space-x-3 my-3">
          {stack.length > 0 ? (
            stack.map((item: any) => (
              <div key={item.id} className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="rounded-full shadow-md"
                  width={40}
                  height={40}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No technologies listed</p>
          )}
        </div>
        <p className="uppercase py-1 text-gray-500 text-sm">{the_year}</p>
        <div className="overflow-y-auto max-h-32">
          <ul className="list-disc space-y-2 ml-4 text-sm sm:text-base text-gray-700">
            <li dangerouslySetInnerHTML={{ __html: description }} />
          </ul>
        </div>
      </div>
    </motion.article>
  );
};

export default ExperienceCard;
