import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, CheckCircle2, Instagram, Send, Sparkles, Timer, Infinity as InfinityIcon, ArrowRight } from "lucide-react";

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
          "Complete missões do Discord automaticamente e acumule Orbs. Planos Free, Premium (30 dias ou lifetime) e Boost.",
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
    price: "R$ 39,90",
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

// Membros “destaque” do servidor — usa avatares gerados por hash (dicebear)
const MEMBERS = [
  { name: "davizinzkn", seed: "davizinzkn", tone: "from-indigo-500/40 to-fuchsia-500/20" },
  { name: "rd9m", seed: "rd9m", tone: "from-sky-500/40 to-blue-800/20" },
  { name: "fuam", seed: "fuam", tone: "from-emerald-500/30 to-cyan-500/20" },
  { name: "felipe", seed: "felipe", tone: "from-orange-500/40 to-red-500/20" },
  { name: "biell", seed: "biell", tone: "from-teal-500/40 to-emerald-800/20" },
  { name: "VALE DA LUA VIPS", seed: "vale-lua", tone: "from-purple-500/50 to-fuchsia-800/20" },
  { name: "lilith", seed: "lilith", tone: "from-rose-500/40 to-pink-800/20" },
  { name: "neo", seed: "neo", tone: "from-cyan-400/40 to-indigo-600/20" },
  { name: "kaz", seed: "kaz", tone: "from-amber-400/40 to-orange-700/20" },
  { name: "mira", seed: "mira", tone: "from-violet-500/40 to-indigo-800/20" },
  { name: "juno", seed: "juno", tone: "from-lime-400/30 to-emerald-700/20" },
  { name: "hex", seed: "hex", tone: "from-pink-500/40 to-purple-700/20" },
];

