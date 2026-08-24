import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";
import logoAsset from "@/assets/logo-spectre.png.asset.json";

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
    <section ref={containerRef} className="relative min-h-[95dvh] flex items-center justify-start overflow-hidden pt-32 pb-24 px-6 md:px-12 bg-transparent">
      {/* Background Micro-details */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-0 right-[10%] w-px h-64 bg-gradient-to-b from-primary/20 to-transparent" />
      
      <motion.div 
        style={{ opacity: smoothOpacity, scale: smoothScale }}
        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end"
      >
        <div className="lg:col-span-8 text-left">
          <Reveal>
            <div className="flex items-center gap-4 mb-12 opacity-40">
              <div className="h-px w-12 bg-primary" />
              <span className="font-display text-[9px] tracking-[0.5em] text-primary uppercase font-black">
                {t('hero.badge')}
              </span>
            </div>
          </Reveal>

          <div className="relative">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] text-white uppercase tracking-tighter"
            >
              <div className="flex flex-col">
                <span className="block">{t('hero.title1')}</span>
                <span className="block text-primary italic opacity-90">{t('hero.title2')}</span>
              </div>
            </motion.h1>
            
            <Reveal delay={400}>
              <div className="mt-8 max-w-xl">
                <p className="text-white/40 text-sm md:text-base font-sans leading-relaxed uppercase tracking-[0.2em]">
                  {t('hero.description')}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={600}>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
              <a 
                href="#produtos" 
                className="ds-btn ds-btn-primary w-full sm:w-auto"
              >
                {t('common.getStarted')}
                <ArrowRight className="ml-3 w-4 h-4" />
              </a>
              
              <Link to="/docs" className="ds-btn ds-btn-secondary w-full sm:w-auto">
                {t('common.documentation')}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:text-right hidden lg:block">
          <div className="space-y-8 opacity-40">
            <div className="space-y-2">
              <span className="font-display text-[9px] tracking-[0.3em] uppercase block">Timestamp</span>
              <span className="font-mono text-[10px] block uppercase">2026_VERSION_ELITE</span>
            </div>
            
            <div className="space-y-4">
              <span className="font-display text-[9px] tracking-[0.3em] uppercase block">{t('hero.activeCommunity')}</span>
              <div className="flex justify-end -space-x-3">
                 {(liveMembers.length > 0 ? liveMembers : fallbackMembers.map(n => ({ name: n, avatar: null }))).slice(0, 5).map((m, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full border border-obsidian overflow-hidden bg-black flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-crosshair"
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <Avatar seed={m.name} />
                      )}
                    </div>
                 ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-[9px] font-mono leading-relaxed max-w-[200px] ml-auto uppercase opacity-50">
              [SYSTEM_LOADED]
              <br />
              [RLS_ENABLED]
              <br />
              [CORE_ACTIVE]
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Industrial Decorative Element */}
      <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6 opacity-20 pointer-events-none">
        <div className="font-display text-[8px] tracking-[1em] uppercase vertical-text transform rotate-180">
          SPECTRE HUB
        </div>
        <div className="h-32 w-px bg-gradient-to-t from-primary to-transparent" />
      </div>
    </section>
  );
}
