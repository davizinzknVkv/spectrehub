import React from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { Plan } from "./constants";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  return (
    <section id="sobre" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 reveal-item">
      <div className="max-w-4xl">
        <Reveal>
          <h2 className="font-display text-[2.8rem] font-[900] leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-[5.5rem]">
            PLANOS &
            <br />
            ACESSO.
          </h2>
          <p className="mt-10 text-[18px] font-medium text-[#8a8a8a] leading-[1.6] max-w-xl px-1 border-l border-[#ff0055]/30 ml-1 pl-6">
            Estrutura flexível projetada para escalar conforme suas necessidades. Gerenciamento automático via Discord para máxima conveniência.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <div className={`relative group border border-white/10 bg-[#080808]/40 backdrop-blur-sm p-8 sm:p-10 flex flex-col h-full transition-all duration-700 hover:border-[#ff0055]/50 hover:bg-[#0c0c0c]/60 hover:-translate-y-4 rounded-[32px] shadow-2xl ${p.highlight ? 'ring-2 ring-[#ff0055]/40 bg-[#0c0c0c]/80' : ''}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,0,85,0.4)] whitespace-nowrap z-10">
                  RECOMENDADO
                </div>
              )}
              <h3 className="text-[11px] font-black text-[#ff0055] uppercase tracking-[0.35em] mb-6">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-display font-[900] text-white tracking-tighter">{p.price}</span>
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">/ {p.period}</span>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="h-3 w-3 text-[#ff0055]" />
                    <span className="text-xs font-medium text-[#8a8a8a]">{f}</span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="ds-btn ds-btn-secondary w-full py-2">
                  COMEÇAR AGORA
                </a>
              ) : (
                <Link to="/hub" className={p.highlight ? "ds-btn ds-btn-primary w-full py-2" : "ds-btn ds-btn-secondary w-full py-2"}>
                  {p.cta.toUpperCase()}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

