import { motion } from 'framer-motion';
import Link from 'next/link';
import router from 'next/router';
import { title } from 'process';
import React, { useState } from 'react'
import { SocialIcon } from 'react-social-icons';

interface Tools {
  id: number;
  title:string | null;
  percentage?: string | null;
  description?: string | null;
  image?: string | null;
}
const ProjectDetais = () => {
    const { demo, image_url, name, description, github, tools} = router.query;

   

    let projectName : any = name ?? "";
    let projectImage : any = image_url ?? "";
    let projectDemo : any = demo ?? "";
    let projectDescription :any = description ?? "";
    let projectGitHub : any = github ?? "";

    let a: any  = tools;

    const b = a ? JSON.parse(a) : null 

    const [projectTools]  = useState(b);
    //const [projectTools] : any = tools ?? "";

    console.log("tools array",JSON.stringify(projectTools))


  return (
 
    <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.5 }}
    viewport={{ once: true }}
    className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-50"
  >
    <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
      Projects
    </h3>

    <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20">
    
          <div
       
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen"
          >
            <motion.img
              initial={{
                y: -300,
                opacity: 0,
              }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src={projectImage}
              alt=""
            />

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
              <h4 className="text-4xl font-semibold text-center">
                <span className="underline decoration-[#F7AB0A]/50">
                  {projectName}
                </span>{" "}
            
              </h4>
              <div className="space-x-6">
              <SocialIcon
             // network="browser"
               url={projectDemo} />
              <SocialIcon url={projectGitHub} />
              </div>
              <p className="text-lg text-center md:text-left">
              {projectDescription?.replace('<p>', '').replace('</p>','').replace('<br />','').replace('<br />','').replace('&nbsp','')}
              </p>
            </div>
            
            
       
         
            {projectTools.map((pro:any) =>
            (
                <p className="mb-0"> {pro.title}</p>
            )
            )}
        
    
            
            <button className="heroButton">Read More </button>
          
          </div>
      
    </div>

    <div className="w-full absolute top-[30%] bg-[#F7AB0A]/10 left-0 h-[500px] -skew-y-12" />
  </motion.div>


  )
}

export default ProjectDetais