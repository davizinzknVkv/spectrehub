import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <Reveal>
        <div className="bg-obsidian border border-white/5 p-12 md:p-24 text-center relative overflow-hidden group">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/20 m-4 pointer-events-none group-hover:border-primary/40 transition-colors"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/20 m-4 pointer-events-none group-hover:border-primary/40 transition-colors"
          />
          
          <div className="mb-8 relative w-24 h-24 mx-auto group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <Sparkles className="w-full h-full text-primary animate-pulse relative z-10" />
          </div>
          <h2 className="font-display text-[2.5rem] md:text-[5rem] leading-[0.85] text-white uppercase italic tracking-tighter mb-8 break-words flex flex-col items-center">
            <span>{t('final.title')}</span>
            <span className="text-primary">{t('final.subtitle')}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/50 text-xs md:text-sm font-sans mb-12 uppercase tracking-[0.3em] leading-relaxed">
            {t('final.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={guildInvite} 
              target="_blank" 
              rel="noreferrer" 
              className="ds-btn ds-btn-primary w-full sm:w-auto sm:min-w-[280px] !py-4 !px-10 !text-[12px] rounded-xl flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(255,0,85,0.3)] hover:shadow-[0_0_50px_rgba(255,0,85,0.5)] transition-all"
            >
              {t('common.getStarted')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </motion.a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
