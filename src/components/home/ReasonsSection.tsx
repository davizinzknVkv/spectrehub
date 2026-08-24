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
            <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_#4DA09E]" />
            <span className="font-mono text-[9px] tracking-[0.5em] text-white/30 uppercase">
              {t('reasons.badge')}
            </span>
          </div>
          <h2 className="font-display text-[4rem] md:text-[6rem] leading-[0.8] text-white uppercase tracking-tighter mb-16">
            {t('reasons.title')} <br />
            <span className="text-primary italic opacity-90">{t('reasons.subtitle')}</span>
          </h2>
          <div className="border-l border-white/5 pl-8 space-y-10">
            <p className="text-white/20 text-[10px] leading-loose uppercase tracking-[0.2em] font-mono">
              {t('reasons.description')}
            </p>
            <div className="font-mono text-[8px] text-primary/20 uppercase tracking-[0.4em]">
              [ PROTOCOL_ESTABLISHED_V2 ]
            </div>
          </div>
        </Reveal>

        <div className="flex-1 w-full space-y-px bg-white/5 border border-white/5">
          {reasons.map((r: Reason, i: number) => (
            <Reveal key={r.title} delay={i * 50} className="group">
              <div className="flex items-start gap-12 p-12 bg-[#030303] transition-all duration-700 hover:bg-white/[0.02]">
                <div className="font-display text-6xl text-white/[0.02] group-hover:text-primary transition-colors duration-1000 italic shrink-0">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <r.icon className="w-3.5 h-3.5 text-primary opacity-20 group-hover:opacity-100 transition-all duration-500" />
                    <h3 className="font-display text-3xl text-white uppercase tracking-tighter transition-colors group-hover:text-primary">
                      {t(`reasons.items.${i}.title`)}
                    </h3>
                  </div>
                  <p className="font-mono text-[9px] text-white/20 leading-relaxed uppercase tracking-[0.1em] max-w-lg group-hover:text-white/40 transition-colors">
                    {t(`reasons.items.${i}.desc`)}
                  </p>
                  <div className="pt-6 flex items-center gap-4">
                    <div className="h-px w-8 bg-white/5 group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                    <span className="font-mono text-[7px] text-white/10 uppercase tracking-[0.5em] group-hover:text-primary transition-colors">
                      STATUS_READY_0x0{i+1}
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
