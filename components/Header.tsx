import { motion } from "framer-motion";
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";

type Props = {

    id: 1,
    name_complete: string,
    avatar: string,
    mini_about: string,
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

const Header = ({headerData}: Props) => {

  const [header, setHeader ] = useState(headerData);

  console.log("data cabecario", header)
  return (
    <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
        }}
        className="flex flex-row items-center"
      >
        {header.map((head: {
          linkedin: string | undefined;
          twitter: string | undefined;
          github: string | undefined;
          instagram: string | undefined; facebook: string | undefined; 
})=>(


        <><SocialIcon url={head.facebook} />
        <SocialIcon url={head.linkedin} />
        <SocialIcon url={head.twitter} />
        <SocialIcon url={head.github} />
        <SocialIcon url={head.instagram} />
        </>
        )
        )}
      </motion.div>

      <motion.div
        initial={{
          x: 500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
        }}
        className="flex flex-row items-center text-gray-300 cursor-pointer"
      >
        <SocialIcon
          className="cursor-pointer"
          network="email"
          fgColor="gray"
          bgColor="transparent"
        />
        <p className="uppercase md:inline-flex text-sm text-gray-400">
          {" "}
          Get in touch
        </p>
      </motion.div>
    </header>
  );
};

export default Header;
