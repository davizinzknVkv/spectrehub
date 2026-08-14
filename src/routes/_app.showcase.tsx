import { createFileRoute } from "@tanstack/react-router";
import { Zap, Shield, Rocket, Cpu, Sparkles, Wifi } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

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
  { icon: Zap, title: "Velocidade", desc: "Execução instantânea de missões." },
  { icon: Shield, title: "Segurança", desc: "Tokens criptografados localmente." },
  { icon: Rocket, title: "Automação", desc: "Farm contínuo sem esforço." },
  { icon: Cpu, title: "Performance", desc: "Otimizado para uso 24/7." },
  { icon: Sparkles, title: "Recursos", desc: "Ferramentas exclusivas premium." },
  { icon: Wifi, title: "Uptime", desc: "Servidores redundantes globais." },
];

function ShowcasePage() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="// showcase" title="Recursos" highlight="da plataforma" />

      {/* Marquee — pause on hover */}
      <section className="group relative overflow-hidden rounded-2xl border border-[var(--border-1)] bg-[var(--surface-1)] py-5">
        <div className="flex w-max min-w-0 whitespace-nowrap marquee will-change-transform [transform:translateZ(0)] group-hover:[animation-play-state:paused]">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} className="mx-8 font-mono text-sm uppercase tracking-[0.4em] text-[var(--text-2)]">
              <span className="text-[var(--primary)]">◆</span>{" "}
              <span className={i % 2 === 0 ? "text-[var(--text-1)]" : "text-[var(--primary)]"}>{t}</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24"
          style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24"
          style={{ background: "linear-gradient(-90deg, var(--bg), transparent)" }}
        />
      </section>

      {/* Cards */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="ds-label">// features</p>
            <h2 className="ds-h2 mt-1">Recursos</h2>
          </div>
        </div>

        <div className="ds-grid-3">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <article key={title} tabIndex={0} className="ds-card ds-card-hover focus:outline-none">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-1)] bg-white/[0.03] text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="ds-h3 mt-4">{title}</h3>
              <p className="mt-1 ds-body">{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
