import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
  liveMembers?: { id: string; name: string; avatar: string | null }[];
}

export function Hero({ guildInvite, fallbackMembers, liveMembers = [] }: HeroProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 md:px-8 bg-transparent">
      <motion.div 
        style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
        className="relative z-10 w-full max-w-7xl mx-auto text-center"
      >
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.4em] text-primary uppercase font-black">
              {t('hero.badge')}
            </span>
          </div>
        </Reveal>

        <div className="relative mb-10">
          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] text-white uppercase tracking-tighter break-words relative z-10 flex flex-col items-center"
          >
            <div className="flex items-center gap-[0.1em] justify-center flex-wrap">
              <span className="inline-block">{t('hero.title1')}</span>
              <span className="inline-block ml-[0.2em]">{t('hero.title2')}</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col md:flex-row items-center justify-center mt-2"
            >
              <span className="text-primary italic underline decoration-white/10 decoration-2 underline-offset-8">{t('hero.subtitle1')}</span>
              <span className="inline-block ml-[0.2em]">{t('hero.subtitle2')}</span>
            </motion.div>
          </motion.h1>
          
          <div className="absolute top-1/2 -right-16 md:-right-32 -translate-y-1/2 w-32 md:w-80 opacity-20 pointer-events-none select-none">
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <motion.path 
                d="M5 5L95 25L5 45L95 55" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
            </svg>
          </div>
        </div>

        <Reveal delay={400}>
          <p className="max-w-2xl mx-auto text-white/40 text-sm md:text-lg font-sans mb-12 leading-relaxed uppercase tracking-widest px-4">
            {t('hero.description')}
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#produtos" 
              className="ds-btn ds-btn-primary w-full sm:w-auto sm:min-w-[280px] !py-4 !px-10 !text-[12px] !min-h-[56px] rounded-xl flex items-center justify-center gap-4 group shadow-[0_0_40px_rgba(255,0,85,0.4)] hover:shadow-[0_0_60px_rgba(255,0,85,0.6)] transition-all"
            >
              {t('common.getStarted')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
            </motion.a>
            
            <motion.div
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.98 }}
            >
              <Link to="/docs" className="ds-btn ds-btn-secondary w-full sm:w-auto sm:min-w-[280px] !py-4 !px-10 !text-[12px] !min-h-[56px] rounded-xl border border-white/10 flex items-center justify-center gap-4 bg-obsidian-soft/50 backdrop-blur-sm hover:bg-white/5 transition-all group overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-4">
                  {t('common.documentation')}
                  <div className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"></path></svg>
                  </div>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </Link>
            </motion.div>
          </div>
        </Reveal>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
           <div className="flex items-center gap-3 font-display text-[9px] tracking-[0.2em] uppercase transition-all duration-300 hover:text-white cursor-default">
             <span>Spectre Hub</span>
             <span className="text-primary font-black">//</span>
             <span>AGO-2026</span>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="flex -space-x-4">
               {(liveMembers.length > 0 ? liveMembers : fallbackMembers.map(n => ({ name: n, avatar: null }))).slice(0, 4).map((m, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, zIndex: 20 }}
                    className="w-10 h-10 rounded-full border-2 border-obsidian overflow-hidden bg-black flex items-center justify-center p-0.5 relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <Avatar seed={m.name} />
                    )}
                  </motion.div>
               ))}
             </div>
             <div className="font-display text-[9px] tracking-[0.3em] text-white/60 flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t('hero.activeCommunity')}
             </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
}
