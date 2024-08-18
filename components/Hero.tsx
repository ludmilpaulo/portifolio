"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";
import Link from "next/link";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";

type Props = {};

const Hero: React.FC<Props> = () => {
  const [heroSlide, setHeroSlide] = useState<Info | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setHeroSlide(data.info[0]); // Assuming you want the first info object
        console.log("header data", data);
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      }
    };

    fetchData();
  }, []);

  const [text] = useTypewriter({
    words: [
      "My Name is Ludmil Paulo",
      "I'm a Senior Software Engineer",
      "Full Stack Developer",
      "Coding Enthusiast",
      "Tech Innovator",
      "Problem Solver",
      "Continuous Learner"
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
      <BackgroundCircles />
      {heroSlide && (
        <Image
          className="relative rounded-full h-32 w-32 mx-auto object-cover shadow-lg"
          src={heroSlide.avatar}
          alt="Profile Picture"
          width={128}
          height={128}
        />
      )}
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 pb-2 tracking-[15px]">
          Software Engineer
        </h2>
        <h1 className="text-5xl lg:text-6xl font-semibold px-10">
          <span className="mr-3">{text}</span>
          <Cursor cursorColor="#F7AB0A" />
        </h1>
       
      </div>
    </div>
  );
}

export default Hero;
