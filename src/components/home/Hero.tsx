import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
  liveMembers?: { id: string; name: string; avatar: string | null }[];
}

export function Hero({ fallbackMembers, liveMembers = [] }: HeroProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  const members = (liveMembers.length > 0
    ? liveMembers
    : fallbackMembers.map((n) => ({ id: n, name: n, avatar: null }))
  ).slice(0, 5);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[88dvh] items-center overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-primary/12 blur-[140px]" />

      <motion.div style={{ opacity: smoothOpacity }} className="bn-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="bn-badge">{t("hero.badge")}</span>
            </Reveal>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.05] text-foreground"
            >
              {t("hero.title1")}{" "}
              <span className="text-primary">{t("hero.title2")}</span>
            </motion.h1>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                {t("hero.description")}
              </p>
            </Reveal>

            <Reveal delay={350}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#produtos" className="ds-btn ds-btn-primary w-full sm:w-auto">
                  {t("common.getStarted")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/docs" className="ds-btn ds-btn-secondary w-full !min-h-12 sm:w-auto">
                  {t("common.documentation")}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {members.map((m, i) => (
                    <div
                      key={`${m.name}-${i}`}
                      className="h-9 w-9 overflow-hidden rounded-full border-2 border-background bg-surface-2"
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <Avatar seed={m.name} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground-muted">{t("hero.activeCommunity")}</p>
              </div>
            </Reveal>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="ds-card space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Status da plataforma</span>
                <span className="bn-badge">Operacional</span>
              </div>
              <dl className="space-y-4">
                {[
                  { k: "Versão", v: "2026.1" },
                  { k: "Missões processadas", v: "128.400+" },
                  { k: "Disponibilidade", v: "99,9%" },
                  { k: "Latência média", v: "42 ms" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-foreground-muted">{row.k}</dt>
                    <dd className="font-mono text-sm text-foreground">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
