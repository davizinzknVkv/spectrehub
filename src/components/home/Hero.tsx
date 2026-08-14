import React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";

interface HeroProps {
  guildInvite: string;
  fallbackMembers: string[];
}

export function Hero({ guildInvite, fallbackMembers }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pb-24 pt-32 sm:px-6 sm:pb-32 sm:pt-40 lg:px-8">
      {/* grid + glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10rem] -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#ff0055]/10 blur-[150px] opacity-50"
      />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-3 rounded-full border border-[#ff0055]/30 bg-[#ff0055]/10 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.45em] text-[#ff0055] backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,85,0.15)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff0055] shadow-[0_0_12px_#ff0055]" />
            TECNOLOGIA DE ELITE
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-10 font-display text-[2.8rem] font-[900] leading-[0.82] tracking-tighter text-white xs:text-[4.5rem] sm:text-[6.5rem] lg:text-[10rem] break-words px-2 uppercase italic overflow-wrap-anywhere">
            A SPECTRE
            <br />
            CRIA.
            <br />
            <span className="text-[#ff0055]">O MERCADO</span>
            <br />
            <span className="text-white opacity-[0.85]">
              COPIA.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-10 max-w-2xl text-[18px] font-medium leading-[1.6] text-[#999] sm:text-xl px-4">
            O hub definitivo para automação de elite no Discord. Performance absoluta, infraestrutura inabalável e a experiência de usuário mais sofisticada do mercado.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-nowrap">
            <a href="#produtos" className="ds-btn ds-btn-primary ds-btn-lg w-full sm:w-auto px-10">
              <span className="flex items-center gap-2.5 whitespace-nowrap"><ArrowRight className="h-5 w-5 shrink-0" /> INICIAR EXPERIÊNCIA</span>
            </a>
            <a href={guildInvite} target="_blank" rel="noreferrer" className="ds-btn ds-btn-secondary ds-btn-lg w-full sm:w-auto px-10">
              <span className="flex items-center gap-2.5 whitespace-nowrap">DOCUMENTAÇÃO <ArrowRight className="h-5 w-5 shrink-0 rotate-90" /></span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-20 flex flex-wrap items-center justify-center sm:justify-between border-t border-white/5 pt-8 gap-4 text-[9px] font-bold text-[#444] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
              <span>SPECTRE HUB</span>
              <span className="opacity-20">//</span>
              <span>AGO/2026</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="opacity-20">©</span>
              <span>PROPERTY OF SPECTRE. ALL RIGHTS RESERVED.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {fallbackMembers.slice(0, 5).map((m) => (
                <div
                  key={m}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#050505] bg-white/10"
                >
                  <Avatar seed={m} />
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
              comunidade ativa no discord
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={380}>
        <div className="relative mx-auto mt-16 max-w-5xl">
          <HeroPreview />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent"
          />
        </div>
      </Reveal>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[#ff0055]/10 blur-[90px]"
      />
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10 shrink-0" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10 shrink-0" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10 shrink-0" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f] truncate">
            hub / automation
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-[84px_1fr] gap-3 p-4">
          <div className="hidden xs:flex xs:flex-col space-y-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5">
            <div className="h-1.5 w-full rounded-full bg-[#ff0055]/70" />
            {[80, 65, 72, 50, 60].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/[0.08]" style={{ width: `${w}%` }} />
            ))}
          </div>

          <div className="space-y-2.5">
            {[
              { l: "Assistir trailer — Fortnite", p: 100 },
              { l: "Jogar 15 min — Valorant", p: 64 },
              { l: "Assistir highlights — LoL", p: 27 },
            ].map((q) => (
              <div
                key={q.l}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
              >
                <div className="flex items-center justify-between text-[11px] text-[#d4d4d4]">
                  <span className="truncate pr-2">{q.l}</span>
                  <span className="font-mono text-[#8a8a8a]">{q.p}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[#ff0055]" style={{ width: `${q.p}%` }} />
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <svg viewBox="0 0 200 44" className="h-11 w-full" aria-hidden>
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff0055" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff0055" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 32 L30 27 L60 29 L90 19 L120 23 L150 11 L180 15 L200 7 L200 44 L0 44 Z"
                  fill="url(#spark)"
                />
                <path
                  d="M0 32 L30 27 L60 29 L90 19 L120 23 L150 11 L180 15 L200 7"
                  fill="none"
                  stroke="#ff0055"
                  strokeWidth="1.4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 z-30 hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:block">
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#6f6f6f]">
          status
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff0055]" />
          Rodando em background
        </div>
      </div>
    </div>
  );
}
