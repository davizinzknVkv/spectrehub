/**
 * Antes de realizar qualquer ação, entenda o contexto e instrução recente do usuário, comando mais recente enviado por ele: ```txt
## Restilização da Interface e Mudança de Nome do Site

**Objetivo:**
Restilizar completamente a interface do site e renomeá-lo de "Neighbord" para "Spectre Hub". O site deve se tornar a referência em UI para o nicho de "SI" (Sistemas de Informação ou similar).

**Referência de UI:**
O site `corenetwork.dev` servirá como inspiração principal para o novo design e experiência do usuário.

**Requisitos:**
1. **Identidade Visual:**
   - Criar um novo logotipo e identidade visual para "Spectre Hub".
   - Definir uma paleta de cores, tipografia e estilo de elementos visuais que transmitam profissionalismo, modernidade e autoridade.

2. **Design da Interface (UI):**
   - Redesenhar todas as páginas, focando em uma experiência intuitiva e premium.
   - Adotar os princípios de `corenetwork.dev`: layout limpo, espaços em branco eficazes, tipografia hierarquizada e responsividade.

3. **Conteúdo e Estrutura:**
   - Adaptar o conteúdo para a nova identidade "Spectre Hub".
   - Otimizar a navegação para autoridade e conversão.
```
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Gauge,
  Instagram,
  LifeBuoy,
  Menu,
  MessageSquare,
  Music4,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

const TITLE = "Spectre Hub — Elite Discord Automation";
const DESCRIPTION =
  "Domine o Discord com o Spectre Hub. Automação de quests, sniper de nicks raros e ferramentas de elite em uma infraestrutura obsidian premium.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://neighbordhubdc.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://neighbordhubdc.lovable.app/" },
      { rel: "preload", as: "image", href: logoAsset.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1511467436543709184";
const GUILD_INVITE = "https://discord.gg/JK7cC9je87";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const NAV = [
  { label: "Início", href: "#topo" },
  { label: "Produtos", href: "#produtos" },
  { label: "Recursos", href: "#recursos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Comunidade", href: "#comunidade" },
];

type Product = {
  id: string;
  name: string;
  category: "Automação" | "Discord" | "Economia" | "Utilidades";
  desc: string;
  status: string;
  price?: string;
  to: string;
  icon: typeof Zap;
};

const PRODUCTS: Product[] = [
  {
    id: "quests",
    name: "Auto Quests",
    category: "Automação",
    desc: "Automatize vendas e atendimentos com o SPECTRE TOTEM. Um sistema completo de autoatendimento, com estoque integrado, controle de faturamento, personalização individual e totens ilimitados.",
    status: "Estável",
    to: "/missoes",
    icon: Zap,
  },
  {
    id: "nicks",
    name: "Nicks-Gun",
    category: "Discord",
    desc: "Domine sua identidade. Sniper avançado para capturar usernames raros de 2 e 3 letras antes de todos.",
    status: "Beta",
    to: "/nicksgun",
    icon: Target,
  },
  {
    id: "orbs",
    name: "Resgatar Orbs",
    category: "Economia",
    desc: "Transforme esforço em recompensa. Acesso direto ao catálogo oficial com resgate otimizado em um clique.",
    status: "Estável",
    to: "/resgatar",
    icon: Tag,
  },
  {
    id: "farms",
    name: "Farms Automáticas",
    category: "Automação",
    desc: "Produtividade ininterrupta. Sistemas de farm contínuo com algoritmos de proteção anti-detecção.",
    status: "Estável",
    to: "/farms",
    icon: Gauge,
  },
  {
    id: "control",
    name: "Server Control",
    category: "Utilidades",
    desc: "Poder total sobre sua conta. Gestão profissional de servidores, clonagem e limpeza em massa.",
    status: "Estável",
    to: "/clone",
    icon: ShieldCheck,
  },
  {
    id: "presence",
    name: "Presence Sync",
    category: "Utilidades",
    desc: "Identidade ativa. Sincronize seu status e música enquanto nossas ferramentas trabalham para você.",
    status: "Estável",
    to: "/spotify",
    icon: Music4,
  },
];

const CATEGORIES = ["Todos", "Automação", "Discord", "Economia", "Utilidades"] as const;

const REASONS = [
  {
    n: "01",
    icon: Gauge,
    title: "Latência Ultra-Baixa",
    desc: "Execução distribuída que minimiza tempos de resposta e maximiza a taxa de sucesso nas operações.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Segurança de Nível Bancário",
    desc: "Sistemas de proteção que emulam padrões de comportamento humano, mitigando riscos de detecção por heurística.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Omnicanalidade",
    desc: "Centralize o gerenciamento de múltiplas frentes — quests, economia e identidade — em um único dashboard intuitivo.",
  },
  {
    n: "04",
    icon: LifeBuoy,
    title: "SLA Garantido",
    desc: "Suporte especializado e atualizações constantes para garantir que suas automações nunca fiquem obsoletas.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    cta: "Começar Grátis",
    highlight: false,
    features: [
      "3 missões diárias",
      "Cooldown de 10 min",
      "Acesso a todas as quests",
      "Estatísticas locais",
    ],
  },
  {
    name: "Premium",
    price: "R$ 9,90",
    period: "acesso 30 dias",
    cta: "Obter Acesso Premium",
    highlight: true,
    features: [
      "Missões ilimitadas",
      "Cooldown reduzido (3 min)",
      "Cargo Premium exclusivo",
      "Suporte prioritário",
    ],
  },
  {
    name: "Lifetime",
    price: "R$ 39,90",
    period: "pagamento único",
    cta: "Comprar Acesso Vitalício",
    highlight: false,
    features: [
      "Benefícios Premium vitalícios",
      "Cargo permanente no Discord",
      "Zero mensalidades",
      "Acesso antecipado a betas",
    ],
  },
  {
    name: "Booster",
    price: "Grátis",
    period: "via server boost",
    cta: "Impulsionar Servidor",
    highlight: false,
    features: [
      "Missões ilimitadas",
      "Menor cooldown do sistema (1 min)",
      "Cargo Booster automático",
      "Status VIP na comunidade",
    ],
  },
];

const FALLBACK_MEMBERS = [
  "davizinzkn",
  "rd9m",
  "fuam",
  "felipe",
  "biell",
  "lilith",
  "neo",
  "kaz",
  "mira",
  "juno",
  "hex",
];

/* ─────────────────────────── helpers ─────────────────────────── */

