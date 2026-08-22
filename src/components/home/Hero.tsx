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
          <h1 className="font-display text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.8] text-white uppercase tracking-tighter mb-8 break-words relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-[0.1em] justify-center flex-wrap">
              <span>{t('hero.title1')}</span>
              <div className="flex flex-col items-center mx-4 translate-y-[0.05em]">
                <img src={logoAsset.url} alt="" className="h-[0.7em] w-auto animate-pulse drop-shadow-[0_0_40px_rgba(255,0,85,0.8)]" />
                <span className="text-[12px] tracking-[0.6em] text-white/40 font-sans mt-2 font-black">SPECTREHUB</span>
              </div>
              <span>{t('hero.title2')}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center">
              <span className="text-spectre-pink">{t('hero.subtitle1')}</span>
              <span className="inline-block md:ml-[0.2em]">{t('hero.subtitle2')}</span>
            </div>
          </h1>

        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-2xl mx-auto text-foreground-muted text-sm md:text-base font-sans mb-8 leading-relaxed">
            {t('hero.description')}
          </p>

        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4">
            <a href="#produtos" className="ds-btn ds-btn-primary w-full sm:w-auto sm:min-w-[320px] !py-4 !px-10 !text-[13px] !min-h-[60px] rounded-xl flex items-center justify-center gap-4 group shadow-[0_0_30px_rgba(255,0,85,0.3)] hover:shadow-[0_0_50px_rgba(255,0,85,0.5)] transition-all">
              {t('common.getStarted')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <Link to="/docs" className="ds-btn ds-btn-secondary w-full sm:w-auto sm:min-w-[320px] !py-4 !px-10 !text-[13px] !min-h-[60px] rounded-xl border border-white/10 flex items-center justify-center gap-4 bg-obsidian hover:bg-white/5 transition-all group">
              {t('common.documentation')}
              <div className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"></path></svg>
              </div>
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
           <div className="flex items-center gap-3 font-display text-[9px] tracking-[0.2em] uppercase transition-all duration-300 hover:text-white cursor-default">
             <span>Spectre Hub</span>
             <span className="text-spectre-pink font-black">//</span>
             <span>AGO-2026</span>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {fallbackMembers.slice(0, 4).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-obsidian overflow-hidden bg-black flex items-center justify-center p-0.5 relative group ring-2 ring-obsidian">
                    <div className="absolute inset-0 bg-gradient-to-tr from-spectre-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar seed={m} />
                  </div>
               ))}
             </div>
             <div className="font-display text-[9px] tracking-[0.2em] uppercase text-white/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {t('hero.activeCommunity')}
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
