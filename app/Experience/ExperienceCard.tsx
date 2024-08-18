import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const ExperienceCard = ({ expData }: { expData: any }) => {
  const { logo, company, title, stack, the_year, description } = expData;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-full max-w-xl snap-center bg-white bg-opacity-90 p-10 hover:opacity-100 opacity-90 cursor-pointer transition-opacity duration-200 overflow-hidden shadow-xl transform hover:shadow-2xl"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="flex-shrink-0 w-full flex justify-center"
      >
        {logo ? (
          <Image
            src={logo}
            alt={`${company} logo`}
            className="w-32 h-32 rounded-full xl:w-48 xl:h-48 object-cover object-center shadow-lg"
            width={192}
            height={192}
          />
        ) : (
          <div className="w-32 h-32 xl:w-48 xl:h-48 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-lg">
            No Logo
          </div>
        )}
      </motion.div>
      <div className="px-0 md:px-10 text-center">
        <h4 className="text-3xl font-light text-gray-800">{company}</h4>
        <p className="font-bold text-xl mt-1 text-blue-600">{title}</p>
        <div className="flex justify-center space-x-2 my-2">
          {stack.length > 0 ? (
            stack.map((item: any) => (
              <div key={item.id} className="relative h-10 w-10">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No technologies listed</p>
          )}
        </div>
        <p className="uppercase py-2 text-gray-600">{the_year}</p>
        <div className="overflow-y-auto max-h-40">
          <ul className="list-disc space-y-4 ml-5 text-base text-gray-700">
            <li dangerouslySetInnerHTML={{ __html: description }} />
          </ul>
        </div>
      </div>
    </motion.article>
  );
};

export default ExperienceCard;