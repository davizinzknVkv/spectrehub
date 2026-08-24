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
    <section id="recursos" className="mx-auto max-w-7xl px-6 py-32 sm:px-12">
      <div className="flex flex-col lg:flex-row gap-24 items-start">
        <Reveal className="flex-1 lg:max-w-md sticky top-32">
          <div className="font-display text-[9px] tracking-[0.5em] text-primary uppercase mb-6 flex items-center gap-4">
             <div className="w-12 h-px bg-primary" />
             {t('reasons.badge')}
          </div>
          <h2 className="font-display text-[3.5rem] md:text-[5rem] leading-[0.85] text-white uppercase tracking-tighter mb-10">
            {t('reasons.title')} <br />
            <span className="text-primary italic opacity-90">{t('reasons.subtitle')}</span>
          </h2>
          <div className="border-l border-white/10 pl-8 space-y-8">
            <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-[0.2em]">
              {t('reasons.description')}
            </p>
            <div className="font-mono text-[8px] text-primary/30 uppercase tracking-[0.4em]">
              [ PROTOCOL_ESTABLISHED_V2 ]
            </div>
          </div>
        </Reveal>

        <div className="flex-1 w-full space-y-1">
          {reasons.map((r: Reason, i: number) => (
            <Reveal key={r.title} delay={i * 50} className="group">
              <div className="flex items-start gap-10 p-10 bg-[#030303] border border-white/5 transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.01]">
                <div className="font-display text-5xl text-white/[0.03] group-hover:text-primary transition-colors duration-700 italic">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <r.icon className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-display text-2xl text-white uppercase tracking-tighter">{t(`reasons.items.${i}.title`)}</h3>
                  </div>
                  <p className="font-sans text-[11px] text-white/30 leading-relaxed uppercase tracking-[0.1em] max-w-lg group-hover:text-white/50 transition-colors">
                    {t(`reasons.items.${i}.desc`)}
                  </p>
                  <div className="pt-4 flex items-center gap-2">
                    <div className="w-8 h-px bg-white/5 group-hover:w-12 group-hover:bg-primary/30 transition-all" />
                    <span className="font-mono text-[7px] text-white/10 uppercase tracking-[0.3em]">SYS_READY</span>
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
