import { motion } from "framer-motion";
import React from "react";
import { useState } from "react";
import Image from "next/image";

const ExperienceCard = ({ expData }: { expData: any }) => {
  const [myExp] = useState(expData);

  console.log("staks and task", myExp);

  return (
    <>
      {myExp.map((e: any) => (
        <article key={e.id} className="flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-full max-w-xl snap-center bg-[#292929] p-1 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-hidden">
          <div>
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
              src={e.logo}
              alt=""
            />
            <div className="px-0 md:px-10">
              <h4 className="text-4xl font-light">{e.company}</h4>
              <p className="font-bold text-2xl mt-1">{e.title}</p>

              <div className="flex space-x-2 my-2">
                {e.stack.map((_i: any) => (
                  <Image
                    key={_i.id}
                    src={_i?.image}
                    alt=""
                    className="h-10 w-10 rounded-full"
                    width={40}
                    height={40}
                  />
                ))}
              </div>


              <p className="uppercase py-5 text-gray-300">{e.the_year}</p>

              <ul className="list-disc space-y-4 ml-5 text-lg">
                <li dangerouslySetInnerHTML={{ __html: e.description }} />
              </ul>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default ExperienceCard;
