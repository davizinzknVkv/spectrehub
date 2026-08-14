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
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Gauge,
  Globe,
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
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";

import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
import { useOptimizerContent } from "@/lib/site-content";


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
  { label: "Produtos", href: "#produtos" },
  { label: "Optimizer", href: "#optimizer" },
  { label: "Recursos", href: "#recursos" },
  { label: "Preços", href: "#preços" },
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
      className="relative min-h-screen overflow-x-hidden bg-obsidian font-sans text-bone antialiased selection:bg-copper/40 selection:text-white"
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
        <OptimizerSection />
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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.04] bg-obsidian/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1216px] items-center justify-between gap-8 px-6 overflow-hidden">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="Spectre"
            className="h-7 w-7 object-contain shrink-0"
          />
          <span className="truncate font-display text-[20px] font-medium tracking-tight text-white shrink-0">
            Spectre
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[14px] font-medium text-fog transition-colors duration-200 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/hub" className="text-[14px] font-medium text-white px-4 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-all">
            Entrar
          </Link>
          <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="text-[14px] font-medium text-black bg-white px-6 py-2 rounded-full hover:opacity-90 transition-all">
            Começar Agora
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
    <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pt-40 lg:pt-48">
      <div className="mx-auto max-w-[1216px]">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div className="max-w-xl">
            <Reveal>
              <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-6 block">
                Plataforma de Elite
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display text-[52px] font-medium leading-[1.1] tracking-[0.01em] text-white sm:text-[64px] lg:text-[88px]">
                Domine sua jornada digital.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 text-body-sm leading-relaxed text-fog sm:text-body">
                Automatize quests, capture identidades raras e gerencie sua presença no Discord com a infraestrutura mais sofisticada do mercado.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <div className="relative w-full max-w-sm">
                  <input
                    type="email"
                    placeholder="Seu e-mail profissional"
                    className="w-full rounded-full border border-white/20 bg-transparent px-6 py-4 text-[14px] text-white placeholder:text-steel focus:border-white focus:outline-none"
                  />
                  <button className="absolute right-2 top-2 rounded-full bg-white px-6 py-2 text-[14px] font-medium text-black hover:opacity-90 transition-all">
                    Começar
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-16 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {FALLBACK_MEMBERS.slice(0, 4).map((m) => (
                    <div
                      key={m}
                      className="h-8 w-8 overflow-hidden rounded-full border-2 border-obsidian bg-onyx"
                    >
                      <Avatar seed={m} />
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-mist font-medium">
                  Junte-se a <span className="text-white">12.000+</span> membros ativos
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={380} className="relative hidden lg:block">
            <HeroPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-20 -z-10 rounded-full bg-copper/5 blur-[120px]"
      />
      <div className="ds-card rounded-xl border border-white/[0.04] bg-onyx p-8 shadow-2xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="text-eyebrow font-medium text-fog block mb-1">Status da Rede</span>
            <div className="text-[32px] font-medium text-white tabular-nums tracking-tight">
              142.842 <span className="text-[18px] text-mist font-normal">req/s</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border border-slate bg-carbon flex items-center justify-center">
            <Activity className="h-5 w-5 text-accent" />
          </div>
        </div>

        <div className="h-48 w-full">
           <svg className="h-full w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
             <path
               d="M0 80 Q 50 20, 100 70 T 200 40 T 300 80 T 400 20"
               fill="none"
               stroke="url(#gilded-gradient)"
               strokeWidth="3"
               strokeLinecap="round"
             />
             <defs>
               <linearGradient id="gilded-gradient" x1="0" y1="0" x2="1" y2="0">
                 <stop offset="0%" stopColor="#ae9357" />
                 <stop offset="40%" stopColor="#fff0cc" />
                 <stop offset="70%" stopColor="#ae9357" />
                 <stop offset="100%" stopColor="rgba(189, 157, 79, 0)" />
               </linearGradient>
             </defs>
           </svg>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-graphite pt-8">
          <div>
            <span className="text-[12px] font-medium text-ash block mb-1">Tempo de Resposta</span>
            <span className="text-[16px] font-medium text-bone">14ms</span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-ash block mb-1">Uptime Global</span>
            <span className="text-[16px] font-medium text-bone">99.98%</span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-ash block mb-1">Localização</span>
            <span className="text-[16px] font-medium text-bone">São Paulo, BR</span>
          </div>
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
    <section className="border-y border-graphite bg-onyx/50 backdrop-blur-md">
      <div ref={ref} className="mx-auto max-w-[1216px] px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-12">
          <div className="flex flex-wrap items-center gap-16">
             <div className="flex flex-col gap-1">
               <span className="text-[44px] font-display text-white tracking-tight leading-none">{Math.round(members).toLocaleString()}+</span>
               <span className="text-eyebrow font-medium text-fog uppercase tracking-widest">Membros Elite</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[44px] font-display text-white tracking-tight leading-none">{Math.round(products)}</span>
               <span className="text-eyebrow font-medium text-fog uppercase tracking-widest">Módulos Ativos</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[44px] font-display text-white tracking-tight leading-none">
                 {latency.toFixed(2)}
                 <span className="text-accent ml-1 text-[24px]">ms</span>
               </span>
               <span className="text-eyebrow font-medium text-fog uppercase tracking-widest">Latência de Rede</span>
             </div>
          </div>
          <div className="hidden text-eyebrow font-medium text-steel uppercase tracking-[0.2em] lg:block">
            Spectre Hub © 2026
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
    <section id="produtos" className="mx-auto max-w-[1216px] px-6 py-40">
      <div className="text-center mb-24">
        <Reveal>
          <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-4 block">Catálogo de Sistemas</span>
          <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white sm:text-[64px]">
            Soluções para quem<br />exige o extraordinário.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-2xl text-body-sm text-fog">
            Cada módulo é desenhado para oferecer performance máxima e facilidade absoluta de uso.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-2 rounded-full text-[14px] font-medium border transition-all ${
              activeTab === i
                ? "bg-white border-white text-black"
                : "bg-transparent border-white/10 text-fog hover:border-white/30"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal className="relative aspect-video rounded-xl border border-white/[0.04] bg-onyx overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-eyebrow font-medium text-steel uppercase tracking-widest">Preview {PRODUCTS[activeTab].name}</div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-eyebrow font-semibold text-accent uppercase tracking-[0.2em] mb-4 block">
              Módulo {PRODUCTS[activeTab].category}
            </span>
            <h3 className="font-display text-[44px] font-medium text-white leading-tight">
              {PRODUCTS[activeTab].name}
            </h3>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-8 text-body-sm text-fog leading-relaxed">
              {PRODUCTS[activeTab].desc}
            </p>
          </Reveal>

          <Reveal delay={200} className="mt-10 flex flex-wrap gap-2">
            {["Premium Hub", "Latência Zero", "Sync Ativo"].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full border border-graphite text-[12px] font-medium text-mist uppercase tracking-wider">
                {f}
              </span>
            ))}
          </Reveal>

          <Reveal delay={300} className="mt-12">
            <Link
              to={PRODUCTS[activeTab].to}
              className="bg-white hover:opacity-90 text-black font-medium py-3 px-8 rounded-full transition-all inline-flex items-center gap-2 text-[14px]"
            >
              Conhecer Detalhes
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── por que spectre ─────────────────────── */

function ReasonsSection() {
  return (
    <section id="recursos" className="mx-auto max-w-[1216px] px-6 py-40 border-t border-graphite">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <Reveal>
          <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-4 block">Diferenciais Elite</span>
          <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white sm:text-[64px]">
            Infraestrutura de<br />nível industrial.
          </h2>
          <p className="mt-10 text-body-sm text-fog leading-relaxed max-w-md">
            A Spectre não apenas entrega software; entregamos soberania digital. Nossa stack é construída do zero para suportar as operações mais críticas do Discord.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group border-l border-graphite pl-6 hover:border-accent transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="h-10 w-10 rounded-full bg-onyx border border-graphite flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                      <r.icon className="h-5 w-5" />
                   </div>
                   <span className="text-eyebrow font-bold text-mist uppercase tracking-widest">{r.title}</span>
                </div>
                <p className="text-[15px] leading-relaxed text-fog">
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
    <section id="sobre" className="mx-auto max-w-[1216px] px-6 py-40 border-t border-graphite">
      <div className="text-center mb-24">
        <Reveal>
          <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-4 block">Planos e Acesso</span>
          <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white sm:text-[64px]">
            Acesso exclusivo para<br />operadores de elite.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-2xl text-body-sm text-fog">
            O plano é detectado automaticamente pelo seu cargo no Discord. Sem atritos, sem interrupções.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 100}>
            <div className={`relative group rounded-xl border border-white/[0.04] bg-onyx/40 p-10 flex flex-col h-full transition-all hover:border-accent/30 ${p.highlight ? 'ring-1 ring-accent/20' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-white text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Popular
                </div>
              )}
              <span className="text-eyebrow font-bold text-accent uppercase tracking-[0.2em] mb-4 block">{p.name}</span>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-[44px] font-display font-medium text-white tracking-tight">{p.price}</span>
                <span className="text-eyebrow font-medium text-steel uppercase tracking-widest">/ {p.period}</span>
              </div>
              
              <div className="space-y-5 mb-12 flex-1">
                {p.features.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-0.5" />
                    <span className="text-[14px] text-fog leading-snug">{f}</span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="text-center bg-transparent border border-white/10 text-white font-medium py-3 px-6 rounded-full text-[13px] uppercase tracking-widest hover:border-white/30 transition-all">
                  Começar Grátis
                </a>
              ) : (
                <Link to="/hub" className={`text-center font-medium py-3 px-6 rounded-full text-[13px] uppercase tracking-widest transition-all ${p.highlight ? 'bg-white text-black hover:opacity-90' : 'bg-transparent border border-white/10 text-white hover:border-white/30'}`}>
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
    <section id="free" className="mx-auto max-w-[1216px] px-6 py-40 border-t border-graphite">
      <Reveal>
        <div className="grid gap-20 rounded-2xl border border-white/[0.04] bg-onyx/50 p-12 backdrop-blur-xl lg:grid-cols-2">
          <div>
            <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-6 block">Acesso Comunitário</span>
            <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white">
              Habilite seu acesso<br />gratuito agora.
            </h2>
            <div className="mt-12 space-y-6">
              {[
                { t: "Gere seu código único", d: "Preencha o formulário para validar sua identidade." },
                { t: "Entre no servidor", d: "Abra um ticket em nosso canal de suporte oficial." },
                { t: "Ative sua licença", d: "Informe o código e receba o cargo Free instantaneamente." },
              ].map((s, i) => (
                <div key={s.t} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-graphite bg-obsidian font-display text-[16px] text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-medium text-white mb-1">{s.t}</h3>
                    <p className="text-[14px] text-fog leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-graphite bg-obsidian/50 p-10">
            {!code ? (
              <form onSubmit={generate} className="space-y-6">
                <div>
                  <label className="text-eyebrow font-medium text-steel uppercase tracking-widest mb-3 block">
                    Nome de Operador
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full rounded-full border border-graphite bg-transparent px-6 py-4 text-[14px] text-white outline-none transition placeholder:text-steel focus:border-white"
                    placeholder="Ex: Ghost"
                  />
                </div>
                <div>
                  <label className="text-eyebrow font-medium text-steel uppercase tracking-widest mb-3 block">
                    Discord ID / User
                  </label>
                  <input
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={40}
                    required
                    className="w-full rounded-full border border-graphite bg-transparent px-6 py-4 text-[14px] text-white outline-none transition placeholder:text-steel focus:border-white"
                    placeholder="@usuario"
                  />
                </div>
                <button type="submit" className="w-full bg-white hover:opacity-90 text-black font-medium py-4 px-6 rounded-full text-[14px] transition-all uppercase tracking-widest mt-4">
                  Gerar Licença Free
                </button>
                <p className="text-[12px] text-steel text-center italic">
                  * Licença válida para 1 dispositivo.
                </p>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <span className="text-eyebrow font-medium text-steel uppercase tracking-widest mb-4 block">Sua Chave de Ativação</span>
                  <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-6">
                    <code className="flex-1 font-mono text-[24px] font-medium tracking-wider text-accent">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      className="h-12 w-12 flex items-center justify-center rounded-full bg-accent text-black transition hover:opacity-90"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="p-6 rounded-xl border border-graphite bg-onyx/30">
                  <p className="text-[14px] text-fog leading-relaxed">
                    Copie o código acima e abra um ticket em nosso Discord oficial para validação manual pela equipe Spectre.
                  </p>
                </div>
                <a
                  href={GUILD_INVITE}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-accent hover:opacity-90 text-black font-medium py-4 px-6 rounded-full text-[14px] flex items-center justify-center gap-3 transition-all uppercase tracking-widest"
                >
                  Ir para o Discord <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setCode(null);
                    setName("");
                    setDiscord("");
                  }}
                  className="w-full text-eyebrow font-medium text-steel uppercase tracking-widest hover:text-white transition-colors text-center"
                >
                  Gerar nova licença
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
    <section id="comunidade" className="border-t border-graphite bg-onyx/20 overflow-hidden">
      <div className="mx-auto max-w-[1216px] px-6 py-40">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-4 block">Rede de Elite</span>
            <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white sm:text-[64px]">
              Onde o impossível se<br />torna padrão.
            </h2>
            <p className="mt-8 text-body-sm text-fog leading-relaxed">
              Junte-se a uma rede privada de operadores, desenvolvedores e entusiastas que definem o futuro do Discord.
            </p>
          </div>
        </Reveal>

        <div
          className="relative mt-24 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
          }}
        >
          {/* Row 1 */}
          <div className="marquee flex w-max gap-4 pb-4">
            {loop.slice(0, Math.ceil(loop.length / 2)).map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-white/[0.04] bg-obsidian py-2 pl-2 pr-6 transition-all hover:border-accent/30"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-onyx">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  ) : (
                    <Avatar seed={m.name} />
                  )}
                </div>
                <span className="text-[13px] font-medium text-white tracking-tight">
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
                className="flex shrink-0 items-center gap-3 rounded-full border border-white/[0.04] bg-obsidian py-2 pl-2 pr-6 transition-all hover:border-accent/30"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-onyx">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  ) : (
                    <Avatar seed={m.name} />
                  )}
                </div>
                <span className="text-[13px] font-medium text-white tracking-tight">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center">
          <Reveal>
            <div className="rounded-2xl border border-white/[0.04] bg-onyx/30 p-12">
              <div className="flex items-center gap-3 text-eyebrow font-semibold text-accent uppercase tracking-widest mb-6">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Sincronizado
              </div>
              <h3 className="font-display text-[32px] font-medium text-white leading-tight mb-6">
                QG Central Spectre
              </h3>
              <p className="text-body-sm text-fog leading-relaxed mb-10">
                Acesse canais exclusivos de suporte prioritário, changelogs em tempo real e betas fechados de novos módulos.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-12">
                <MiniStat
                  icon={Users}
                  label="Online agora"
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label="Suporte 24/7" value="Live" />
                <MiniStat icon={Sparkles} label="Benefícios" value="Elite" />
              </div>

              <a
                href={GUILD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white hover:opacity-90 px-10 py-4 rounded-full text-[14px] font-medium text-black transition-all uppercase tracking-widest"
              >
                Entrar no Discord <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <div className="mx-auto w-full max-w-[400px] rounded-2xl border border-white/[0.04] bg-obsidian p-4 shadow-2xl">
            <iframe
              src={`https://discord.com/widget?id=${GUILD_ID}&theme=dark`}
              width={350}
              height={480}
              title="Widget do Discord"
              loading="lazy"
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto block h-[480px] w-full grayscale opacity-70 contrast-125 brightness-75 transition-all hover:grayscale-0 hover:opacity-100"
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
    <div className="bg-obsidian p-5 rounded-xl border border-graphite">
      <Icon className="h-4 w-4 text-accent" />
      <div className="mt-4 truncate font-display text-[20px] font-medium text-white tracking-tight">{value}</div>
      <div className="mt-1 text-eyebrow font-medium uppercase tracking-widest text-steel">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────── optimizer ─────────────────────────── */

function OptimizerSection() {
  const { settings, features, previews } = useOptimizerContent();
  if (!settings || !settings.active) return null;

  const IconMap: Record<string, any> = {
    Zap, Target, Gauge, Globe, Trash2, Activity, ShieldCheck, Sparkles, Users
  };

  return (
    <section id="optimizer" className="relative overflow-hidden border-t border-graphite bg-obsidian py-40">
      <div className="mx-auto max-w-[1216px] px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-6 block">
              {settings.badge}
            </span>
            <h2 className="font-display text-[44px] font-medium leading-[1.1] text-white sm:text-[64px]">
              {settings.name}
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-body-sm text-fog">
              {settings.description}
            </p>
          </div>
        </Reveal>

        {/* Features Grid */}
        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = IconMap[f.icon] || Zap;
            return (
              <Reveal key={f.id} delay={i * 100}>
                <div className="group rounded-2xl border border-white/[0.04] bg-onyx/30 p-10 transition-all hover:border-accent/30">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-obsidian border border-graphite text-accent group-hover:bg-accent group-hover:text-black transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-8 font-display text-[24px] font-medium text-white tracking-tight">{f.title}</h3>
                  <p className="mt-4 text-[14px] text-fog leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Previews Showcase */}
        {previews.length > 0 && (
          <div className="mt-40 space-y-24">
            <Reveal>
              <div className="text-center">
                <h3 className="font-display text-[32px] font-medium text-white tracking-tight">
                  Interface de alta precisão.
                </h3>
                <p className="mt-4 text-eyebrow font-medium uppercase tracking-widest text-steel">
                  Explore o painel de controle do Spectre Optimizer
                </p>
              </div>
            </Reveal>

            <div className="grid gap-12">
              {previews.map((p, i) => (
                <Reveal key={p.id} delay={i * 150}>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-onyx/30 transition-all hover:border-accent/30">
                    <div className="aspect-[21/9] overflow-hidden">
                      <img 
                        src={p.image_url} 
                        alt={p.title} 
                        className="h-full w-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full p-12">
                      <h4 className="font-display text-[28px] font-medium text-white tracking-tight">{p.title}</h4>
                      <p className="mt-4 max-w-xl text-body-sm text-fog leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={200}>
          <div className="mt-32 text-center">
            <a 
              href={settings.button_link} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-white hover:opacity-90 text-black font-medium py-4 px-12 rounded-full text-[14px] transition-all uppercase tracking-widest inline-flex items-center gap-3"
            >
              {settings.button_text}
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="mt-10">
              <span className="text-eyebrow font-medium uppercase tracking-widest text-steel">
                Status do Sistema: <span className="text-accent">{settings.status}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* ─────────────────────────── cta final ─────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-graphite bg-onyx/20 py-40">
      <Reveal>
        <div className="mx-auto max-w-[1216px] px-6 text-center">
          <span className="text-eyebrow font-semibold uppercase tracking-widest text-accent mb-6 block">Inicie sua Jornada</span>
          <h2 className="font-display text-[52px] font-medium leading-[1.1] text-white sm:text-[88px]">
            Sua soberania<br />digital começa aqui.
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-body-sm text-fog leading-relaxed">
            Junte-se a milhares de operadores que confiam na infraestrutura Spectre para dominar o ecossistema digital.
          </p>
          <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-accent hover:opacity-90 text-black font-medium py-4 px-12 rounded-full text-[14px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-3">
              Abrir Ticket no Discord <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/hub" className="w-full sm:w-auto bg-transparent border border-white/10 text-white font-medium py-4 px-12 rounded-full text-[14px] uppercase tracking-widest hover:border-white/30 transition-all inline-flex justify-center">
              Acessar Hub Privado
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
                Spectre<span className="opacity-40 ml-1.5 font-light">|</span><span className="text-[#ff0055] ml-1.5">HUB</span>
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
              title="HUB"
              links={[
                { label: "Spectre Optimizer", href: "#optimizer" },
                { label: "Sistemas", href: "#produtos" },
                { label: "Por que HUB", href: "#recursos" },
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

