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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 md:bg-white/90 md:dark:bg-gray-950/90 md:backdrop-blur-xl border-b border-blue-100/50 dark:border-cyan-900/50 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-5 py-2 md:py-3">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl"
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
            <span className="font-extrabold text-lg md:text-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
              {info?.name_complete || "Ludmil Paulo"}
            </span>
            <span className="block text-xs md:text-sm text-cyan-500 font-semibold tracking-wide -mt-1">
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
        <nav className="hidden md:flex gap-3 ml-auto">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="relative flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-600 dark:text-cyan-200 font-semibold hover:text-blue-600 dark:hover:text-cyan-300 transition group">
              <Icon className="text-blue-400 group-hover:text-blue-600 dark:text-cyan-400" />
              <span className="relative">
                {label}
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 rounded bg-gradient-to-r from-blue-400 to-cyan-400"
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
          className="md:hidden p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:text-cyan-400 transition shadow"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-label="Open mobile menu"
        >
          {drawerOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 w-72 max-w-[90vw] h-full p-8 pt-14 flex flex-col gap-8 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:text-cyan-400"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes size={22} />
              </button>
              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-2 mt-2">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-blue-300"
                />
                <span className="font-bold text-base text-blue-800 dark:text-cyan-200">{info?.name_complete}</span>
              </div>
              <div className="flex gap-2 justify-center mt-1">
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
              <nav className="flex flex-col gap-4">
                {navLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-blue-800 dark:text-cyan-100 hover:bg-blue-50 dark:hover:bg-cyan-900 font-semibold text-lg transition"
                  >
                    <Icon className="text-blue-400 dark:text-cyan-400" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
