"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info, Competence } from "@/hooks/types";
import { useTheme } from "next-themes";
import { AiOutlineDownload, AiOutlineWhatsApp, AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { MdEmail, MdPhone, MdLocationOn, MdLightMode, MdDarkMode } from "react-icons/md";
import { FaFacebookSquare, FaTwitter } from "react-icons/fa";

// ------ Sample testimonials (you can fetch from API) ------
const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "/testimonials/sarah.jpg",
    text: "Ludmil's attention to detail and passion for tech are unmatched. He delivered our project ahead of schedule, exceeding all expectations!",
    role: "Product Manager, FinTech Co",
  },
  {
    name: "Michael Osei",
    avatar: "/testimonials/michael.jpg",
    text: "Absolutely world-class developer. Great communication and always finds creative solutions to tough problems.",
    role: "CTO, African Markets",
  },
  {
    name: "Zanele M.",
    avatar: "/testimonials/zanele.jpg",
    text: "We loved working with Ludmil! Fast, professional, and truly cares about your vision. Highly recommend.",
    role: "CEO, Zani Digital",
  },
];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      className="fixed z-50 top-7 right-7 md:top-9 md:right-12 bg-white dark:bg-gray-800 border border-blue-200 dark:border-cyan-700 rounded-full p-3 shadow-lg transition hover:scale-110"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <MdLightMode className="text-yellow-400" size={23} />
      ) : (
        <MdDarkMode className="text-blue-900" size={23} />
      )}
    </button>
  );
}

