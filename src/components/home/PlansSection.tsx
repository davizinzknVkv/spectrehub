import React from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Plan } from "./constants";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="planos" className="mx-auto max-w-7xl px-6 py-32 sm:px-12">
      <div className="flex flex-col lg:flex-row gap-20 items-end mb-24">
        <Reveal className="flex-1">
            <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase mb-6 flex items-center gap-4">
               <div className="w-12 h-px bg-primary" />
               {t('plans.badge')}
            </div>
            <h2 className="font-display text-[3.5rem] md:text-[5rem] leading-[0.85] text-white uppercase tracking-tighter">
              {t('plans.title')} <br />
              <span className="text-primary italic opacity-90">{t('plans.subtitle')}</span>
            </h2>
        </Reveal>
        <Reveal className="flex-1 lg:max-w-sm border-l border-white/10 pl-8 pb-4">
            <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-[0.2em]">
              {t('plans.description')}
            </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 50} className="bg-[#030303] relative group">
            <div className="p-12 flex flex-col h-full relative z-10 hover:bg-white/[0.01] transition-all duration-500">
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[7px] font-display uppercase tracking-[0.3em] px-5 py-1.5 italic">
                  POPULAR_CHOICE
                </div>
              )}
              
              <div className="mb-16">
                <span className="font-mono text-[8px] text-primary/30 block mb-6 tracking-[0.5em]">L_0{i + 1}</span>
                <h3 className="font-display text-3xl text-white uppercase tracking-tighter mb-4 italic group-hover:text-primary transition-colors">{t(`plans.tiers.${p.name.toLowerCase()}.name`)}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display text-white tracking-tighter">{p.price}</span>
                  <span className="font-mono text-[7px] text-white/20 uppercase tracking-[0.3em]">/ {t(`plans.tiers.${p.name.toLowerCase()}.period`)}</span>
                </div>
              </div>

              <div className="space-y-6 mb-20 flex-1">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-4 group/item">
                    <div className="w-1 h-1 bg-primary/20 group-hover/item:bg-primary transition-colors" />
                    <span className="text-[9px] font-display text-white/20 uppercase tracking-[0.2em] group-hover/item:text-white/50 transition-colors leading-none">
                       {t(`plans.tiers.${p.name.toLowerCase()}.features.${fi}`)}
                    </span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="ds-btn ds-btn-secondary w-full !h-14 flex items-center justify-center">
                  INITIALIZE_FREE
                </a>
              ) : (
                <Link to="/hub" className={p.highlight ? "ds-btn ds-btn-primary w-full !h-14 flex items-center justify-center" : "ds-btn ds-btn-secondary w-full !h-14 flex items-center justify-center"}>
                  {t(`plans.tiers.${p.name.toLowerCase()}.cta`)}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
