"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { useState } from "react";
import {
  FaBars, FaTimes, FaInfoCircle, FaBriefcase, FaTools,
  FaProjectDiagram, FaGraduationCap
} from "react-icons/fa";

const socialPlatforms = [
  { platform: "linkedin", color: "#0077b5" },
  { platform: "github", color: "#24292f" },
  { platform: "twitter", color: "#1da1f2" },
  { platform: "instagram", color: "#e1306c" },
  { platform: "facebook", color: "#1877f3" },
] as const;
type SocialPlatform = (typeof socialPlatforms)[number]["platform"];

const navLinks = [
  { href: "/About", icon: FaInfoCircle, label: "About" },
  { href: "/Experience", icon: FaBriefcase, label: "Experience" },
  { href: "/Skills", icon: FaTools, label: "Skills" },
  { href: "/Projects", icon: FaProjectDiagram, label: "Projects" },
  { href: "/Education", icon: FaGraduationCap, label: "Education" },
];

const logoVariants = {
  initial: { scale: 1, boxShadow: "0 0 0px #00e9c6" },
  hover: { scale: 1.05, boxShadow: "0 0 24px #00e9c666" },
};

const Header = () => {
  const { data: myInfo, isLoading } = useGetMyInfoQuery();
  const info = myInfo?.info?.[0];
  const [drawerOpen, setDrawerOpen] = useState(false);

  // You can replace this with your brand logo from info if you want.
  const logoUrl = info?.avatar || "/avatar/lud.jpeg";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0093E9] focus-visible:ring-offset-2 rounded-lg">
          <motion.div
            className="rounded-full overflow-hidden ring-2 ring-slate-200/80 dark:ring-cyan-900/50 shadow-md"
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <Image
              src={logoUrl}
              alt="Ludmil Paulo - Portfolio Logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </motion.div>
          <div>
            <span className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 [font-family:var(--font-heading),sans-serif] tracking-tight">
              {info?.name_complete || "Ludmil Paulo"}
            </span>
            <span className="block text-xs text-slate-500 dark:text-cyan-400/90 font-medium tracking-wide -mt-0.5">
              Portfolio
            </span>
          </div>
        </Link>

        {/* Social Icons */}
        <motion.div className="hidden md:flex gap-1 ml-6">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-blue-100 animate-pulse" />
              ))
            : info &&
              socialPlatforms.map(
                ({ platform, color }) =>
                  info[platform] && (
                    <motion.div
                      key={platform}
                      whileHover={{ scale: 1.18, boxShadow: `0 0 8px ${color}` }}
                      className="transition"
                    >
                      <SocialIcon
                        url={info[platform]}
                        fgColor="#fff"
                        bgColor={color}
                        style={{ height: 32, width: 32 }}
                        className="shadow-md"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    </motion.div>
                  )
              )}
        </motion.div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto" role="navigation" aria-label="Main">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:text-[#0093E9] dark:hover:text-cyan-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0093E9] focus-visible:ring-offset-2"
            >
              <Icon className="w-4 h-4 text-[#0093E9]/80 dark:text-cyan-400/80" aria-hidden />
              <span className="relative">
                {label}
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#0093E9] to-[#80D0C7]"
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  style={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-cyan-400 transition-colors shadow-sm"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-slate-900 w-72 max-w-[85vw] h-full p-6 pt-14 flex flex-col gap-6 shadow-xl relative border-r border-slate-200/80 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-cyan-400 transition-colors"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex flex-col items-center gap-2 mt-2">
                <Image
                  src={logoUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-slate-200 dark:ring-cyan-800"
                />
                <span className="font-bold text-base text-slate-800 dark:text-slate-100 [font-family:var(--font-heading),sans-serif]">{info?.name_complete}</span>
              </div>
              <div className="flex gap-2 justify-center">
                {info &&
                  socialPlatforms.map(
                    ({ platform, color }) =>
                      info[platform] && (
                        <SocialIcon
                          key={platform}
                          url={info[platform]}
                          fgColor="#fff"
                          bgColor={color}
                          style={{ height: 28, width: 28 }}
                        />
                      )
                  )}
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#0093E9] dark:text-cyan-400" aria-hidden />
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
