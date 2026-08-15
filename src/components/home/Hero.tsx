import React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
}

export function Hero({ guildInvite, fallbackMembers }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectre-pink/5 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-spectre-pink/30 bg-spectre-pink/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-spectre-pink animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase">
              Alta Tecnologia
            </span>
          </div>
        </Reveal>

        <Reveal delay={100} className="relative">
          <div className="absolute top-1/2 -right-12 md:-right-24 -translate-y-1/2 w-32 md:w-64 opacity-20 pointer-events-none select-none">
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
          <h1 className="font-display text-[clamp(2.5rem,10vw,8.5rem)] leading-[0.85] text-white uppercase italic tracking-tighter mb-8 break-words relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-4 md:gap-8 justify-center">
              <span>SPECTRE</span>
              <img src={logoAsset.url} alt="" className="h-[0.8em] md:h-[0.9em] w-auto animate-pulse drop-shadow-[0_0_20px_rgba(255,0,85,0.4)]" />
              <span>HUB</span>
            </div>
            <span className="text-spectre-pink">DOMINA</span> O <br />
            MERCADO.
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-sans mb-12">
            O hub definitivo para automação de elite no Discord. Performance absoluta, infraestrutura inabalável e a experiência de usuário mais sofisticada do mercado.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#produtos" className="ds-btn ds-btn-primary min-w-[240px]">
              Quero Usar o Spectre
            </a>
            <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-secondary min-w-[240px]">
              Documentação
            </a>
          </div>
        </Reveal>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <div className="flex items-center gap-4 font-display text-[10px] tracking-[0.2em] uppercase">
             <span>Spectre Hub</span>
             <span className="text-spectre-pink">//</span>
             <span>AGO-2026</span>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {fallbackMembers.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-black flex items-center justify-center p-0.5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-spectre-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar seed={m} />
                  </div>
               ))}
             </div>
             <span className="font-display text-[10px] tracking-[0.2em] uppercase text-white/60">Comunidade Ativa</span>
           </div>
        </div>
      </div>
    </section>
  );
}
