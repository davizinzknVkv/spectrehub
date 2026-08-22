import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
  width = "auto",
  direction = "up"
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  width?: "auto" | "100%";
  direction?: "up" | "down" | "left" | "right";
}) {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0
    }
  };

  if (shouldReduceMotion) {
    return <div className={className} style={{ width }}>{children}</div>;
  }

  return (
    <div className={className} style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration: 0.8, 
          delay: delay / 1000,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

