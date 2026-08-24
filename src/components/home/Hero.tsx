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
    <section ref={containerRef} className="relative min-h-[95dvh] flex items-center justify-start overflow-hidden pt-32 pb-24 px-6 md:px-20 bg-transparent">
      {/* Background Grid Micro-details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-0 right-[15%] w-px h-[600px] bg-gradient-to-b from-primary/10 to-transparent" />
      
      <motion.div 
        style={{ opacity: smoothOpacity, scale: smoothScale }}
        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end"
      >
        <div className="lg:col-span-8 text-left">
          <Reveal>
            <div className="flex items-center gap-6 mb-16">
              <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_#FF0050]" />
              <span className="font-mono text-[9px] tracking-[0.5em] text-white/30 uppercase">
                {t('hero.badge')} // SISTEMA INICIALIZADO
              </span>
            </div>
          </Reveal>

          <div className="relative">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] text-white uppercase tracking-tighter"
            >
              <div className="flex flex-col">
                <span className="block">{t('hero.title1')}</span>
                <span className="block text-primary italic relative">
                  {t('hero.title2')}
                  <span className="absolute -bottom-4 left-0 w-24 h-px bg-primary opacity-50" />
                </span>
              </div>
            </motion.h1>
            
            <Reveal delay={400}>
              <div className="mt-16 max-w-lg border-l border-white/5 pl-8">
                <p className="text-white/50 text-xs md:text-sm font-mono leading-loose uppercase tracking-[0.2em]">
                  {t('hero.description')}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={600}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-20">
              <a 
                href="#produtos" 
                className="ds-btn ds-btn-primary !h-16 !px-12 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em]"
              >
                {t('common.getStarted')}
                <ArrowRight className="w-4 h-4 opacity-50" />
              </a>
              
              <Link to="/docs" className="ds-btn ds-btn-secondary !h-16 !px-10 flex items-center justify-center text-[11px] uppercase tracking-[0.3em]">
                {t('common.documentation')}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:text-right hidden lg:block">
          <div className="space-y-8 opacity-40">
            <div className="space-y-2">
              <span className="font-display text-[9px] tracking-[0.3em] uppercase block">Timestamp</span>
              <span className="font-mono text-[10px] block uppercase">VERSÃO 2026</span>
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
              SISTEMA CARREGADO
              <br />
              RLS ATIVO
              <br />
              NÚCLEO ATIVO
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
