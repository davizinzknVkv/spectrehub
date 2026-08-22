import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-16 bg-obsidian border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spectre-pink/10 rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <Reveal>
          <div className="font-display text-[10px] tracking-[0.3em] text-spectre-pink uppercase mb-8 justify-center flex items-center gap-2">
            <span className="w-8 h-px bg-spectre-pink/30" />
            {t('footer.badge')}
            <span className="w-8 h-px bg-spectre-pink/30" />
          </div>
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.85] text-white uppercase italic tracking-tighter mb-8">
            {t('footer.title')} <br />
            <span className="text-spectre-pink">{t('footer.subtitle')}</span>

          </h2>
          <p className="mx-auto max-w-2xl text-white/40 text-sm md:text-base font-sans mb-12 uppercase tracking-[0.1em]">
            {t('footer.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={guildInvite} 
              target="_blank" 
              rel="noreferrer" 
              className="ds-btn ds-btn-primary min-w-[240px] !py-3 !text-[11px] !min-h-[44px] rounded-md shadow-2xl shadow-spectre-pink/20"
            >
              <span className="flex items-center gap-3">
                {t('common.getStarted')} <ArrowRight className="w-4 h-4" />
              </span>
            </a>
            <Link 
              to="/hub" 
              className="ds-btn ds-btn-secondary min-w-[240px] !py-3 !text-[11px] !min-h-[44px] rounded-md"
            >
              {t('footer.accessDashboard')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
