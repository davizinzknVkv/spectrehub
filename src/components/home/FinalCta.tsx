import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-32">
      <Reveal>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-8xl">
            ABRA UM
            <br />
            TICKET!
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-lg font-medium text-[#8a8a8a] leading-relaxed">
            Junte-se à elite e ative sua infraestrutura de automação hoje mesmo. Suporte direto com quem entende do assunto.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-primary ds-btn-lg px-10 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Abrir meu ticket agora
            </a>
            <Link to="/hub" className="ds-btn ds-btn-secondary ds-btn-lg px-10">
              Acessar painel
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
