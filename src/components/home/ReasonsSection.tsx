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
    <section id="recursos" className="bn-container py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <span className="bn-badge">{t("reasons.badge")}</span>
        <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-foreground">
          {t("reasons.title")} <span className="text-primary">{t("reasons.subtitle")}</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground-muted">
          {t("reasons.description")}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r: Reason, i: number) => (
          <Reveal key={r.title} delay={i * 60}>
            <article className="ds-card h-full">
              <span className="font-mono text-sm text-primary">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {t(`reasons.items.${i}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                {t(`reasons.items.${i}.desc`)}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
