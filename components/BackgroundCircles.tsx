"use client";
import React from "react";

const BackgroundCircles = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute rounded-full border border-white opacity-10 animate-pulse h-56 w-56 md:h-72 md:w-72" />
    <div className="absolute rounded-full border border-white opacity-20 animate-ping h-80 w-80 md:h-96 md:w-96" />
    <div className="absolute rounded-full border border-white opacity-10 h-[500px] w-[500px]" />
  </div>
);

export default BackgroundCircles;