import React from "react";
import { motion } from "framer-motion";

type Props = {};

const About = (props: Props) => {
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
      className="flex flex-col relative h-screen tezt-center md:text-left
    md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        About
      </h3>

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
        src="https://avatars.githubusercontent.com/u/53780546?s=400&u=a7f5a200c778b78d7214e8fbacd5ce29c08213d3&v=4"
        className="-mb-20 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-64 md:h-95 xl:w-[500px] xl:h-[600px]"
      ></motion.img>

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          here is a <span>little</span> background
        </h4>
        <p className="text-base">
          Technology and software are in my DNA My Approach is collaborative.
          The best solutions are delivered with a successful collaboration
          between myself and you. Embracing an Agile approach, l build
          applications iteratively and incrementally to incorporate feedback and
          welcome changing requirements. While following a strategy, l
          constantly inspect and adapt to develop the best possible solution and
          meet the overall objectives.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
