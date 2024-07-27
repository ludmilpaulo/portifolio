import React, { useState } from "react";
import Image from "next/image";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";
import Link from "next/link";

type Props = {};

function Hero({ heroData }: any) {
  const [heroSlide] = useState(heroData);

  const [text] = useTypewriter({
    words: ["Hi, My Name is Ludmil Paulo", "Senior Software Engineer", "Full Stack Developer"],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden bg-gradient-to-r from-[#0093E9] to-[#80D0C7]">
      <BackgroundCircles />
      {heroSlide.map((_hero: any) => (
        <Image
          key={_hero.id}
          className="relative rounded-full h-32 w-32 mx-auto object-cover shadow-lg"
          src={_hero.avatar}
          alt="Profile Picture"
          width={128}
          height={128}
        />
      ))}

      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 pb-2 tracking-[15px]">
          Software Engineer
        </h2>
        <h1 className="text-5xl lg:text-6xl font-semibold px-10">
          <span className="mr-3">{text}</span>
          <Cursor cursorColor="#F7AB0A" />
        </h1>
        <div className="pt-5 space-x-4">
          <Link href="#about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="#experience">
            <button className="heroButton">Experience</button>
          </Link>
          <Link href="#skills">
            <button className="heroButton">Skills</button>
          </Link>
          <Link href="#projects">
            <button className="heroButton">Projects</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
