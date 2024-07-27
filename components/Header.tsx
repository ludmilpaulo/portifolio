import { motion } from "framer-motion";
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";

type Props = {
  id: number;
  name_complete: string;
  avatar: string;
  mini_about: string;
  born_date: string;
  address: string;
  phone: string;
  email: string;
  cv: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

const Header = ({ headerData }: any) => {
  const [header] = useState(headerData);

  return (
    <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center bg-gradient-to-r from-[#0093E9] to-[#80D0C7] shadow-lg">
      <motion.div
        initial={{ x: -500, opacity: 0, scale: 0.5 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-row items-center space-x-4"
      >
        {header.map((head: Props) => (
          <React.Fragment key={head.id}>
            {head.facebook && (
              <SocialIcon
                url={head.facebook}
                fgColor="white"
                bgColor="transparent"
                className="hover:scale-110 transition-transform duration-300"
              />
            )}
            {head.linkedin && (
              <SocialIcon
                url={head.linkedin}
                fgColor="white"
                bgColor="transparent"
                className="hover:scale-110 transition-transform duration-300"
              />
            )}
            {head.twitter && (
              <SocialIcon
                url={head.twitter}
                fgColor="white"
                bgColor="transparent"
                className="hover:scale-110 transition-transform duration-300"
              />
            )}
            {head.github && (
              <SocialIcon
                url={head.github}
                fgColor="white"
                bgColor="transparent"
                className="hover:scale-110 transition-transform duration-300"
              />
            )}
            {head.instagram && (
              <SocialIcon
                url={head.instagram}
                fgColor="white"
                bgColor="transparent"
                className="hover:scale-110 transition-transform duration-300"
              />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      <motion.div
        initial={{ x: 500, opacity: 0, scale: 0.5 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-row items-center text-white cursor-pointer space-x-2"
      >
        <SocialIcon
          className="cursor-pointer email-icon"
          network="email"
          fgColor="white"
          bgColor="transparent"
         // className="hover:text-[#f0e68c] transition-colors duration-300"
        />
        <p className="uppercase md:inline-flex text-sm text-white ml-2 hover:text-[#f0e68c] transition-colors duration-300">
          Get in touch
        </p>
      </motion.div>
    </header>
  );
};

export default Header;
