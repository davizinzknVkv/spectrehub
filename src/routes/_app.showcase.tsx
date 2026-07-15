import { createFileRoute } from "@tanstack/react-router";
import { Zap, Shield, Rocket, Cpu } from "lucide-react";

export const Route = createFileRoute("/_app/showcase")({
  component: ShowcasePage,
});

const MARQUEE_ITEMS = [
  "NEIGHBORSHUB",
  "// NEON",
  "CYBER TOOLS",
  "24/7 ONLINE",
  "DISCORD QUESTS",
  "FARM MODE",
  "SPOTIFY GEN",
];

const CARDS = [
  { icon: Zap, title: "Velocidade", desc: "Execução instantânea de missões.", tone: "cyan" as const },
  { icon: Shield, title: "Segurança", desc: "Tokens criptografados localmente.", tone: "purple" as const },
  { icon: Rocket, title: "Automação", desc: "Farm contínuo sem esforço.", tone: "cyan" as const },
  { icon: Cpu, title: "Performance", desc: "Otimizado para uso 24/7.", tone: "purple" as const },
];

function ShowcasePage() {
  return (
    <div className="space-y-10">
      {/* Marquee */}
      <section
        className="relative overflow-hidden rounded-2xl border border-purple/30 bg-surface/50 py-4"
        style={{
          boxShadow:
            "inset 0 0 40px -12px color-mix(in oklab, var(--purple) 50%, transparent), 0 0 30px -12px color-mix(in oklab, var(--cyan) 40%, transparent)",
        }}
      >
        <div className="flex whitespace-nowrap marquee">
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
          style={{ background: "linear-gradient(90deg, var(--surface), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24"
          style={{ background: "linear-gradient(-90deg, var(--surface), transparent)" }}
        />
      </section>

      {/* Cards */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
          <span className="gradient-text">Recursos</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, desc, tone }) => (
            <article
              key={title}
              className="card-hover group relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    tone === "cyan"
                      ? "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--cyan) 20%, transparent), transparent 70%)"
                      : "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--purple) 22%, transparent), transparent 70%)",
                }}
              />
              <div className="relative">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl border ${
                    tone === "cyan"
                      ? "border-cyan/40 text-cyan"
                      : "border-purple/40 text-purple"
                  } bg-background/40`}
                  style={{
                    boxShadow: `0 0 22px -6px color-mix(in oklab, var(--${tone}) 60%, transparent)`,
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
    </div>
  );
}
