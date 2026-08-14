import React from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Plan } from "./constants";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  return (
    <section id="planos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <Reveal>
          <h2 className="ds-h1">PLANS & ELITE ACCESS</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 ds-body text-[#8a8a8a] max-w-2xl mx-auto">
            Escolha o nível de acesso que seu servidor merece. Performance sem compromissos.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 100}>
            <div className={`relative flex flex-col p-8 sm:p-10 border ${
              plan.popular ? "bg-white/[0.04] border-[#ff0055]" : "bg-white/[0.02] border-white/10"
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff0055] px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                  MAIS POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="ds-label text-white tracking-[0.25em]">{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-black text-white">R${plan.price}</span>
                  <span className="text-[#8a8a8a] text-xs font-bold uppercase tracking-widest">/mês</span>
                </div>
                <p className="mt-4 text-[13px] text-[#8a8a8a] font-medium leading-relaxed">
                  {plan.desc}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-[#ff0055] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-[#d4d4d4] font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/hub"
                className={`ds-btn ds-btn-lg w-full ${
                  plan.popular ? "ds-btn-primary" : "ds-btn-secondary"
                }`}
              >
                <ArrowRight className="h-4 w-4" /> COMEÇAR AGORA
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