function useInView<T extends Element>(threshold = 0.15): [React.RefObject<T | null>, boolean] {
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
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView];
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

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

/* ─────────────────────────── page ─────────────────────────── */

function Index() {
  return (
    <div
      id="topo"
      className="relative min-h-screen overflow-x-hidden bg-[#030303] font-sans text-[#f5f5f5] antialiased selection:bg-[#c5a059]/30"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="aurora-bg">
        <div className="grid-overlay" />
        <div className="noise-overlay" />
      </div>

      <SiteHeader />

      <main>
        <Hero />
        <SocialProof />
        <ProductsSection />
        
        <ReasonsSection />
        <PlansSection />
        <FreeSignup />
        <CommunitySection />
        <FinalCta />
      </main>

      
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── header ─────────────────────────── */

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] bg-[#030303]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="Spectre Hub"
            className="h-8 w-8 object-contain shrink-0"
          />
          <span className="truncate font-display text-[15px] xs:text-[16px] font-extrabold tracking-tighter text-white uppercase shrink-0">
            Spectre<span className="opacity-40 ml-1 font-light">|</span><span className="text-[#c5a059] ml-1">HUB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[11px] font-bold text-[#8a8a8a] transition-colors duration-200 hover:text-white uppercase tracking-[0.2em]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/hub" className="text-[11px] font-bold text-white border border-white/10 px-6 py-2 rounded-sm hover:bg-white/5 transition-all uppercase tracking-widest flex items-center gap-2">
            <ArrowRight className="h-3 w-3" /> Entrar
          </Link>
          <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-white bg-[#c5a059] px-6 py-2 rounded-sm hover:bg-[#c5a059]/90 transition-all uppercase tracking-widest flex items-center gap-2">
            <ArrowRight className="h-3 w-3" /> Abrir Ticket
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/[0.07] md:hidden"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.07] bg-[#030303]/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-[#a0a0a0] transition hover:bg-white/[0.04] hover:text-white"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
              <Link to="/hub" className="btn-ghost w-full" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="btn-accent w-full">
                Discord
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────── hero ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
      {/* grid + glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-14rem] -z-10 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#c5a059]/5 blur-[130px]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#8a8a8a] backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-[#c5a059] shadow-[0_0_8px_#c5a059]" />
            Inovação · Produto & Tecnologia
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-tighter text-white xs:text-[3.2rem] sm:text-7xl lg:text-[6rem]">
            A SPECTRE
            <br />
            CRIA.
            <br />
            <span className="text-white">O MERCADO</span>
            <br />
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              COPIA.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-xl text-[16px] font-medium leading-relaxed text-[#8a8a8a] sm:text-lg">
            Somos o estúdio por trás dos sistemas que o Discord brasileiro inteiro tenta imitar. Instalação em minutos, compatível com qualquer base, e performance que segura servidor lotado no horário de pico.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#produtos" className="bg-[#c5a059] hover:bg-[#c5a059]/90 text-white font-bold py-4 px-8 rounded-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Quero Usar o Spectre
            </a>
            <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-sm uppercase tracking-wider transition-all flex items-center gap-2">
              Ver os sistemas <ArrowRight className="rotate-90 h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-20 flex items-center justify-between border-t border-white/5 pt-8 text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">
            <span>SPECTRE REBIRTH</span>
            <span className="opacity-20">//</span>
            <span>AGO/2026</span>
            <span className="opacity-20">©</span>
            <span>PROPERTY OF SPECTRE. ALL CREATIVE RIGHTS RESERVED.</span>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {FALLBACK_MEMBERS.slice(0, 5).map((m) => (
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
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[#818cf8]/10 blur-[90px]"
      />
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f]">
            core / automation
          </div>
        </div>

        <div className="grid grid-cols-[84px_1fr] gap-3 p-4">
          <div className="space-y-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5">
            <div className="h-1.5 w-full rounded-full bg-[#818cf8]/70" />
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
                  <div className="h-full rounded-full bg-[#818cf8]" style={{ width: `${q.p}%` }} />
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <svg viewBox="0 0 200 44" className="h-11 w-full" aria-hidden>
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 32 L30 27 L60 29 L90 19 L120 23 L150 11 L180 15 L200 7 L200 44 L0 44 Z"
                  fill="url(#spark)"
                />
                <path
                  d="M0 32 L30 27 L60 29 L90 19 L120 23 L150 11 L180 15 L200 7"
                  fill="none"
                  stroke="#818cf8"
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
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#818cf8]" />
          Rodando em background
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── social proof / stats ─────────────────────── */

const STATS_CACHE_KEY = "nghc:home-stats:v3";
const STATS_TTL_MS = 60_000;

type StatsSnapshot = { latency: number; members: number; products: number; ts: number };

const DEFAULT_STATS: StatsSnapshot = {
  latency: 0.42,
  members: 100,
  products: PRODUCTS.length,
  ts: 0,
};

function clampLatency(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0.1;
  const scaled = ms / 100;
  return Math.min(0.89, Math.max(0.05, Math.round(scaled * 100) / 100));
}

function readCache(): StatsSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StatsSnapshot;
    return typeof parsed?.latency === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(snap: StatsSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(snap));
  } catch {
    /* ignore */
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

function SocialProof() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [stats, setStats] = useState<StatsSnapshot>(DEFAULT_STATS);
  const [hasFresh, setHasFresh] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    const snap = readCache();
    if (snap) {
      setStats({ ...snap, products: PRODUCTS.length });
      setHasFresh(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      if (inFlight.current) return;
      const ctrl = new AbortController();
      inFlight.current = ctrl;
      try {
        const next = await fetchLiveStats(ctrl.signal);
        if (!mounted) return;
        setStats((prev) => {
          const merged: StatsSnapshot = {
            latency: next.latency ?? prev.latency,
            members: next.members ?? prev.members,
            products: PRODUCTS.length,
            ts: next.ts ?? Date.now(),
          };
          writeCache(merged);
          return merged;
        });
        setHasFresh(true);
      } catch {
        /* keep cache */
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

  const members = useCountUp(stats.members, inView);
  const products = useCountUp(stats.products, inView);
  const latency = useCountUp(stats.latency, inView);

  return (
    <section className="border-y border-white/[0.06] bg-black/40 backdrop-blur-sm">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 text-[10px] font-bold text-[#8a8a8a] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-10">
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{Math.round(members)}+</span>
               <span>MEMBROS NA COMUNIDADE</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{Math.round(products)}</span>
               <span>PRODUTOS DISPONÍVEIS</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-white text-2xl font-display tracking-tighter">{latency.toFixed(2)}<span className="text-[#c5a059]">ms</span></span>
               <span>IMPACTO NO DISCORD</span>
             </div>
          </div>
          <div className="hidden lg:block">
            PROPERTY OF SPECTRE. ALL CREATIVE RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── produtos ─────────────────────────── */

function ProductsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-6xl">
              CADA SISTEMA É UM
              <br />
              MOTIVO PRO
              <br />
              JOGADOR FICAR.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-[16px] text-[#8a8a8a]">
              Sistema que o jogador abre, entende na hora e volta pra usar. Todos desenhados, escritos e testados pela SPECTRE, e já rodando em servidor cheio agora.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                activeTab === i
                  ? "bg-[#c5a059] border-[#c5a059] text-white"
                  : "bg-white/5 border-white/10 text-[#8a8a8a] hover:bg-white/10"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal className="relative aspect-video bg-white/5 border border-white/10 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Preview do Sistema</div>
             </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="font-display text-5xl font-extrabold tracking-tighter text-white uppercase">
                SPECTRE {PRODUCTS[activeTab].name}
              </h3>
              <span className="mt-2 block text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">
                SPECTRE-{PRODUCTS[activeTab].id.toUpperCase()}
              </span>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-8 text-lg font-medium text-[#8a8a8a] leading-relaxed">
                {PRODUCTS[activeTab].desc}
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">VRPEX</span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">CREATIVE</span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">STANDALONE</span>
            </Reveal>

            <Reveal delay={300} className="mt-12">
              <Link
                to={PRODUCTS[activeTab].to}
                className="bg-[#c5a059] hover:bg-[#c5a059]/90 text-white font-bold py-4 px-8 rounded-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
              >
                Quero este sistema <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── por que spectre ─────────────────────── */

function ReasonsSection() {
  return (
    <section id="recursos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            POR QUE OS
            <br />
            GRANDES
            <br />
            ESCOLHEM A
            <br />
            SPECTRE.
          </h2>
          <p className="mt-8 text-lg font-medium text-[#8a8a8a] leading-relaxed max-w-md">
            A SPECTRE não revende script de terceiro. Tudo nasce aqui dentro, é testado em servidor com jogador dentro e só chega até você quando aguenta o horário de pico. É por isso que o mercado copia, mas não alcança.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white transition-all">
                      <r.icon className="h-4 w-4" />
                   </div>
                   <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">{r.title}</span>
                </div>
                <p className="text-sm font-medium text-[#8a8a8a] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── por que / recursos ─────────────────────── */


/* ─────────────────────────── planos ─────────────────────────── */

function PlansSection() {
  return (
    <section id="sobre" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="max-w-4xl">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-7xl">
            SISTEMAS PARA
            <br />
            QUEM LEVA A
            <br />
            SÉRIO.
          </h2>
          <p className="mt-8 text-lg font-medium text-[#8a8a8a] leading-relaxed max-w-xl">
            O plano é detectado pelo seu cargo no Discord — se expirar, o hub volta pro Free automaticamente.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div className={`relative group border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full transition-all hover:border-[#c5a059]/30 ${p.highlight ? 'ring-1 ring-[#c5a059]/50' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-[#c5a059] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                  Popular
                </div>
              )}
              <h3 className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.3em] mb-4">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-display font-extrabold text-white tracking-tighter">{p.price}</span>
                <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">/ {p.period}</span>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="h-3 w-3 text-[#c5a059]" />
                    <span className="text-xs font-medium text-[#8a8a8a]">{f}</span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="text-center bg-white/5 border border-white/10 text-white font-bold py-3 px-6 text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Começar Grátis
                </a>
              ) : (
                <Link to="/hub" className={`text-center font-bold py-3 px-6 text-[11px] uppercase tracking-widest transition-all ${p.highlight ? 'bg-[#c5a059] text-white hover:bg-[#c5a059]/90' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                  {p.cta}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── cadastro free ─────────────────────── */

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
    } catch {
      /* ignore */
    }
    setCode(c);
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="free" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal>
        <div className="grid gap-10 rounded-2xl border border-white/[0.07] bg-[#030303]/70 p-7 backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-12">
          <div>
            <span className="eyebrow">Acesso Comunitário</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Habilite seu Acesso Gratuito em Segundos.
            </h2>
            <ol className="mt-8 space-y-4">
              {[
                "Preencha o formulário — geramos um código único pra você.",
                "Entre no servidor e abra um ticket no canal de suporte.",
                "Informe o código no ticket. A staff libera o cargo Free na hora.",
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-[13px] text-[#a0a0a0]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-[10px] font-semibold text-[#c5a059]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
            {!code ? (
              <form onSubmit={generate} className="space-y-4">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu nome
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#c5a059]/60"
                    placeholder="Ex: davizinzkn"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu usuário do Discord
                  </span>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#c5a059]/60"
                    placeholder="@usuario"
                  />
                </label>
                <button type="submit" className="btn-accent w-full py-3">
                  Gerar meu código Free
                </button>
                <p className="text-[11px] leading-relaxed text-[#6f6f6f]">
                  O código fica salvo no seu navegador para você abrir o ticket quando quiser.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                    Seu código Free
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#c5a059]/30 bg-[#c5a059]/[0.08] p-3">
                    <code className="flex-1 font-mono text-lg font-bold tracking-[0.2em] text-[#c5a059]">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      aria-label="Copiar código"
                      className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[#a0a0a0] transition hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4 text-[#c5a059]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-[#8a8a8a]">
                  Abra um ticket no servidor e cole esse código na primeira mensagem.
                </p>
                <a
                  href={GUILD_INVITE}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent w-full py-3"
                >
                  Ir pro servidor abrir ticket <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setCode(null);
                    setName("");
                    setDiscord("");
                  }}
                  className="w-full font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f] transition hover:text-white"
                >
                  Gerar outro código
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── comunidade ─────────────────────────── */

type LiveMember = { id: string; name: string; avatar: string | null; status: string };

function CommunitySection() {
  const [live, setLive] = useState<LiveMember[] | null>(null);
  const [presence, setPresence] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(WIDGET_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || !Array.isArray(j.members)) return;
        setPresence(typeof j.presence_count === "number" ? j.presence_count : null);
        setLive(
          j.members.map(
            (m: { id: string; username: string; avatar_url: string | null; status: string }) => ({
              id: m.id,
              name: m.username,
              avatar: m.avatar_url,
              status: m.status,
            }),
          ),
        );
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const list: LiveMember[] =
    live ?? FALLBACK_MEMBERS.map((n) => ({ id: n, name: n, avatar: null, status: "online" }));
  const loop = [...list, ...list];

  return (
    <section id="comunidade" className="border-t border-white/[0.06] bg-white/[0.012]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">Ecossistema Exclusivo</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
              Conecte-se com a Elite.
            </h2>
            <p className="mt-3 text-sm text-[#8a8a8a]">
              Suporte por ticket, avisos de update, canais de farm e gente online o dia inteiro.
            </p>
          </div>
        </Reveal>

        <div
          className="relative mt-20 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
          }}
        >
          {/* Row 1 */}
          <div className="marquee flex w-max gap-4 pb-4">
            {loop.slice(0, Math.ceil(loop.length / 2)).map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-4 border border-white/5 bg-[#0a0a0a] py-3 pl-3 pr-8 transition-all hover:border-[#c5a059]/30"
                style={{
                  clipPath: "polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0% 75%)"
                }}
              >
                <div className="h-10 w-10 overflow-hidden bg-white/5">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <span className="whitespace-nowrap font-display text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {m.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 - Offset */}
          <div className="marquee flex w-max gap-4" style={{ animationDirection: 'reverse' }}>
            {loop.slice(Math.ceil(loop.length / 2)).map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-4 border border-white/5 bg-[#0a0a0a] py-3 pl-3 pr-8 transition-all hover:border-[#c5a059]/30"
                style={{
                  clipPath: "polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0% 75%)"
                }}
              >
                <div className="h-10 w-10 overflow-hidden bg-white/5">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <span className="whitespace-nowrap font-display text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <Reveal>
            <div className="border border-white/5 bg-[#0a0a0a] p-8 sm:p-10">
              <div className="flex items-center gap-3 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#c5a059]" /> Conexão Direta
              </div>
              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tighter text-white sm:text-4xl">
                SERVIDOR OFICIAL
                <br />
                NO DISCORD
              </h3>
              <p className="mt-4 max-w-md text-xs font-medium leading-relaxed text-[#8a8a8a] uppercase tracking-wider">
                Widget sincronizado em tempo real — entre, valide seu acesso e interaja com nossa comunidade.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-px bg-white/5 border border-white/5 sm:grid-cols-3">
                <MiniStat
                  icon={Users}
                  label="online agora"
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label="suporte" value="Ticket" />
                <MiniStat icon={Sparkles} label="cargos" value="Premium" />
              </div>

              <a
                href={GUILD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 bg-[#c5a059] px-8 py-4 font-display text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#c5a059]/90"
              >
                Entrar no Discord <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <div className="mx-auto w-full max-w-[380px] border border-white/5 bg-[#0a0a0a] p-2">
            <iframe
              src={`https://discord.com/widget?id=${GUILD_ID}&theme=dark`}
              width={350}
              height={480}
              title="Widget do Discord"
              loading="lazy"
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto block h-[480px] w-full grayscale contrast-125 brightness-90 transition-all hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0a0a0a] p-5">
      <Icon className="h-4 w-4 text-[#c5a059]" />
      <div className="mt-4 truncate font-display text-lg font-black text-white">{value}</div>
      <div className="mt-1 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[#444]">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────── cta final ─────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-32">
      <Reveal>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-8xl">
            ABRA UM
            <br />
            TICKET!
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-lg font-medium text-[#8a8a8a] leading-relaxed">
            Junte-se à elite e ative sua infraestrutura de automação hoje mesmo. Suporte direto com quem entende do assunto.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="bg-[#c5a059] text-white font-bold py-4 px-10 rounded-sm uppercase tracking-widest hover:bg-[#c5a059]/90 transition-all flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Abrir meu ticket agora
            </a>
            <Link to="/hub" className="bg-white/5 border border-white/10 text-white font-bold py-4 px-10 rounded-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Acessar painel
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── footer ─────────────────────────── */

function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-16">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logoAsset.url}
                alt="Spectre Hub"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-display text-[16px] font-extrabold tracking-tighter text-white uppercase">
                Spectre<span className="opacity-40 ml-1.5 font-light">|</span><span className="text-[#c5a059] ml-1.5">HUB</span>
              </span>
            </Link>
            <p className="mt-6 text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] leading-loose">
              INOVAÇÃO · PRODUTO & TECNOLOGIA
              <br />
              Feito por jogadores, para servidores que levam a sério.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterCol
              title="CORE"
              links={[
                { label: "Sistemas", href: "#produtos" },
                { label: "Por que CORE", href: "#recursos" },
                { label: "Servidores", href: "#comunidade" },
              ]}
            />
            <FooterCol
              title="CLIENTE"
              links={[
                { label: "Entrar", href: "/hub" },
                { label: "Abrir ticket", href: GUILD_INVITE, external: true },
              ]}
            />
            <FooterCol
              title="COMUNIDADE"
              links={[
                { label: "Discord", href: GUILD_INVITE, external: true },
              ]}
            />
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-[#444] uppercase tracking-[0.25em]">
          <div className="flex items-center gap-8">
            <span>SPECTRE HUB</span>
            <span className="opacity-20">//</span>
            <span>AGO/2026</span>
            <span className="opacity-20">©</span>
            <span>PROPERTY OF SPECTRE. ALL CREATIVE RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-2">
            CÓDIGO FONTE FORNECIDO POR <span className="text-[#666]">ISNOUU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f]">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="text-[13px] text-[#a0a0a0] transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

