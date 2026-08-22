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
    <section id="planos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Reveal>
           <div className="font-display text-[10px] tracking-[0.3em] text-primary uppercase mb-4 justify-center flex items-center gap-2">
               <span className="w-8 h-px bg-primary/30" />
               {t('plans.badge')}
               <span className="w-8 h-px bg-primary/30" />
            </div>
            <h2 className="font-display text-[2.5rem] md:text-[4rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-6">
              {t('plans.title')} <span className="text-white/30">{t('plans.subtitle')}</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg">
              {t('plans.description')}
            </p>

        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <motion.div 
              whileHover={{ y: -10 }}
              className={`relative flex flex-col h-full p-8 md:p-10 border border-white/5 bg-[#080808] transition-all duration-500 lg:hover:border-primary/30 group rounded-none ${p.highlight ? 'ring-1 ring-primary/20 bg-primary/[0.01]' : ''}`}
            >
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-display uppercase tracking-widest px-6 py-1.5 italic font-bold">
                  {t('plans.popular')}
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="font-display text-2xl text-white uppercase italic mb-4">{t(`plans.tiers.${p.name.toLowerCase()}.name`)}</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display text-white italic">{p.price}</span>
                  </div>
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] italic font-bold">/ {t(`plans.tiers.${p.name.toLowerCase()}.period`)}</span>
                </div>
              </div>

              <div className="space-y-5 mb-14 flex-1">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_rgba(255,0,85,0.4)] shrink-0" />
                    <span className="text-[11px] font-sans text-white/40 group-hover:text-white/70 transition-colors uppercase tracking-[0.15em] leading-relaxed">
                       {t(`plans.tiers.${p.name.toLowerCase()}.features.${fi}`)}
                    </span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="ds-btn ds-btn-secondary w-full py-5 text-[10px] uppercase font-bold tracking-widest">
                  {t('plans.cta')}
                </a>
              ) : (
                <Link to="/hub" className={`ds-btn w-full py-5 text-[10px] uppercase font-bold tracking-widest ${p.highlight ? 'ds-btn-primary shadow-[0_0_20px_rgba(255,0,85,0.2)]' : 'ds-btn-secondary'}`}>
                  {t(`plans.tiers.${p.name.toLowerCase()}.cta`)}
                </Link>
              )}

            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
