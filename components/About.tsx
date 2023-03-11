import React, { useState } from "react";
import { motion } from "framer-motion";

type Props = {

  id: 1,
  name_complete: string,
  avatar: string,
  mini_about: string,
  about: string;
  born_date: string,
  address: string,
  phone: string,
  email: string,
  cv: string,
  github: string,
  linkedin: string,
  facebook: string,
  twitter: string,
  instagram: string,


};


const About = ({aboutData}: any) => {
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
      className="flex flex-col relative h-screen tezt-center md:text-left
    md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      {aboutMe.map((_about: any) =>(
      <><h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
          About
        </h3><motion.img
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
          className="-mb-20 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover md:rounded-lg md:w-64 md:h-95 xl:w-[500px] xl:h-[600px]"
        ></motion.img><div className="space-y-10 px-0 md:px-10">
            <h4 className="text-4xl font-semibold">
              here is a <span>little</span> background
            </h4>
            <p className="text-base">
              {_about.mini_about}

             
            </p>
            <p className="text-base">
            {_about.about}
            </p>
          </div></>
      ))}
    </motion.div>
  );
};

export default About;
