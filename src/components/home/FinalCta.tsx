import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden py-32 bg-obsidian border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spectre-pink/10 rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <Reveal>
          <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-8 justify-center flex items-center gap-2">
            <span className="w-8 h-px bg-spectre-pink/30" />
            Próximo Passo
            <span className="w-8 h-px bg-spectre-pink/30" />
          </div>
          <h2 className="font-display text-[3.5rem] md:text-[6rem] lg:text-[10rem] leading-[0.85] text-white uppercase italic tracking-tighter mb-12">
            DEFINA O <br />
            <span className="text-spectre-pink">NOVO PADRÃO.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/40 text-base md:text-lg font-sans mb-16 uppercase tracking-[0.1em]">
            Junte-se ao ecossistema SPECTRE e ative sua infraestrutura de automação hoje mesmo. Desenvolvido para quem busca performance sem compromissos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href={guildInvite} 
              target="_blank" 
              rel="noreferrer" 
              className="ds-btn ds-btn-primary min-w-[280px] py-5 shadow-2xl shadow-spectre-pink/20"
            >
              <span className="flex items-center gap-3">
                Quero Usar o Spectre <ArrowRight className="w-5 h-5" />
              </span>
            </a>
            <Link 
              to="/hub" 
              className="ds-btn ds-btn-secondary min-w-[280px] py-5"
            >
              Acessar Painel
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
