import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-32 bg-[#030303] reveal-item">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Reveal>
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-display text-6xl font-[900] leading-[0.85] tracking-tighter text-white sm:text-8xl lg:text-[9rem] uppercase italic">
            ELEVE O SEU
            <br />
            <span className="text-[#ff0055]">SERVIDOR.</span>
          </h2>
          <p className="mx-auto mt-12 max-w-2xl text-[18px] font-medium text-[#8a8a8a] leading-[1.6]">
            Junte-se ao ecossistema SPECTRE e ative sua infraestrutura de automação hoje mesmo. Desenvolvido para quem busca performance sem compromissos.
          </p>
          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-primary ds-btn-lg px-12 flex items-center gap-3 w-full sm:w-auto shadow-2xl shadow-[#ff0055]/20">
              <ArrowRight className="h-5 w-5" /> ABRIR TICKET AGORA
            </a>
            <Link to="/hub" className="ds-btn ds-btn-secondary ds-btn-lg px-12 w-full sm:w-auto">
              ACESSAR PAINEL
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
