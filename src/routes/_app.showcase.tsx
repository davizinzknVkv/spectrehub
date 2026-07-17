import { createFileRoute } from "@tanstack/react-router";
import { Zap, Shield, Rocket, Cpu, Sparkles, Wifi } from "lucide-react";

export const Route = createFileRoute("/_app/showcase")({
  component: ShowcasePage,
});

const MARQUEE_ITEMS = [
  "NEIGHBORSHUB",
  "// CYBER TOOLS",
  "24/7 ONLINE",
  "DISCORD QUESTS",
  "FARM MODE",
  "SPOTIFY GEN",
  "FAKE PHOTO",
  "// NEON",
];

const CARDS = [
  { icon: Zap, title: "Velocidade", desc: "Execução instantânea de missões.", tone: "cyan" as const },
  { icon: Shield, title: "Segurança", desc: "Tokens criptografados localmente.", tone: "purple" as const },
  { icon: Rocket, title: "Automação", desc: "Farm contínuo sem esforço.", tone: "cyan" as const },
  { icon: Cpu, title: "Performance", desc: "Otimizado para uso 24/7.", tone: "purple" as const },
  { icon: Sparkles, title: "Recursos", desc: "Ferramentas exclusivas premium.", tone: "purple" as const },
  { icon: Wifi, title: "Uptime", desc: "Servidores redundantes globais.", tone: "cyan" as const },
];

function ShowcasePage() {
  return (
    <div className="space-y-12">
      {/* Marquee — pause on hover */}
      <section
        className="group relative overflow-hidden rounded-2xl border border-purple/30 py-5 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--surface) 70%, transparent), color-mix(in oklab, var(--surface-2) 60%, transparent))",
          boxShadow:
            "inset 0 0 60px -20px color-mix(in oklab, var(--purple) 55%, transparent), 0 0 40px -16px color-mix(in oklab, var(--cyan) 40%, transparent)",
        }}
      >
        <div className="flex w-max whitespace-nowrap marquee will-change-transform [transform:translateZ(0)] group-hover:[animation-play-state:paused]">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span
              key={i}
              className="mx-8 font-mono text-sm uppercase tracking-[0.4em] text-ink-dim"
            >
              <span className="text-cyan">◆</span>{" "}
              <span className={i % 2 === 0 ? "text-ink" : "text-purple"}>{t}</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24"
          style={{ background: "linear-gradient(90deg, var(--void), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24"
          style={{ background: "linear-gradient(-90deg, var(--void), transparent)" }}
        />
      </section>

      {/* Cards — advanced hover */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-mute">
              // features
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              <span className="gradient-text">Recursos neon</span>
            </h2>
          </div>
        </div>

        <div className="card-grid">
          {CARDS.map(({ icon: Icon, title, desc, tone }) => (
            <article
              key={title}
              tabIndex={0}
              className="neon-card group relative overflow-hidden rounded-2xl border border-line p-5 backdrop-blur-xl focus:outline-none"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in oklab, var(--surface) 70%, transparent), color-mix(in oklab, var(--surface-2) 50%, transparent))",
                ["--tone" as string]: tone === "cyan" ? "var(--cyan)" : "var(--purple)",
              }}
            >
              {/* glow sweep */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100"
                style={{
                  background:
                    "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--tone) 25%, transparent), transparent 70%)",
                }}
              />
              {/* corner accents */}
              <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-cyan/60" />
              <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-purple/60" />
              <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-purple/60" />
              <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-cyan/60" />

              <div className="relative">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl border bg-background/40 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110"
                  style={{
                    borderColor: "color-mix(in oklab, var(--tone) 45%, transparent)",
                    color: "var(--tone)",
                    boxShadow: "0 0 22px -6px color-mix(in oklab, var(--tone) 60%, transparent)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-dim">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .neon-card {
          transition:
            transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.4s ease;
          will-change: transform;
        }
        .neon-card:hover,
        .neon-card:focus-visible {
          transform: translateY(-6px) scale(1.03);
          border-color: color-mix(in oklab, var(--tone) 55%, transparent);
          box-shadow:
            0 0 0 1px color-mix(in oklab, var(--tone) 45%, transparent),
            0 18px 40px -14px color-mix(in oklab, var(--cyan) 55%, transparent),
            0 30px 60px -20px color-mix(in oklab, var(--purple) 60%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .neon-card { transition: none; }
          .neon-card:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
