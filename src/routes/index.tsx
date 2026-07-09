import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neighborshub — Auto Quests do Discord" },
      {
        name: "description",
        content:
          "Complete missões do Discord automaticamente e acumule Orbs. Planos Free, Premium (30 dias ou lifetime) e Boost.",
      },
      { property: "og:title", content: "Neighborshub — Auto Quests do Discord" },
      {
        property: "og:description",
        content:
          "Automatize missões do Discord no navegador. Planos Free, Premium e Boost.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PLANS = [
  {
    name: "Free",
    price: "R$ 0",
    period: "sempre",
    tone: "border-white/10 bg-white/[0.03]",
    accent: "text-slate-300",
    cta: "Começar grátis",
    highlight: false,
    features: [
      "3 missões por dia",
      "Cooldown de 10 min entre missões",
      "Todos os tipos de quest (vídeo e jogo)",
      "Histórico local no navegador",
    ],
  },
  {
    name: "Premium",
    price: "R$ 9,90",
    period: "30 dias",
    tone: "border-[#5865F2]/50 bg-[#5865F2]/[0.08]",
    accent: "text-[#a5b4fc]",
    cta: "Assinar 30 dias",
    highlight: true,
    features: [
      "Missões ilimitadas por dia",
      "Cooldown de apenas 3 min",
      "Cargo Premium no Discord",
      "Expira automaticamente após 30 dias",
    ],
  },
  {
    name: "Lifetime",
    price: "R$ 99",
    period: "pagamento único",
    tone: "border-amber-400/40 bg-amber-400/[0.06]",
    accent: "text-amber-200",
    cta: "Comprar lifetime",
    highlight: false,
    features: [
      "Todos os benefícios Premium",
      "Cargo permanente — sem expiração",
      "Cooldown de 3 min entre missões",
      "Prioridade em novos recursos",
    ],
  },
  {
    name: "Boost",
    price: "Grátis",
    period: "boost o servidor",
    tone: "border-pink-500/40 bg-pink-500/[0.06]",
    accent: "text-pink-200",
    cta: "Boost o servidor",
    highlight: false,
    features: [
      "Missões ilimitadas por dia",
      "Cooldown mínimo de 1 min",
      "Cargo Booster automático",
      "Se remover o boost, perde o acesso",
    ],
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(600px 400px at 15% 10%, rgba(88,101,242,0.25), transparent 60%), radial-gradient(500px 350px at 85% 20%, rgba(235,69,158,0.15), transparent 60%)",
        }}
      />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#5865F2] font-black text-white shadow-lg shadow-indigo-500/30">
            N
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Neighbors<span className="text-[#5865F2]">hub</span>
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
          <a href="#planos" className="hover:text-white">Planos</a>
          <a href="#como-funciona" className="hover:text-white">Como funciona</a>
          <a href="#aviso" className="hover:text-white">Aviso</a>
        </nav>
        <Link
          to="/hub"
          className="rounded-md bg-[#5865F2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4752c4] sm:px-4 sm:text-sm"
        >
          Abrir Hub
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Auto Quests · Detecção de plano em tempo real
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            Complete missões do Discord
            <br />
            <span className="bg-gradient-to-r from-[#5865F2] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
              e acumule Orbs no automático.
            </span>
          </h1>
          <p className="mt-5 text-base text-slate-400 sm:mt-6 sm:text-lg md:text-xl">
            Faça login com seu Discord, escolha um plano e deixe o hub farmar quests de vídeo e jogo pra você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/hub"
              className="rounded-lg bg-[#5865F2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
            >
              Abrir o Hub
            </Link>
            <a
              href="#planos"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Planos</h2>
          <p className="mt-3 text-slate-400">
            Detectamos seu cargo no Discord em tempo real. Se o Premium expirar (30 dias) ou você
            perder o Boost, o hub volta pro Free automaticamente.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-xl border p-6 transition ${p.tone} ${p.highlight ? "ring-1 ring-[#5865F2]/40" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-[#5865F2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  popular
                </span>
              )}
              <div className={`font-mono text-xs uppercase tracking-widest ${p.accent}`}>
                {p.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">{p.price}</span>
                <span className="text-xs text-slate-400">/ {p.period}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={p.accent}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/hub"
                className={`mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold transition hover:bg-white/10 ${p.highlight ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "text-white"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
          <span className="text-slate-200">Como funciona a expiração:</span> Premium mensal libera o
          cargo no Discord por 30 dias — no dia 31, o bot remove o cargo e o hub detecta em até 1
          minuto, voltando pro Free. Lifetime nunca é removido. Boost segue enquanto você mantiver
          o servidor boostado.
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Como funciona</h2>
        <p className="mt-3 max-w-2xl text-slate-400">Três passos.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Entre no hub",
              body: "Cole seu token do Discord (fica só no seu navegador) ou faça login com email e senha.",
            },
            {
              n: "02",
              title: "Escolha um plano",
              body: "Free pra testar. Premium ou Lifetime pra remover o limite diário. Boost pro cooldown mínimo.",
            },
            {
              n: "03",
              title: "Deixe rodar",
              body: "O hub detecta seu cargo em tempo real, executa as quests disponíveis e mostra o progresso.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#5865F2]/20 px-2 py-1 font-mono text-xs text-[#a5b4fc]">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aviso */}
      <section id="aviso" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-300">
                Uso por sua conta e risco
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Automatizar a API do Discord com o token da sua conta pessoal viola os{" "}
                <a
                  href="https://discord.com/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-yellow-400/50 hover:text-white"
                >
                  Termos de Serviço do Discord
                </a>{" "}
                (self-bots) e pode resultar em suspensão da conta. Este projeto é
                educacional. Nunca compartilhe seu token com terceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-6">
          Neighborshub · Auto Quests do Discord.
        </div>
      </footer>
    </div>
  );
}
