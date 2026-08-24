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
            <p className="text-white/60 text-[11px] leading-relaxed uppercase tracking-[0.2em]">
              {t('plans.description')}
            </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-background border border-white/5">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 50} className="relative group border-r border-b lg:border-b-0 border-white/5 last:border-r-0">
            <div className="p-12 flex flex-col h-full relative z-10 hover:bg-white/[0.01] transition-all duration-500">
              {p.highlight && (
                <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
              )}
              
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-1 bg-white/10" />
                  <span className="font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase">NÍVEL 0{i + 1}</span>
                </div>
                <h3 className="font-display text-4xl text-white uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{t(`plans.tiers.${p.name.toLowerCase()}.name`)}</h3>
                <div className="flex items-baseline gap-3 pt-4 border-t border-white/5">
                  <span className="text-4xl font-display text-white tracking-tighter italic">{p.price}</span>
                  <span className="font-mono text-[8px] text-white/10 uppercase tracking-[0.3em]">/ {t(`plans.tiers.${p.name.toLowerCase()}.period`)}</span>
                </div>
              </div>

              <div className="space-y-6 mb-24 flex-1">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-4 group/item">
                    <div className="w-1 h-px bg-white/10 group-hover/item:bg-primary transition-colors" />
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] group-hover/item:text-white/40 transition-colors leading-none">
                       {t(`plans.tiers.${p.name.toLowerCase()}.features.${fi}`)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                {p.name === "Free" ? (
                  <a href="#free" className="ds-btn ds-btn-secondary w-full !h-14 !text-[10px] uppercase tracking-[0.3em]">
                    COMEÇAR AGORA
                  </a>
                ) : (
                  <Link to="/hub" className={p.highlight ? "ds-btn ds-btn-primary w-full !h-14 !text-[10px] uppercase tracking-[0.3em]" : "ds-btn ds-btn-secondary w-full !h-14 !text-[10px] uppercase tracking-[0.3em]"}>
                    {t(`plans.tiers.${p.name.toLowerCase()}.cta`)}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
