import React from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Plan } from "./constants";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="planos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <Reveal>
           <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 justify-center flex items-center gap-2">
               <span className="w-8 h-px bg-spectre-pink/30" />
               {t('plans.badge')}
               <span className="w-8 h-px bg-spectre-pink/30" />
            </div>
            <h2 className="font-display text-[2.5rem] md:text-[4rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-6">
              {t('plans.title')} <span className="text-white/30">{t('plans.subtitle')}</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg">
              {t('plans.description')}
            </p>

        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <div className={`relative flex flex-col h-full p-8 border border-white/5 bg-obsidian-soft transition-all duration-500 hover:border-spectre-pink/40 group rounded-none ${p.highlight ? 'border-spectre-pink/20 bg-spectre-pink/[0.02]' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-spectre-pink text-white text-[9px] font-display uppercase tracking-widest px-4 py-1 italic">
                  {t('plans.popular')}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="font-display text-xl text-white uppercase italic mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display text-white italic">{p.price}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{t('plans.perPeriod', { period: p.period })}</span>
                </div>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-spectre-pink/50 group-hover:bg-spectre-pink transition-colors" />
                    <span className="text-xs font-sans text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider">{f}</span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="ds-btn ds-btn-secondary w-full py-4 text-[10px]">
                  {t('plans.cta')}
                </a>
              ) : (
                <Link to="/hub" className={`ds-btn w-full py-4 text-[10px] ${p.highlight ? 'ds-btn-primary' : 'ds-btn-secondary'}`}>
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
