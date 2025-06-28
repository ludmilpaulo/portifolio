"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import { useEffect, useState } from "react";
import { fetchMyInfo } from "@/hooks/fetchData";
import { Info } from "@/hooks/types";
import { FaBars, FaTimes, FaInfoCircle, FaBriefcase, FaTools, FaProjectDiagram, FaGraduationCap } from "react-icons/fa";

const socialPlatforms = ["linkedin", "github", "twitter", "instagram", "facebook"] as const;
type SocialPlatform = typeof socialPlatforms[number];

const Header = () => {
  const [header, setHeader] = useState<Info | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMyInfo();
      setHeader(data.info[0]);
    };
    fetchData();
  }, []);

  const links: { href: string; icon: React.ElementType; label: string }[] = [
    { href: "/About", icon: FaInfoCircle, label: "About" },
    { href: "/Experience", icon: FaBriefcase, label: "Experience" },
    { href: "/Skills", icon: FaTools, label: "Skills" },
    { href: "/Projects", icon: FaProjectDiagram, label: "Projects" },
    { href: "/Education", icon: FaGraduationCap, label: "Education" },
  ];

  return (
    <header className="sticky top-0 z-50 p-4 bg-white shadow-lg flex justify-between items-center">
      <motion.div className="flex space-x-3">
        {header &&
          socialPlatforms.map(
            (platform: SocialPlatform) =>
              header[platform] && (
                <SocialIcon
                  key={platform}
                  url={header[platform]}
                  fgColor="#ffffff"
                  bgColor="#0073b1"
                  className="transform hover:scale-110 transition duration-300"
                />
              )
          )}
      </motion.div>
      <nav className="hidden md:flex space-x-6 text-gray-600">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="hover:text-blue-500 transition flex items-center gap-1">
            <Icon /> {label}
          </Link>
        ))}
      </nav>
      <button
        className="md:hidden text-gray-600"
        onClick={() => setDrawerOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {drawerOpen ? <FaTimes /> : <FaBars />}
      </button>
      {drawerOpen && (
        <div className="fixed top-0 left-0 bg-white h-full w-64 p-6 shadow-lg space-y-4">
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2"
              onClick={() => setDrawerOpen(false)}
            >
              <Icon /> {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;