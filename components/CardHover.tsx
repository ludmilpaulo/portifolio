"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardHoverProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  glowColor?: string;
}

const CardHover = ({ 
  children, 
  className = "", 
  hoverScale = 1.05, 
  hoverRotate = 2,
  glowColor = "rgba(0, 147, 233, 0.3)"
}: CardHoverProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ 
        scale: hoverScale, 
        rotateY: hoverRotate,
        z: 50
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        whileHover={{ 
          opacity: 1,
          boxShadow: `0 20px 40px ${glowColor}`,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default CardHover;
