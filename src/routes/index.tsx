import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, CheckCircle2, Instagram, Send, Sparkles, Timer, Infinity as InfinityIcon, ArrowRight, Code2, Plug, MessageSquare, Copy, Check, ShieldCheck, Users, Activity } from "lucide-react";
import nghcLogo from "@/assets/nghc-logo.png.asset.json";

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
    links: [
      // Preload LCP — logo do hero — pra reduzir tempo de pintura.
      { rel: "preload", as: "image", href: nghcLogo.url, fetchPriority: "high" },
      // Antecipa handshake com o CDN do Discord (widget + avatares).
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
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
    accent: "text-[#c4b5fd]",
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
    tone: "border-[#818cf8]/50 bg-[#818cf8]/[0.08]",
    accent: "text-[#c4b5fd]",
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
    tone: "border-[#818cf8]/40 bg-[#818cf8]/[0.05]",
    accent: "text-[#c4b5fd]",
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
    tone: "border-[#818cf8]/40 bg-[#818cf8]/[0.05]",
    accent: "text-[#c4b5fd]",
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
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0c] text-slate-200 antialiased">
      {/* Background orbs — Vapor Chrome */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="orb-indigo -left-32 top-[-10rem] h-[34rem] w-[34rem]" />
        <div className="orb-cyan -right-32 top-[40%] h-[30rem] w-[30rem]" />
        <div className="orb-indigo bottom-[-12rem] left-1/3 h-[28rem] w-[28rem]" />
      </div>


      {/* Floating pill nav */}
      <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-3 sm:top-6 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-4 pr-2 shadow-[0_20px_60px_-30px_rgba(129,140,248,0.8)] backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={nghcLogo.url}
              alt="NGHC"
              className="h-9 w-9 shrink-0 rounded-lg object-contain transition-transform duration-300 hover:scale-110"
              style={{ filter: "drop-shadow(0 0 10px color-mix(in oklab, var(--blurple) 60%, transparent))" }}
            />
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              Neighbors<span className="chrome-text">hub</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#missoes" className="transition-colors duration-200 hover:text-[#a5f3fc]">Missões</a>
            <a href="#planos" className="transition-colors duration-200 hover:text-[#a5f3fc]">Planos</a>
            <a href="#membros" className="transition-colors duration-200 hover:text-[#a5f3fc]">Membros</a>
            <a href="#como-funciona" className="transition-colors duration-200 hover:text-[#a5f3fc]">Como funciona</a>
          </nav>
          <Link
            to="/hub"
            className="btn-chrome rounded-full px-5 py-2 text-xs sm:text-sm"
          >
            Abrir Hub
          </Link>
        </div>
      </header>


      {/* Hero — split style */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Complete missões pra
              <br />
              <span className="text-[#818cf8]">dominar o Discord.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              Auto-quests em segundo plano, detecção de plano em tempo real e farm de Orbs sem
              esforço. O Neighborshub roda o pesado — você só coleta.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hub"
                className="inline-flex items-center gap-2 rounded-md bg-[#818cf8] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
              >
                Abrir o Hub <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[#818cf8]/40 bg-[#818cf8]/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur transition hover:border-[#818cf8]/70 hover:bg-[#818cf8]/20"
              >
                Entrar no Discord
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {MEMBERS.slice(0, 5).map((m) => (
                  <div
                    key={m.seed}
                    className="grid h-7 w-7 place-items-center overflow-hidden rounded-full border-2 border-[#0b0d12] bg-white/10"
                  >
                    <Avatar seed={m.seed} />
                  </div>
                ))}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Já existem mais de 100 usuários usando o NGHC
              </div>
            </div>
          </div>

          {/* Big logo mark */}
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(400px 300px at 50% 50%, rgba(88,101,242,0.35), transparent 65%)",
              }}
            />

            {/* Orbit rings + spark particles */}
            <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
              <div
                className="h-[110%] w-[110%] rounded-full border border-[#a78bfa]/15"
                style={{ animation: "spin-slow 28s linear infinite" }}
              />
              <div
                className="absolute h-[85%] w-[85%] rounded-full border border-[#818cf8]/20"
                style={{ animation: "spin-slow 22s linear infinite reverse" }}
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-[#c4b5fd]"
                  style={{
                    boxShadow: "0 0 12px 2px #a78bfa",
                    top: `${20 + i * 12}%`,
                    left: `${15 + i * 15}%`,
                    animation: `spark-float ${3 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
                  }}
                />
              ))}
            </div>

            <div className="relative text-center">
              {/* Purple lightning bolt striking the logo */}
              <svg
                aria-hidden
                viewBox="0 0 100 200"
                className="pointer-events-none absolute -top-16 left-1/2 -z-[1] h-56 w-28 -translate-x-1/2 sm:h-72 sm:w-36 md:-top-24 md:h-96 md:w-48"
                style={{ animation: "lightning-flash 3.2s ease-in-out infinite" }}
              >
                <defs>
                  <linearGradient id="bolt-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#c4b5fd" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <filter id="bolt-glow" x="-60%" y="-20%" width="220%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M62 4 L28 96 L48 96 L34 168 L74 74 L52 74 L66 4 Z"
                  fill="url(#bolt-grad)"
                  filter="url(#bolt-glow)"
                  stroke="#e9d5ff"
                  strokeWidth="0.8"
                />
              </svg>

              {/* Impact flash where the bolt hits */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 rounded-full sm:top-10 sm:h-24 sm:w-24 md:h-32 md:w-32"
                style={{
                  background:
                    "radial-gradient(circle, rgba(196,181,253,0.85), rgba(139,92,246,0.35) 45%, transparent 70%)",
                  filter: "blur(6px)",
                  animation: "impact-pulse 3.2s ease-in-out infinite",
                }}
              />

              <img
                src={nghcLogo.url}
                alt="NGHC"
                className="relative mx-auto h-40 w-40 object-contain sm:h-56 sm:w-56 md:h-72 md:w-72 float-soft"
                style={{
                  filter:
                    "drop-shadow(0 0 30px rgba(167,139,250,0.55)) drop-shadow(0 20px 60px color-mix(in oklab, var(--blurple) 55%, transparent))",
                }}
              />
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
                neighborshub
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rotate-45">
              <div className="grid h-6 w-6 place-items-center border border-[#818cf8]/60">
                <span className="block h-1.5 w-1.5 rounded-sm bg-[#818cf8]" />
              </div>
            </div>

            <style>{`
              @keyframes lightning-flash {
                0%, 100% { opacity: 0; transform: translate(-50%, -12px) scale(0.9); }
                6%       { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
                10%      { opacity: 0.35; }
                14%      { opacity: 1; transform: translate(-50%, 2px) scale(1); }
                22%      { opacity: 0; }
                92%      { opacity: 0; }
              }
              @keyframes impact-pulse {
                0%, 100% { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
                8%       { opacity: 1; transform: translate(-50%, 0) scale(1.15); }
                20%      { opacity: 0; transform: translate(-50%, 0) scale(1.4); }
              }
              @keyframes spin-slow {
                to { transform: rotate(360deg); }
              }
              @keyframes spark-float {
                0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                50%      { transform: translate(6px, -8px); opacity: 1; }
              }
              @media (prefers-reduced-motion: reduce) {
                svg[viewBox="0 0 100 200"],
                [style*="impact-pulse"],
                [style*="spin-slow"],
                [style*="spark-float"] { animation: none !important; }
              }
            `}</style>
          </div>
        </div>



        {/* Stats row */}
        <LiveStatsRow />

      </section>


      {/* Missões — split section like image 1 */}
      <section id="missoes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#c4b5fd]">
              <Sparkles className="h-3 w-3" /> auto quests
            </div>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Missões do Discord no <span className="text-[#818cf8]">automático</span>, num só lugar
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
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#818cf8]" />
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
                  <div className="h-2 w-full rounded bg-[#818cf8]/60" />
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
                    { l: "Jogue Valorant 15 min", p: 62, tone: "bg-[#818cf8]" },
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
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 30 L 30 25 L 60 27 L 90 18 L 120 22 L 150 10 L 180 14 L 200 6 L 200 40 L 0 40 Z"
                        fill="url(#ln)"
                      />
                      <path
                        d="M0 30 L 30 25 L 60 27 L 90 18 L 120 22 L 150 10 L 180 14 L 200 6"
                        fill="none"
                        stroke="#c4b5fd"
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

      {/* Membros — grid cards + cursor diamante */}
      <MembersSection />
      {/* Estatísticas em Tempo Real */}
      <section id="stats" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c4b5fd]" />
            Ao vivo
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Estatísticas em Tempo Real
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Dados atualizados da nossa API em tempo real
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              value: "18.042",
              label: "Licenças Criadas",
              desc: "Número total de licenças válidas geradas para nossos clientes, garantindo autenticidade e suporte oficial para todos os produtos adquiridos.",
            },
            {
              icon: ShieldCheck,
              value: "150",
              label: "Tentativas de Crack",
              desc: "Tentativas de violação de segurança bloqueadas pelo nosso sistema de proteção avançado, garantindo a integridade dos nossos produtos.",
            },
            {
              icon: Users,
              value: "+100",
              label: "Usuários Ativos",
              desc: "Comunidade crescente de usuários farmando Orbs com o Neighborshub todos os dias, em servidores por todo o Brasil.",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#131624]/80 to-[#0b0d12]/60 p-6 text-center backdrop-blur-xl transition hover:border-[#818cf8]/40 hover:shadow-[0_20px_60px_-20px_rgba(88,101,242,0.45)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-40 w-40 rounded-full bg-[#818cf8]/20 blur-3xl opacity-0 transition group-hover:opacity-100"
                />
                <div
                  className="relative mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[#818cf8] text-white shadow-lg shadow-indigo-500/40"
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="relative mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {s.value}
                </div>
                <div className="relative mt-1.5 text-sm font-semibold text-[#c4b5fd]">
                  {s.label}
                </div>
                <p className="relative mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Planos — estilo "featured product" com tabs */}
      <PlansShowcase />




      {/* Por que Neighborshub — 2x2 feature grid */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
            <span className="h-3 w-0.5 bg-[#818cf8]" /> por que neighborshub
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Feito por quem vive Discord cheio.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Cada sistema nasce de quem joga, farma e aguenta o tranco junto com você.
          </p>
        </div>

        <div className="relative mt-10 grid gap-4 md:grid-cols-2">
          <div
            aria-hidden
            className="pointer-events-none absolute right-8 top-6 select-none font-black text-white/[0.03] text-[120px] leading-none"
          >
            0.00
          </div>
          {[
            {
              icon: Zap,
              title: "Performance real",
              body: "0.00ms de impacto. Roda em background sem travar seu Discord nem seu PC.",
            },
            {
              icon: Code2,
              title: "Código limpo",
              body: "Tudo revisado antes de chegar no seu navegador. Zero gambiarra, zero conflito.",
            },
            {
              icon: Plug,
              title: "Standalone",
              body: "Compatível com qualquer cargo, plano ou servidor. Você entra e já está rodando.",
            },
            {
              icon: MessageSquare,
              title: "Suporte de gente",
              body: "Resposta rápida, direto com quem desenvolveu. Aqui ninguém fica na mão.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <Icon className="h-5 w-5 text-[#818cf8]" />
                <h3 className="mt-8 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cadastro Free */}
      <FreeSignup />


      {/* Aviso */}
      <section id="aviso" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[#818cf8]/25 bg-gradient-to-br from-[#818cf8]/[0.08] via-[#0b0d12]/60 to-[#0b0d12]/40 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#818cf8]/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#818cf8]/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
            <div
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#818cf8]/40 bg-[#818cf8]/15 text-2xl"
              style={{ boxShadow: "0 0 30px -6px rgba(88,101,242,0.55)" }}
            >
              ⚠️
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c4b5fd]" />
                Aviso
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Leia antes de usar o Neighborshub
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Automatizar a API do Discord com o token da sua conta pessoal viola os{" "}
                <a
                  href="https://discord.com/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#c4b5fd] underline decoration-[#818cf8]/60 underline-offset-2 transition hover:text-white"
                >
                  Termos de Serviço do Discord
                </a>{" "}
                (self-bots) e pode resultar em suspensão da conta. Este projeto é
                educacional — você é o único responsável pelo uso.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Sem garantias", d: "Uso oferecido como está, sem qualquer promessa de resultado." },
                  { t: "Token = sua responsabilidade", d: "Nunca compartilhe seu token com terceiros ou serviços desconhecidos." },
                  { t: "Não afiliado ao Discord", d: "Projeto independente, sem qualquer vínculo oficial." },
                  { t: "Uso educacional", d: "Feito para estudo e automação pessoal — use com bom senso." },
                ].map((item) => (
                  <li
                    key={item.t}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 backdrop-blur"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#818cf8]" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-white">
                        {item.t}
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {item.d}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                <img
                  src={nghcLogo.url}
                  alt="NGHC"
                  className="h-10 w-10 object-contain"
                  style={{ filter: "drop-shadow(0 0 12px color-mix(in oklab, var(--blurple) 55%, transparent))" }}
                />
                <span className="text-lg font-semibold tracking-tight">
                  Neighbors<span className="text-[#c4b5fd]">hub</span>
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
              <span className="mx-2 text-slate-700">·</span>
              Código-fonte fornecido por{" "}
              <span className="font-semibold text-[#c4b5fd]">isnouu</span>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

function useInView<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);
  return [ref, inView];
}

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

// ---- Live stats: cache + auto-refresh ----
const STATS_CACHE_KEY = "nghc:home-stats:v2";
const STATS_TTL_MS = 60_000;
const WIDGET_URL = "https://discord.com/api/guilds/1511467436543709184/widget.json";

type StatsSnapshot = { latency: number; members: number; quests: number; ts: number };

const DEFAULT_STATS: StatsSnapshot = { latency: 0.42, members: 120, quests: 240, ts: 0 };

function clampLatency(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0.1;
  // Scale roundtrip → perceived background impact, cap at 0.89ms, 2dp.
  const scaled = ms / 100;
  return Math.min(0.89, Math.max(0.05, Math.round(scaled * 100) / 100));
}

function readCache(): StatsSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StatsSnapshot;
    if (typeof parsed?.latency !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(snap: StatsSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(snap));
  } catch {
    /* ignore quota */
  }
}

async function fetchLiveStats(signal: AbortSignal): Promise<Partial<StatsSnapshot>> {
  const samples: number[] = [];
  let members: number | undefined;
  for (let i = 0; i < 3; i++) {
    const t0 = performance.now();
    const r = await fetch(WIDGET_URL, { signal, cache: "no-store" });
    samples.push(performance.now() - t0);
    if (i === 0 && r.ok) {
      try {
        const j = (await r.clone().json()) as { presence_count?: number };
        if (typeof j.presence_count === "number" && j.presence_count > 0) {
          members = Math.max(100, j.presence_count);
        }
      } catch {
        /* ignore */
      }
    }
  }
  samples.sort((a, b) => a - b);
  return { latency: clampLatency(samples[1]), members, ts: Date.now() };
}

function LiveStatsRow() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const cached = useRef<StatsSnapshot | null>(null);

  const [stats, setStats] = useState<StatsSnapshot>(DEFAULT_STATS);
  const [hasFresh, setHasFresh] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  // Cache só é lido depois da hidratação pra não divergir do HTML do servidor.
  useEffect(() => {
    const snap = readCache();
    if (snap) {
      cached.current = snap;
      setStats(snap);
      setHasFresh(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;


    const refresh = async () => {
      if (inFlight.current) return; // dedupe
      const ctrl = new AbortController();
      inFlight.current = ctrl;
      try {
        const next = await fetchLiveStats(ctrl.signal);
        if (!mounted) return;
        setStats((prev) => {
          const merged: StatsSnapshot = {
            latency: next.latency ?? prev.latency,
            members: next.members ?? prev.members,
            quests: prev.quests,
            ts: next.ts ?? Date.now(),
          };
          writeCache(merged);
          return merged;
        });
        setHasFresh(true);
      } catch {
        // keep cache on failure
      } finally {
        if (inFlight.current === ctrl) inFlight.current = null;
      }
    };

    refresh();
    const iv = window.setInterval(refresh, STATS_TTL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mounted = false;
      window.clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, []);

  const showSkeleton = !hasFresh && !cached.current;

  const quests = useCountUp(stats.quests, inView);
  const membersC = useCountUp(stats.members, inView);
  const ms = useCountUp(stats.latency, inView);

  return (
    <div
      ref={ref}
      className="mt-20 grid grid-cols-1 gap-0 border-y border-white/10 sm:grid-cols-3"
    >
      <StatCell
        loading={showSkeleton}
        skeletonKind="int"
        value={`${Math.round(quests)}+`}
        label="quests suportadas"
      />
      <StatCell
        loading={showSkeleton}
        skeletonKind="int"
        border
        value={`${Math.round(membersC)}+`}
        label="membros ativos"
      />
      <StatCell
        loading={showSkeleton}
        skeletonKind="ms"
        border
        pulse={!hasFresh}
        value={
          <>
            {ms.toFixed(2)}
            <span className="text-[#818cf8]">ms</span>
          </>
        }
        label="de impacto no discord"
      />
    </div>
  );
}

function StatSkeleton({ kind }: { kind: "int" | "ms" }) {
  const width = kind === "ms" ? "w-32 sm:w-44" : "w-20 sm:w-28";
  return (
    <div
      className={`${width} h-9 sm:h-12 rounded-md shimmer opacity-70`}
      aria-hidden
    />
  );
}

function StatCell({
  value,
  label,
  border,
  loading,
  pulse,
  skeletonKind = "int",
}: {
  value: React.ReactNode;
  label: string;
  border?: boolean;
  loading?: boolean;
  pulse?: boolean;
  skeletonKind?: "int" | "ms";
}) {
  return (
    <div className={`px-4 py-8 sm:px-8 sm:py-10 ${border ? "sm:border-l border-white/10" : ""}`}>
      <div className="text-3xl font-black tracking-tight tabular-nums sm:text-5xl min-h-[2.5rem] sm:min-h-[3.5rem] transition-opacity duration-300">
        {loading ? <StatSkeleton kind={skeletonKind} /> : value}
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {(loading || pulse) && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#818cf8]" />
        )}
        {label}
      </div>
    </div>
  );
}

function MembersSection() {

  const [live, setLive] = useState<Array<{ id: string; name: string; avatar: string | null; status: string }> | null>(null);
  const [presence, setPresence] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://discord.com/api/guilds/1511467436543709184/widget.json", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || !Array.isArray(j.members)) return;
        setPresence(typeof j.presence_count === "number" ? j.presence_count : null);
        setLive(
          j.members.map((m: { id: string; username: string; avatar_url: string | null; status: string }) => ({
            id: m.id,
            name: m.username,
            avatar: m.avatar_url,
            status: m.status,
          })),
        );
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const list = live ?? MEMBERS.map((m) => ({ id: m.seed, name: m.name, avatar: null as string | null, status: "online" }));
  const loop = [...list, ...list];

  return (
    <section id="membros" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 backdrop-blur">
            membros {presence !== null && <span className="text-[#c4b5fd]">· {presence} online</span>}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Quem já está no servidor
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {live ? "Membros online agora, direto do Discord." : "Alguns destaques da comunidade."}
          </p>
        </div>
      </div>

      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0b0d12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0b0d12] to-transparent" />

        <div className="flex gap-3 animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
          {loop.map((m, i) => (
            <div
              key={`${m.id}-${i}`}
              className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-5 backdrop-blur-md"
            >
              <div className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                {m.avatar ? (
                  <img src={m.avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <Avatar seed={m.id} />
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0d12] ${
                    m.status === "online"
                      ? "bg-[#818cf8]"
                      : m.status === "idle"
                        ? "bg-[#c4b5fd]"
                        : m.status === "dnd"
                          ? "bg-[#4752c4]"
                          : "bg-slate-500"
                  }`}
                />
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-white">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="glass-panel p-6 md:p-8">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
              <span className="h-3 w-0.5 bg-[#818cf8]" /> ao vivo
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Servidor oficial no Discord
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Widget conectado direto à guilda. Entra, farma missão e conversa com quem já tá dentro.
            </p>
            <a
              href={GUILD_INVITE}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#818cf8] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
            >
              Entrar no servidor <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="glass-frame mx-auto w-full max-w-[380px]">
            <iframe
              src="https://discord.com/widget?id=1511467436543709184&theme=dark"
              width={350}
              height={500}
              title="Discord widget"
              loading="lazy"
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto block h-[500px] w-full max-w-[350px] rounded-xl"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}



function PlansShowcase() {
  const [active, setActive] = useState(1);
  const plan = PLANS[active];

  return (
    <section id="planos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
            <span className="h-1 w-1 rounded-full bg-[#818cf8]" /> planos
          </div>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Tudo pronto pra <br className="hidden sm:block" />
            <span className="text-slate-400">subir de plano.</span>
          </h2>
        </div>
        <div className="hidden shrink-0 rotate-45 md:block">
          <div className="grid h-12 w-12 place-items-center border border-[#818cf8]/50">
            <span className="block h-2 w-2 rounded-sm bg-[#818cf8]" />
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* topbar dots + tabs */}
        <div className="flex items-center gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {PLANS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActive(i)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  i === active
                    ? "border-b-2 border-[#818cf8] text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {p.name.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#131624]/60 to-[#0b0d12]/60 p-6 backdrop-blur">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(400px 240px at 80% 20%, rgba(88,101,242,0.35), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className={`inline-flex rounded-md bg-[#818cf8]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${plan.accent}`}>
                {plan.highlight ? "mais popular" : "plano"}
              </div>
              <h3 className="mt-4 text-5xl font-black uppercase leading-none tracking-tight">
                {plan.name}
              </h3>
              <div className="mt-4 h-px w-16 bg-[#818cf8]" />
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#818cf8]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <div>
              <div className={`font-mono text-[10px] uppercase tracking-[0.3em] ${plan.accent}`}>
                standalone · {plan.period}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-3xl font-black">{plan.price}</div>
                <span className="text-xs text-slate-500">/ {plan.period}</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Detectamos seu cargo no Discord em tempo real. Se expirar, o hub volta pro Free
                automaticamente.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-xs text-slate-300 sm:grid-cols-2">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#818cf8]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {plan.name === "Free" ? (
              <a
                href="#free"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#818cf8] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
              >
                Cadastrar no Free <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link
                to="/hub"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#818cf8] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const GUILD_INVITE = "https://discord.com/invite/fVeXNmmF";

function FreeSignup() {
  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const clean = { name: name.trim().slice(0, 40), discord: discord.trim().slice(0, 40) };
    if (!clean.name || !clean.discord) return;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const c = `FREE-${rand}`;
    try {
      localStorage.setItem(
        "nh:free-signup",
        JSON.stringify({ ...clean, code: c, at: new Date().toISOString() }),
      );
    } catch {}
    setCode(c);
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <section id="free" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="glass-panel-strong grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">
            <span className="h-3 w-0.5 bg-emerald-400" /> cadastro free
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Ganhe o cargo <span className="text-emerald-400">Free</span> em 1 minuto
          </h2>
          <ol className="mt-6 space-y-3 text-sm text-slate-300">
            {[
              "Preencha o formulário ao lado — geramos um código único pra você.",
              "Entre no servidor e abra um ticket no canal de suporte.",
              "Informe o código no ticket. A staff libera o cargo Free na hora.",
            ].map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-500/15 font-mono text-[11px] font-bold text-emerald-300">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass-panel p-5">
          {!code ? (
            <form onSubmit={generate} className="space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Seu nome
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  required
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#818cf8]"
                  placeholder="Ex: davizinzkn"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Seu usuário do Discord
                </span>
                <input
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  maxLength={40}
                  required
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#818cf8]"
                  placeholder="@usuario"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-md bg-[#818cf8] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
              >
                Gerar meu código Free
              </button>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Ao cadastrar, você guarda o código no navegador e pode ir direto pro servidor abrir
                o ticket.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Seu código Free
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <code className="flex-1 font-mono text-lg font-bold tracking-widest text-emerald-300">
                    {code}
                  </code>
                  <button
                    onClick={copy}
                    className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
                    aria-label="Copiar código"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Abra um ticket no servidor e cole esse código na primeira mensagem. A staff libera o
                cargo Free assim que confirmar.
              </p>
              <a
                href={GUILD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#818cf8] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
              >
                Ir pro servidor abrir ticket <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => {
                  setCode(null);
                  setName("");
                  setDiscord("");
                }}
                className="w-full text-center text-[11px] font-mono uppercase tracking-widest text-slate-500 transition hover:text-slate-300"
              >
                Gerar outro código
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


