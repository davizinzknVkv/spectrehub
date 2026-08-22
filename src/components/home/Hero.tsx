import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
}

export function Hero({ guildInvite, fallbackMembers }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85dvh] flex items-center justify-center overflow-hidden pt-12 pb-8 px-4 md:px-8 bg-background">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-spectre-pink animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase">
              {t('hero.badge')}
            </span>

          </div>
        </Reveal>

        <Reveal delay={100} className="relative">
          <div className="absolute top-1/2 -right-8 sm:-right-12 md:-right-24 -translate-y-1/2 w-20 sm:w-32 md:w-64 opacity-20 pointer-events-none select-none">
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path 
                d="M5 5L95 25L5 45L95 55" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-spectre-pink animate-[dash_3s_ease-in-out_infinite]"
                style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
              />
              <path 
                d="M85 45L95 55L85 65" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-spectre-pink animate-pulse" 
              />
            </svg>
          </div>
          {/* Adicionando efeito extra no lado oposto para mais impacto */}
          <div className="absolute top-1/4 -left-8 sm:-left-12 md:-left-24 -translate-y-1/2 w-20 sm:w-32 md:w-48 opacity-10 pointer-events-none select-none scale-x-[-1] rotate-12">
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path 
                d="M5 5L95 25L5 45L95 55" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-spectre-pink animate-[dash-reverse_4s_ease-in-out_infinite]"
                style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
              />
            </svg>
          </div>
          {/* Adicionando outro efeito no fundo para preencher o espaço */}
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-spectre-pink/5 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] text-foreground uppercase tracking-tighter mb-6 break-words relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-[0.3em] md:gap-[0.5em] justify-center flex-wrap">
              <span>{t('hero.title1')}</span>
              <img src={logoAsset.url} alt="" className="h-[0.8em] w-auto animate-pulse drop-shadow-[0_0_20px_rgba(255,0,85,0.4)]" />
              <span>{t('hero.title2')}</span>
            </div>
            <span className="text-spectre-pink">{t('hero.subtitle1')}</span> 
            <span className="inline-block">{t('hero.subtitle2')}</span>
          </h1>

        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-2xl mx-auto text-foreground-muted text-sm md:text-base font-sans mb-8 leading-relaxed">
            {t('hero.description')}
          </p>

        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a href="#produtos" className="ds-btn ds-btn-primary w-full sm:w-auto sm:min-w-[200px] !py-2.5 !px-6 !text-[11px] !min-h-[40px] rounded-md">
              {t('common.getStarted')}
            </a>
            <Link to="/docs" className="ds-btn ds-btn-secondary w-full sm:w-auto sm:min-w-[200px] !py-2.5 !px-6 !text-[11px] !min-h-[40px] rounded-md">
              {t('common.documentation')}
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
           <div className="flex items-center gap-4 font-display text-[9px] tracking-[0.2em] uppercase">
             <span>Spectre Hub</span>
             <span className="text-spectre-pink">//</span>
             <span>AGO-2026</span>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
               {fallbackMembers.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border border-white/20 overflow-hidden bg-black flex items-center justify-center p-0.5 relative group ring-2 ring-obsidian">
                    <div className="absolute inset-0 bg-gradient-to-tr from-spectre-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar seed={m} />
                  </div>
               ))}
             </div>
             <span className="font-display text-[9px] tracking-[0.2em] uppercase text-white/60">{t('hero.activeCommunity')}</span>
           </div>
        </div>
      </div>
    </section>
  );
}
