import React from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Reason } from "./constants";

interface ReasonsSectionProps {
  reasons: Reason[];
}

export function ReasonsSection({ reasons }: ReasonsSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="recursos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-20 items-start">
        <Reveal>
          <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-4 flex items-center gap-2">
             <span className="w-8 h-px bg-spectre-pink/30" />
             {t('reasons.badge')}
          </div>
          <h2 className="font-display text-[2rem] md:text-[3.5rem] leading-[0.9] text-white uppercase italic tracking-tighter mb-8">
            {t('reasons.title')} <br />
            <span className="text-white/30 text-[1.5rem] md:text-[2.5rem]">{t('reasons.subtitle')}</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest border-l border-spectre-pink/30 pl-6">
            {t('reasons.description')}
          </p>

        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {reasons.map((r: Reason, i: number) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="bg-obsidian p-10 h-full border border-transparent hover:border-spectre-pink/20 transition-all duration-500 group rounded-none">
                <div className="mb-8 w-12 h-12 border border-white/10 flex items-center justify-center text-white group-hover:bg-spectre-pink group-hover:border-spectre-pink transition-all duration-500">
                  <r.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg text-white uppercase italic mb-4">{t(`reasons.items.${i}.title`)}</h3>
                <p className="font-sans text-xs text-white/30 leading-relaxed uppercase tracking-wider">
                  {t(`reasons.items.${i}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