function Avatar({ seed }: { seed: string }) {
  return (
    <img
      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

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

      {/* Floating pill nav */}
      <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-3 sm:top-6 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0b0d12]/80 py-2 pl-4 pr-2 shadow-xl shadow-black/40 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#5865F2] to-[#a78bfa] font-black text-white shadow-lg shadow-indigo-500/30">
              N
            </div>
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              Neighbors<span className="text-[#a5b4fc]">hub</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#missoes" className="transition hover:text-white">Missões</a>
            <a href="#planos" className="transition hover:text-white">Planos</a>
            <a href="#membros" className="transition hover:text-white">Membros</a>
            <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
          </nav>
          <Link
            to="/hub"
            className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#0b0d12] transition hover:bg-white sm:text-sm"
          >
            Abrir Hub
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
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

      {/* Missões — split section like image 1 */}
      <section id="missoes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#a5b4fc]">
              <Sparkles className="h-3 w-3" /> auto quests
            </div>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Missões do Discord no <span className="text-[#5865F2]">automático</span>, num só lugar
            </h2>
            <p className="mt-4 max-w-lg text-slate-400">
              O hub detecta suas quests disponíveis, executa vídeo e jogo em background e mostra o
              progresso em tempo real — sem abrir cliente, sem ficar apertando botão.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                {
                  t: "Detecção automática",
                  d: "Lista todas as quests ativas do seu Discord — inclusive as regionais.",
                },
                {
                  t: "Execução em fila",
                  d: "Run all respeita o cooldown do seu plano e roda uma atrás da outra.",
                },
                {
                  t: "Progresso ao vivo",
                  d: "Barra por missão, log de eventos e histórico completo persistido.",
                },
              ].map((f) => (
                <li key={f.t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5865F2]" />
                  <div>
                    <div className="font-semibold text-white">{f.t}</div>
                    <div className="text-slate-400">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Illustration mock — monitor com missões */}
          <div className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#131624] to-[#0b0d12] p-4 shadow-2xl shadow-indigo-500/10">
              {/* topbar dots */}
              <div className="flex gap-1.5 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                {/* sidebar */}
                <div className="space-y-2 rounded-lg bg-white/[0.03] p-2">
                  <div className="h-2 w-full rounded bg-[#5865F2]/60" />
                  <div className="h-1.5 w-3/4 rounded bg-white/10" />
                  <div className="h-1.5 w-2/3 rounded bg-white/10" />
                  <div className="h-1.5 w-4/5 rounded bg-white/10" />
                  <div className="h-1.5 w-1/2 rounded bg-white/10" />
                </div>
                {/* content */}
                <div className="space-y-2">
                  {/* quest cards */}
                  {[
                    { l: "Assista Fortnite Trailer", p: 100, tone: "bg-emerald-500" },
                    { l: "Jogue Valorant 15 min", p: 62, tone: "bg-[#5865F2]" },
                    { l: "Assista LoL Highlights", p: 28, tone: "bg-fuchsia-500" },
                  ].map((q) => (
                    <div key={q.l} className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-300">
                        <span>{q.l}</span>
                        <span className="font-mono text-slate-400">{q.p}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full ${q.tone}`} style={{ width: `${q.p}%` }} />
                      </div>
                    </div>
                  ))}
                  {/* mini chart */}
                  <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                    <svg viewBox="0 0 200 40" className="h-10 w-full">
                      <defs>
                        <linearGradient id="ln" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#5865F2" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#5865F2" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 30 L 30 25 L 60 27 L 90 18 L 120 22 L 150 10 L 180 14 L 200 6 L 200 40 L 0 40 Z"
                        fill="url(#ln)"
                      />
                      <path
                        d="M0 30 L 30 25 L 60 27 L 90 18 L 120 22 L 150 10 L 180 14 L 200 6"
                        fill="none"
                        stroke="#a5b4fc"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* pedestal */}
            <div className="mx-auto mt-3 h-4 w-32 rounded-b-xl border-x border-b border-white/10 bg-white/[0.04]" />
            <div className="mx-auto h-px w-56 bg-white/10" />
          </div>
        </div>
      </section>

      {/* Membros — marquee like image 3 */}
      <section id="membros" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            desça a tela para ver mais
          </div>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Membros da comunidade
          </h2>
        </div>

        <div className="relative mt-8 overflow-hidden">
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0b0d12] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0b0d12] to-transparent" />

          <div className="flex gap-4 animate-[marquee_40s_linear_infinite]">
            {[...MEMBERS, ...MEMBERS].map((m, i) => (
              <div
                key={`${m.seed}-${i}`}
                className={`flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-gradient-to-r ${m.tone} py-1.5 pl-1.5 pr-5 backdrop-blur-sm`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white/20 bg-white/5">
                  <Avatar seed={m.seed} />
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-white">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
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
              icon: Zap,
            },
            {
              n: "02",
              title: "Escolha um plano",
              body: "Free pra testar. Premium ou Lifetime pra remover o limite diário. Boost pro cooldown mínimo.",
              icon: InfinityIcon,
            },
            {
              n: "03",
              title: "Deixe rodar",
              body: "O hub detecta seu cargo em tempo real, executa as quests disponíveis e mostra o progresso.",
              icon: Timer,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-[#5865F2]/20 text-[#a5b4fc]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-400">{s.body}</p>
              </div>
            );
          })}
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

      {/* Footer — like image 4 */}
      <footer className="border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#5865F2] to-[#a78bfa] font-black text-white shadow-lg shadow-indigo-500/30">
                  N
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  Neighbors<span className="text-[#a5b4fc]">hub</span>
                </span>
              </Link>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
                Infraestrutura de auto-quests para a comunidade Discord. Farm de Orbs sem esforço,
                com detecção de plano em tempo real.
              </p>
            </div>

            <div className="md:justify-self-end">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Links
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li><a href="#missoes" className="transition hover:text-white">Missões</a></li>
                <li><a href="#planos" className="transition hover:text-white">Planos</a></li>
                <li><a href="#membros" className="transition hover:text-white">Membros</a></li>
                <li><a href="#como-funciona" className="transition hover:text-white">Como funciona</a></li>
                <li><a href="#aviso" className="transition hover:text-white">Aviso</a></li>
                <li><Link to="/hub" className="transition hover:text-white">Abrir Hub</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/davizinzkn/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Neighborshub · Feito por{" "}
              <a
                href="https://www.instagram.com/davizinzkn/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#a78bfa] hover:text-white"
              >
                davizinzknTheGod
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