// ---- Animated Skills Cloud ----
const SKILL_CLOUD_RADIUS = 110; // px radius
function SkillsCloud({ skills }: { skills: Competence[] }) {
  // Only show up to 10 skills in the cloud for clarity
  const visibleSkills = skills.slice(0, 10);

  return (
    <div className="relative flex justify-center items-center w-[290px] h-[290px] mx-auto mt-5 mb-14 select-none">
      {/* Center avatar */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-xl border-4 border-blue-200 dark:border-cyan-400 rounded-full">
        <Image
          src="/avatar-cloud.png" // Fallback avatar, swap for aboutMe.avatar if you want
          alt="Avatar"
          width={105}
          height={105}
          className="rounded-full object-cover"
        />
      </div>
      {/* Orbiting skills */}
      {visibleSkills.map((skill, i) => {
        const angle = (2 * Math.PI * i) / visibleSkills.length;
        const x = Math.cos(angle) * SKILL_CLOUD_RADIUS;
        const y = Math.sin(angle) * SKILL_CLOUD_RADIUS;
        return (
          <motion.div
            key={skill.id}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            whileHover={{ scale: 1.25, zIndex: 30 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.07 * i }}
            className="absolute w-16 h-16 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/90 border border-blue-100 dark:border-cyan-700 rounded-full shadow-lg text-xs group"
          >
            <Image src={skill.image} alt={skill.title} width={36} height={36} className="rounded-full mb-1" />
            <span className="text-gray-700 dark:text-cyan-100 font-semibold">{skill.title}</span>
          </motion.div>
        );
      })}
      {/* Subtle orbiting glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-blue-400/10 to-cyan-200/10 blur-2xl z-0" />
    </div>
  );
}

// ---- Testimonials Carousel ----
function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  return (
    <section className="relative py-12 px-2 sm:px-8">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10 text-blue-800 dark:text-cyan-200">
        Testimonials
      </h2>
      <div className="flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={testimonials[idx].name}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-full mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 text-center flex flex-col items-center border border-blue-100 dark:border-cyan-800"
          >
            <Image
              src={testimonials[idx].avatar}
              alt={testimonials[idx].name}
              width={72}
              height={72}
              className="rounded-full border-2 border-blue-300 mb-4 shadow"
            />
            <blockquote className="text-lg text-gray-800 dark:text-cyan-100 italic mb-3">
              “{testimonials[idx].text}”
            </blockquote>
            <span className="text-blue-700 dark:text-cyan-200 font-bold">{testimonials[idx].name}</span>
            <span className="text-gray-400 dark:text-cyan-400 text-sm">{testimonials[idx].role}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`w-3 h-3 rounded-full ${i === idx ? "bg-blue-500 dark:bg-cyan-300" : "bg-blue-200 dark:bg-cyan-800"} transition`}
          />
        ))}
      </div>
    </section>
  );
}

// ---- Main About Page ----
const About = () => {
  const [aboutMe, setAboutMe] = useState<Info | null>(null);
  const [skills, setSkills] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);

  // Example stats, you may want to fetch/compute these:
  const yearsExp = 7;
  const projects = 28;
  const countries = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyInfo();
        setAboutMe(data.info[0]);
        setSkills(data.competences || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gradient-to-tr from-blue-900/80 to-cyan-600/70">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin"></div>
          <span className="text-white font-semibold text-lg">Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!aboutMe) {
    return <div className="text-center text-red-500 mt-32">Error loading data. Please try again later.</div>;
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-200 min-h-screen py-20 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 transition-colors duration-500 overflow-hidden">
      <ThemeToggle />
      {/* Floating background orbs */}
      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute -top-20 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-300/30 via-blue-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-300/30 via-cyan-200/30 to-transparent rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-12 space-y-14"
      >
        {/* Profile + Mini Bio */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900 flex flex-col md:flex-row gap-8 p-8 sm:p-12"
        >
          <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center z-10">
            <div className="relative">
              <Image
                src={aboutMe.avatar}
                alt="Profile picture"
                className="rounded-full object-cover shadow-2xl border-4 border-blue-200 dark:border-cyan-300"
                width={220}
                height={220}
                priority
              />
              {/* Animated online indicator */}
              <span className="absolute bottom-4 right-4 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-tr from-green-400 to-cyan-400 animate-pulse shadow"></span>
            </div>
            <div className="mt-5 text-xl font-bold text-blue-700 dark:text-cyan-300">{aboutMe.name_complete}</div>
            <div className="flex items-center text-gray-500 dark:text-cyan-400 mt-1">
              <MdLocationOn className="mr-2" />
              <span>{aboutMe.address}</span>
            </div>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              {aboutMe.linkedin && (
                <a href={aboutMe.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 dark:bg-cyan-900 hover:bg-blue-100 hover:scale-110 transition shadow text-blue-700 dark:text-cyan-300"
                  aria-label="LinkedIn"
                >
                  <AiFillLinkedin size={24} />
                </a>
              )}
              {aboutMe.github && (
                <a href={aboutMe.github} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 dark:bg-cyan-900 hover:bg-blue-100 hover:scale-110 transition shadow text-blue-700 dark:text-cyan-300"
                  aria-label="GitHub"
                >
                  <AiFillGithub size={24} />
                </a>
              )}
              {aboutMe.facebook && (
                <a href={aboutMe.facebook} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 dark:bg-cyan-900 hover:bg-blue-100 hover:scale-110 transition shadow text-blue-700 dark:text-cyan-300"
                  aria-label="Facebook"
                >
                  <FaFacebookSquare size={22} />
                </a>
              )}
              {aboutMe.twitter && (
                <a href={aboutMe.twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-50 dark:bg-cyan-900 hover:bg-blue-100 hover:scale-110 transition shadow text-blue-700 dark:text-cyan-300"
                  aria-label="Twitter"
                >
                  <FaTwitter size={22} />
                </a>
              )}
            </div>
            {/* Animated divider */}
            <div className="w-16 h-1 mt-7 mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-300 rounded-full blur-[2px] animate-pulse" />
            {/* Stats row */}
            <div className="flex gap-6 justify-center text-center">
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-cyan-200">{yearsExp}+</div>
                <div className="text-xs text-gray-500 dark:text-cyan-400">Years Exp</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-cyan-200">{projects}+</div>
                <div className="text-xs text-gray-500 dark:text-cyan-400">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-cyan-200">{countries}</div>
                <div className="text-xs text-gray-500 dark:text-cyan-400">Countries</div>
              </div>
            </div>
          </div>
          {/* About/Bio */}
          <div className="flex flex-col justify-center space-y-6 md:w-2/3 z-10">
            <h4 className="text-4xl font-extrabold text-gray-900 dark:text-cyan-200 mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">About Me</span>
            </h4>
            <p className="text-lg text-gray-700 dark:text-cyan-100" dangerouslySetInnerHTML={{ __html: aboutMe.mini_about }} />
            <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutMe.about }} />
          </div>
        </motion.div>

        {/* Skills Cloud */}
        <section className="w-full flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-cyan-200 mb-3 mt-8">
            Tech Stack & Skills Cloud
          </h3>
          <SkillsCloud skills={skills} />
        </section>

        {/* Contact and Download */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900 p-8 flex flex-col items-center"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-lg">
            <div className="flex items-center gap-3 text-blue-800 dark:text-cyan-300">
              <MdPhone className="text-2xl" />
              <span>{aboutMe.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MdEmail className="text-2xl text-red-500" />
              <a href={`mailto:${aboutMe.email}`} className="text-blue-600 dark:text-cyan-300 hover:underline transition">{aboutMe.email}</a>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <a
              href={`https://wa.me/${aboutMe.phone}`}
              className="flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-500 hover:scale-105 transition font-semibold text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineWhatsApp className="text-2xl" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={aboutMe.cv}
              className="flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-500 hover:scale-105 transition font-semibold text-lg"
              download
            >
              <AiOutlineDownload className="text-2xl" />
              <span>Download My CV</span>
            </a>
          </div>
        </motion.div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-cyan-200 mb-4">
            Ready to collaborate or start your project?
          </h3>
          <a
            href={`mailto:${aboutMe.email}`}
            className="inline-block px-7 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-500 hover:scale-105 transition font-bold text-lg"
          >
            Contact Me Today
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
