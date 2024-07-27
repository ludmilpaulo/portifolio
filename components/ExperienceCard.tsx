import { motion } from "framer-motion";
import React from "react";
import { useState } from "react";
import Image from "next/image";

const ExperienceCard = ({ expData }: { expData: any }) => {
  const [myExp] = useState(expData);

  return (
    <>
      <article className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-full max-w-xl snap-center bg-[#292929] p-10 hover:opacity-100 opacity-80 cursor-pointer transition-opacity duration-200 overflow-hidden">
        <motion.img
          initial={{
            y: -100,
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="w-32 h-32 rounded-full xl:w-48 xl:h-48 object-cover object-center"
          src={myExp.logo}
          alt=""
        />
        <div className="px-0 md:px-10">
          <h4 className="text-4xl font-light">{myExp.company}</h4>
          <p className="font-bold text-2xl mt-1">{myExp.title}</p>
          <div className="flex space-x-2 my-2">
            {myExp.stack.map((_i: any) => (
              <Image
                key={_i.id}
                src={_i.image}
                alt=""
                className="h-10 w-10 rounded-full"
                width={40}
                height={40}
              />
            ))}
          </div>
          <p className="uppercase py-5 text-gray-300">{myExp.the_year}</p>
          <ul className="list-disc space-y-4 ml-5 text-lg">
            <li dangerouslySetInnerHTML={{ __html: myExp.description }} />
          </ul>
        </div>
      </article>
    </>
  );
};

export default ExperienceCard;
