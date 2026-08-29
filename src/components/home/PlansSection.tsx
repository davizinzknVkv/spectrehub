import React from "react";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { Plan } from "./constants";
import { cn } from "@/lib/utils";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="planos" className="bn-container py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <span className="bn-badge">{t("plans.badge")}</span>
        <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-foreground">
          {t("plans.title")} <span className="text-primary">{t("plans.subtitle")}</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-foreground-muted">
          {t("plans.description")}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((p, i) => {
          const key = p.name.toLowerCase();
          return (
            <Reveal key={p.name} delay={i * 60}>
              <div
                className={cn(
                  "ds-card flex h-full flex-col",
                  p.highlight && "border-primary/40 bg-card-elevated",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(`plans.tiers.${key}.name`)}
                  </h3>
                  {p.highlight && <span className="bn-badge">Popular</span>}
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{p.price}</span>
                  <span className="text-sm text-foreground-muted">
                    /{t(`plans.tiers.${key}.period`)}
                  </span>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm leading-relaxed text-foreground-muted">
                        {t(`plans.tiers.${key}.features.${fi}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {p.name === "Free" ? (
                    <a href="#free" className="ds-btn ds-btn-secondary w-full !min-h-12">
                      Começar agora
                    </a>
                  ) : (
                    <Link
                      to="/hub"
                      className={cn(
                        "ds-btn w-full !min-h-12",
                        p.highlight ? "ds-btn-primary" : "ds-btn-secondary",
                      )}
                    >
                      {t(`plans.tiers.${key}.cta`)}
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
