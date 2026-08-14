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
    <section id="sobre" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="max-w-4xl">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            SISTEMAS PARA
            <br />
            QUEM LEVA A
            <br />
            SÉRIO.
          </h2>
          <p className="mt-8 text-lg font-medium text-[#8a8a8a] leading-relaxed max-w-xl">
            O plano é detectado pelo seu cargo no Discord — se expirar, o hub volta pro Free automaticamente.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div className={`relative group border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full transition-all hover:border-[#ff0055]/30 ${p.highlight ? 'ring-1 ring-[#ff0055]/50' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-[#ff0055] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                  Popular
                </div>
              )}
              <h3 className="text-[10px] font-bold text-[#ff0055] uppercase tracking-[0.3em] mb-4">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-display font-extrabold text-white tracking-tighter">{p.price}</span>
                <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">/ {p.period}</span>
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
                <a href="#free" className="text-center bg-white/5 border border-white/10 text-white font-bold py-3 px-6 text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Começar Grátis
                </a>
              ) : (
                <Link to="/hub" className={`text-center font-bold py-3 px-6 text-[11px] uppercase tracking-widest transition-all ${p.highlight ? 'bg-[#ff0055] text-white hover:bg-[#ff0055]/90' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                  {p.cta}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

