import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Reason } from "./constants";

interface ReasonsSectionProps {
  reasons: Reason[];
}

export function ReasonsSection({ reasons }: ReasonsSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="recursos" className="mx-auto max-w-7xl px-6 py-48 sm:px-12">
      <div className="flex flex-col lg:flex-row gap-32 items-start">
        <Reveal className="flex-1 lg:max-w-md lg:sticky lg:top-32">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_#005194]" />
            <span className="font-mono text-[9px] tracking-[0.5em] text-white/30 uppercase">
              {t('reasons.badge')}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight text-white uppercase tracking-tighter mb-16">
            {t('reasons.title')} <br />
            <span className="text-primary italic opacity-90">{t('reasons.subtitle')}</span>
          </h2>
          <div className="border-l border-white/5 pl-8 space-y-10">
            <p className="font-mono text-[10px] leading-relaxed uppercase tracking-[0.2em] text-white/40">
              {t('reasons.description')}
            </p>
            <div className="font-mono text-[8px] text-primary/20 uppercase tracking-[0.4em]">
              INFRAESTRUTURA CORE V4
            </div>
          </div>
        </Reveal>

        <div className="flex-1 w-full space-y-px bg-white/5 border border-white/5">
          {reasons.map((r: Reason, i: number) => (
            <Reveal key={r.title} delay={i * 50} className="group">
              <div className="flex items-start gap-12 p-16 bg-background transition-all duration-700 hover:bg-white/[0.01]">
                <div className="font-display text-7xl text-white/[0.02] group-hover:text-primary transition-colors duration-1000 italic shrink-0">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-6">
                    <h3 className="font-display text-4xl text-white uppercase tracking-tighter transition-colors group-hover:text-primary">
                      {t(`reasons.items.${i}.title`)}
                    </h3>
                  </div>
                  <p className="font-mono text-[9px] text-white/30 leading-relaxed uppercase tracking-[0.2em] max-w-lg group-hover:text-white/60 transition-colors">
                    {t(`reasons.items.${i}.desc`)}
                  </p>
                  <div className="pt-10 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="font-mono text-[7px] text-primary uppercase tracking-[0.5em]">
                      MÓDULO 0{i+1} ATIVO
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
