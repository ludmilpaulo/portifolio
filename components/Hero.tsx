"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";
import { motion } from "framer-motion";

const Hero = () => {
  const [heroSlide, setHeroSlide] = useState<Info | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMyInfo();
      setHeroSlide(data.info[0]);
    };

    fetchData();
  }, []);

  const [text] = useTypewriter({
    words: [
      "Hi, I'm Ludmil Paulo",
      "Senior Software Engineer",
      "Full Stack Developer",
      "Coding Enthusiast",
      "Tech Innovator",
      "Problem Solver",
      "Continuous Learner",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-white overflow-hidden">
      <BackgroundCircles />
      {heroSlide && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="rounded-full shadow-xl overflow-hidden border-4 border-white"
        >
          <Image
            src={heroSlide.avatar}
            alt="Profile"
            width={150}
            height={150}
            className="object-cover"
          />
        </motion.div>
      )}
      <h2 className="uppercase tracking-widest text-sm mt-4 opacity-80">
        Software Engineer
      </h2>
      <h1 className="mt-2 text-4xl md:text-6xl font-bold">
        <span>{text}</span>
        <Cursor cursorColor="#FFD700" />
      </h1>
    </section>
  );
};

export default Hero;
