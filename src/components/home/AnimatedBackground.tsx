import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-obsidian">
      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />
      
      {/* Moving Dots */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-spectre-pink) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating Light Gaps */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.02, 0.05, 0.02],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-1/4 w-[80vw] h-[80vh] bg-primary/20 rounded-full blur-[160px]"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.01, 0.03, 0.01],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vh] bg-white/10 rounded-full blur-[140px]"
      />

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-[0.03]" />
    </div>
  );
}
