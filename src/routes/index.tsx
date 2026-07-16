import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, CheckCircle2, Instagram, Send, Sparkles, Timer, Infinity as InfinityIcon, ArrowRight, Code2, Plug, MessageSquare, Copy, Check } from "lucide-react";

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
    accent: "text-[#a5b4fc]",
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
    tone: "border-[#5865F2]/40 bg-[#5865F2]/[0.05]",
    accent: "text-[#a5b4fc]",
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
    tone: "border-[#5865F2]/40 bg-[#5865F2]/[0.05]",
    accent: "text-[#a5b4fc]",
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
        <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0b0d12]/40 py-2 pl-4 pr-2 shadow-xl shadow-black/40 backdrop-blur-2xl">
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

      {/* Hero — split style */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Complete missões pra
              <br />
              <span className="text-[#5865F2]">dominar o Discord.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              Auto-quests em segundo plano, detecção de plano em tempo real e farm de Orbs sem
              esforço. O Neighborshub roda o pesado — você só coleta.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hub"
                className="inline-flex items-center gap-2 rounded-md bg-[#5865F2] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
              >
                Abrir o Hub <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur transition hover:bg-white/10"
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
                Já rodando em mais de 100 servidores
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
            <div className="text-center">
              <div className="text-[92px] font-black leading-none tracking-tighter text-white sm:text-[140px] md:text-[180px]">
                N<span className="text-[#5865F2]">H</span>
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
                neighborshub
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rotate-45">
              <div className="grid h-6 w-6 place-items-center border border-[#5865F2]/60">
                <span className="block h-1.5 w-1.5 rounded-sm bg-[#5865F2]" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-0 border-y border-white/10">
          {[
            { n: "200+", l: "quests suportadas" },
            { n: "100+", l: "membros ativos" },
            { n: "0.00ms", l: "de impacto no discord", accent: true },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`px-4 py-8 sm:px-8 sm:py-10 ${i > 0 ? "border-l border-white/10" : ""}`}
            >
              <div className="text-3xl font-black tracking-tight sm:text-5xl">
                {s.accent ? (
                  <>
                    0.00<span className="text-[#5865F2]">ms</span>
                  </>
                ) : (
                  s.n
                )}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {s.l}
              </div>
            </div>
          ))}
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

      {/* Membros — grid cards + cursor diamante */}
      <MembersSection />

      {/* Planos — estilo "featured product" com tabs */}
      <PlansShowcase />


      {/* Por que Neighborshub — 2x2 feature grid */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5b4fc]">
            <span className="h-3 w-0.5 bg-[#5865F2]" /> por que neighborshub
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
                <Icon className="h-5 w-5 text-[#5865F2]" />
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

function MembersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [live, setLive] = useState<Array<{ id: string; name: string; avatar: string | null; status: string }> | null>(null);
  const [presence, setPresence] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://discord.com/api/guilds/1511467436543709184/widget.json")
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
  }, []);


  useEffect(() => {
    const el = ref.current;
    const cur = cursorRef.current;
    if (!el || !cur) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      cur.style.transform = `translate3d(${e.clientX - rect.left - 14}px, ${e.clientY - rect.top - 14}px, 0) rotate(45deg)`;
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="membros" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 backdrop-blur">
          membros {presence !== null && <span className="text-emerald-400">· {presence} online</span>}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Quem já está no servidor
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          {live
            ? "Membros online agora, puxados direto do Discord."
            : "Ative o Widget do Servidor no Discord pra listar os membros ao vivo. Enquanto isso, alguns destaques:"}
        </p>
      </div>

      <div
        ref={ref}
        className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          ref={cursorRef}
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-20 grid h-7 w-7 place-items-center rounded-md border border-[#5865F2] bg-[#5865F2]/20 shadow-[0_0_20px_rgba(88,101,242,0.6)] transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <span className="block h-1.5 w-1.5 -rotate-45 rounded-sm bg-[#a5b4fc]" />
        </div>

        {(live ?? MEMBERS.map((m) => ({ id: m.seed, name: m.name, avatar: null as string | null, status: "online" }))).map((m) => (
          <div
            key={m.id}
            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {m.avatar ? (
                <img src={m.avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <Avatar seed={m.id} />
              )}
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0d12] ${
                  m.status === "online"
                    ? "bg-emerald-400"
                    : m.status === "idle"
                      ? "bg-amber-400"
                      : m.status === "dnd"
                        ? "bg-red-500"
                        : "bg-slate-500"
                }`}
              />
            </div>
            <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-200">
              {m.name}
            </span>
          </div>
        ))}
      </div>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5b4fc]">
            <span className="h-1 w-1 rounded-full bg-[#5865F2]" /> planos
          </div>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Tudo pronto pra <br className="hidden sm:block" />
            <span className="text-slate-400">subir de plano.</span>
          </h2>
        </div>
        <div className="hidden shrink-0 rotate-45 md:block">
          <div className="grid h-12 w-12 place-items-center border border-[#5865F2]/50">
            <span className="block h-2 w-2 rounded-sm bg-[#5865F2]" />
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
                    ? "border-b-2 border-[#5865F2] text-white"
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
              <div className={`inline-flex rounded-md bg-[#5865F2]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${plan.accent}`}>
                {plan.highlight ? "mais popular" : "plano"}
              </div>
              <h3 className="mt-4 text-5xl font-black uppercase leading-none tracking-tight">
                {plan.name}
              </h3>
              <div className="mt-4 h-px w-16 bg-[#5865F2]" />
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#5865F2]" />
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
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5865F2]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {plan.name === "Free" ? (
              <a
                href="#free"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#5865F2] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
              >
                Cadastrar no Free <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link
                to="/hub"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#5865F2] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
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
      <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl md:grid-cols-[1.1fr_1fr] md:p-10">
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

        <div className="rounded-xl border border-white/10 bg-[#0b0d12]/60 p-5 backdrop-blur">
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
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#5865F2]"
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
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#5865F2]"
                  placeholder="@usuario"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-emerald-400"
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
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#4752c4]"
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


