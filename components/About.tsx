import React, { useState } from "react";
import { motion } from "framer-motion";

const About = ({ aboutData }: any) => {
  const [aboutMe] = useState(aboutData);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 1.2,
      }}
      whileInView={{
        opacity: 1,
      }}
      className="flex flex-col items-center md:flex-row max-w-7xl px-6 md:px-10 justify-evenly mx-auto"
    >
      {aboutMe.map((_about: any) => (
        <div key={_about.id} className="flex flex-col md:flex-row items-center">
          <motion.img
            initial={{
              x: -200,
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            src={_about.avatar}
            className="w-32 h-auto rounded-full object-cover md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mr-6 shadow-lg"
            alt="Avatar"
          />
          <div className="space-y-6 md:space-y-8">
            <h4 className="text-4xl font-semibold">
              Here is a <span className="underline decoration-yellow-500">little</span> background
            </h4>
            <p className="text-base text-gray-300" dangerouslySetInnerHTML={{ __html: _about.mini_about }} />
            <p className="text-base text-gray-300" dangerouslySetInnerHTML={{ __html: _about.about }} />
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default About;
