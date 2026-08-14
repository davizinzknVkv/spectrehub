import React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
}

export function Hero({ guildInvite, fallbackMembers }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spectre-pink/5 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-spectre-pink/30 bg-spectre-pink/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-spectre-pink animate-pulse" />
            <span className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase">
              Tecnologia de Elite
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-display text-[clamp(2.5rem,12vw,10rem)] leading-[0.85] text-white uppercase italic tracking-tighter mb-8 break-words">
            SPECTRE HUB <br />
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
              Iniciar Experiência
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
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-white/5">
                   <Avatar seed={m} />
                 </div>
               ))}
             </div>
             <span className="font-display text-[10px] tracking-[0.2em] uppercase">Comunidade Ativa</span>
           </div>
        </div>
      </div>
    </section>
  );
}
