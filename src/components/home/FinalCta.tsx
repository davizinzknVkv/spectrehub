import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

interface FinalCtaProps {
  guildInvite: string;
}

export function FinalCta({ guildInvite }: FinalCtaProps) {
  const { t } = useTranslation();

  return (
    <section className="bn-container py-24 sm:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] max-w-[120vw] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight text-foreground">
              {t("final.title")} <span className="text-primary">{t("final.subtitle")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground-muted">
              {t("final.description")}
            </p>
            <a
              href={guildInvite}
              target="_blank"
              rel="noreferrer"
              className="ds-btn ds-btn-primary group mt-10"
            >
              {t("common.getStarted")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
