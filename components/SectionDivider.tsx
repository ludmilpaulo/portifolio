"use client";
import { motion } from "framer-motion";

interface SectionDividerProps {
  className?: string;
  color?: string;
  thickness?: number;
  animated?: boolean;
}

const SectionDivider = ({ 
  className = "", 
  color = "rgba(255, 255, 255, 0.3)",
  thickness = 1,
  animated = true
}: SectionDividerProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className="w-full"
        style={{ 
          height: `${thickness}px`,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        }}
      />
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ height: `${thickness}px` }}
        />
      )}
    </div>
  );
};

export default SectionDivider;
