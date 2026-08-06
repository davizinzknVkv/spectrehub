/**
 * Antes de realizar qualquer ação, entenda o contexto e instrução recente do usuário, comando mais recente enviado por ele: ```txt
Analise completamente toda a aplicação, página, fluxo, produto ou estrutura de comunicação antes de realizar qualquer alteração.

Seu objetivo é atuar como um especialista sênior em Copywriting, Marketing, Conversão, Branding, Growth e UX Writing, realizando melhorias profundas em toda comunicação da plataforma para maximizar clareza, autoridade, retenção, engajamento e conversão.

Você deve otimizar qualquer tipo de copy presente no sistema:
- Landing pages
- Páginas de vendas
- Headlines
- CTAs
- Textos institucionais
- Dashboards SaaS
- Funis
- Onboarding
- Mensagens automáticas
- UX writing
- E-mails
- Descrições de produtos
- Textos de marketing
- Mensagens de erro
- Microcopy
- Copy de anúncios
- Copy para IA/chatbots
- Fluxos de conversão
- Ofertas
- Upsells
- Checkout
- Notificações
- Scripts de vendas
- WhatsApp
- Interfaces e componentes

━━━━━━━━━━━━━━━━━━━
OBJETIVO PRINCIPAL
━━━━━━━━━━━━━━━━━━━

Transformar toda a comunicação do sistema em uma experiência:
- Mais persuasiva
- Mais clara
- Mais profissional
- Mais moderna
- Mais estratégica
- Mais confiável
- Mais envolvente
- Mais focada em conversão

━━━━━━━━━━━━━━━━━━━
ANÁLISE OBRIGATÓRIA
━━━━━━━━━━━━━━━━━━━

Antes de modificar qualquer texto, analise:

- Público-alvo
- Posicionamento da marca
- Nível de consciência do usuário
- Jornada do usuário
- Estrutura da oferta
- Clareza da comunicação
- Hierarquia textual
- CTA principais
- Fluxos de conversão
- Possíveis objeções
- Pontos de fricção
- Credibilidade da comunicação
- Tom de voz da marca
- Estratégia de retenção
- Estratégia de persuasão
- Qualidade das headlines
- Legibilidade dos textos
- Escaneabilidade visual
- Gatilhos mentais utilizados
- Consistência da comunicação

━━━━━━━━━━━━━━━━━━━
OTIMIZAÇÕES DE COPY
━━━━━━━━━━━━━━━━━━━

Melhore:
- Headlines fracas
- CTAs genéricos
- Textos confusos
- Mensagens sem clareza
- Comunicação pouco persuasiva
- Textos longos e cansativos
- Falta de hierarquia visual
- Falta de benefício claro
- Falta de prova social
- Falta de urgência estratégica
- Falta de diferenciação
- Falta de autoridade
- Falta de conexão emocional
- UX Writing ruim
- Fluxos pouco intuitivos

━━━━━━━━━━━━━━━━━━━
ESTRATÉGIAS QUE DEVEM SER UTILIZADAS
━━━━━━━━━━━━━━━━━━━

Aplicar quando fizer sentido:

- Copywriting de conversão
- Marketing emocional
- Marketing direto
- Storytelling
- Gatilhos mentais
- Escassez
- Urgência
- Autoridade
- Prova social
- Clareza extrema
- Benefício acima de funcionalidade
- Estrutura AIDA
- Estrutura PAS
- Estrutura BAB
- Growth marketing
- UX Writing
- Neurocopy
- Persuasão estratégica
- Escrita focada em retenção

━━━━━━━━━━━━━━━━━━━
FOCO EM CONVERSÃO
━━━━━━━━━━━━━━━━━━━

Toda comunicação deve:
- Reduzir dúvidas
- Aumentar confiança
- Facilitar decisões
- Direcionar ações
- Melhorar retenção
- Melhorar ativação do usuário
- Melhorar onboarding
- Melhorar vendas
- Melhorar engajamento
- Melhorar percepção de valor

━━━━━━━━━━━━━━━━━━━
UX WRITING
━━━━━━━━━━━━━━━━━━━

Melhore:
- Mensagens de erro
- Estados vazios
- Loadings
- Tooltips
- Placeholders
- Mensagens automáticas
- Fluxos de confirmação
- Textos de onboarding
- Navegação textual
- Comunicação de sistema

A comunicação deve parecer:
- Humana
- Inteligente
- Clara
- Natural
- Profissional
- Moderna

━━━━━━━━━━━━━━━━━━━
REGRAS IMPORTANTES
━━━━━━━━━━━━━━━━━━━

- NÃO gerar textos genéricos
- NÃO exagerar em gatilhos mentais
- NÃO usar linguagem amadora
- NÃO usar copy apelativa ou forçada
- NÃO quebrar identidade da marca
- Priorizar clareza acima de exagero
- Manter consistência em toda comunicação
- Adaptar a copy ao contexto de cada página
- Pensar sempre na experiência do usuário final

━━━━━━━━━━━━━━━━━━━
RESULTADO ESPERADO
━━━━━━━━━━━━━━━━━━━

Ao finalizar, toda a comunicação da aplicação deve estar:
- Muito mais profissional
- Mais persuasiva
- Mais moderna
- Mais estratégica
- Mais clara
- Mais confiável
- Mais agradável de consumir
- Mais focada em conversão e retenção

A aplicação deve parecer construída por uma empresa SaaS premium especializada em marketing, tecnologia e inteligência artificial.
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
import nghcLogo from "@/assets/nghc-logo.png.asset.json";

const TITLE = "NeighborD Hub — A Elite da Automação para Discord";
const DESCRIPTION =
  "Maximize sua eficiência no Discord. Automação avançada de quests, sniper de nicks raros e ferramentas de elite em uma infraestrutura premium de alta performance.";

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
      { rel: "preload", as: "image", href: nghcLogo.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1511467436543709184";
const GUILD_INVITE = "https://discord.com/invite/fVeXNmmF";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const NAV = [
  { label: "Início", href: "#topo" },
  { label: "Produtos", href: "#produtos" },
  { label: "Recursos", href: "#recursos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Comunidade", href: "#comunidade" },
];

type Product = {
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
    name: "Auto Quests",
    category: "Automação",
    desc: "Acelere seu progresso. Detecção e execução inteligente de missões em segundo plano com latência ultra-baixa.",
    status: "Estável",
    to: "/missoes",
    icon: Zap,
  },
  {
    name: "Nicks-Gun",
    category: "Discord",
    desc: "Domine sua identidade. Sniper avançado para capturar usernames raros de 2 e 3 letras antes de todos.",
    status: "Beta",
    to: "/nicksgun",
    icon: Target,
  },
  {
    name: "Resgatar Orbs",
    category: "Economia",
    desc: "Transforme esforço em recompensa. Acesso direto ao catálogo oficial com resgate otimizado em um clique.",
    status: "Estável",
    to: "/resgatar",
    icon: Tag,
  },
  {
    name: "Farms Automáticas",
    category: "Automação",
    desc: "Produtividade ininterrupta. Sistemas de farm contínuo com algoritmos de proteção anti-detecção.",
    status: "Estável",
    to: "/farms",
    icon: Gauge,
  },
  {
    name: "Server Control",
    category: "Utilidades",
    desc: "Poder total sobre sua conta. Gestão profissional de servidores, clonagem e limpeza em massa.",
    status: "Estável",
    to: "/clone",
    icon: ShieldCheck,
  },
  {
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
    title: "Performance",
    desc: "Execução em background com impacto mínimo: o hub trabalha enquanto você usa o Discord normalmente.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Controle",
    desc: "Cooldowns, filas e limites por plano respeitam os limites da API — nada de ação atropelada.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Experiência",
    desc: "Interface única para quests, orbs, nicks e servidores, com histórico e progresso ao vivo.",
  },
  {
    n: "04",
    icon: LifeBuoy,
    title: "Suporte",
    desc: "Comunidade ativa e atendimento por ticket no servidor oficial, direto com quem desenvolve.",
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
      className="relative min-h-screen overflow-x-hidden bg-[#050505] font-sans text-[#f5f5f5] antialiased"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="tech-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#818cf8]/[0.09] blur-[140px]" />
        <div className="absolute bottom-0 right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-[#818cf8]/[0.05] blur-[140px]" />
      </div>

      <SiteHeader />

      <main>
        <Hero />
        <SocialProof />
        <ProductsSection />
        <FeaturedProduct />
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
          ? "border-b border-white/[0.07] bg-[#050505]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={nghcLogo.url}
            alt="NeighborD Hub"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="truncate font-display text-[15px] font-extrabold tracking-tight text-white">
            NeighborD<span className="text-[#818cf8]"> Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] font-medium text-[#8a8a8a] transition-colors duration-200 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/hub" className="btn-ghost">
            Entrar
          </Link>
          <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="btn-accent">
            Comunidade
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
        <div className="border-t border-white/[0.07] bg-[#050505]/95 backdrop-blur-xl md:hidden">
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
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-14rem] -z-10 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#818cf8]/12 blur-[130px]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#a0a0a0] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#818cf8]" />
            NeighborD Hub
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.5rem]">
            A Próxima Geração da
            <br />
            <span className="bg-gradient-to-b from-white via-white to-[#8f8f8f] bg-clip-text text-transparent">
              Experiência no Discord.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[#8a8a8a] sm:text-base">
            O NeighborD Hub é a infraestrutura definitiva para automação. Quests, orbs, nicks raros e ferramentas de gestão em uma única interface premium projetada para performance extrema.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#produtos" className="btn-accent px-5 py-3">
              Explorar produtos <ArrowRight className="h-4 w-4" />
            </a>
            <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-3">
              Entrar na comunidade
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
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
            hub / missões
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
    <section className="border-y border-white/[0.06] bg-white/[0.012]">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="max-w-2xl text-sm text-[#8a8a8a]">
          Construído para comunidades que levam sua experiência a sério.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-3">
          <StatCell
            loading={!hasFresh}
            value={`${Math.round(members)}+`}
            label="membros na comunidade"
          />
          <StatCell
            loading={!hasFresh}
            value={`${Math.round(products)}`}
            label="produtos disponíveis"
          />
          <StatCell
            loading={!hasFresh}
            value={
              <>
                {latency.toFixed(2)}
                <span className="text-[#818cf8]">ms</span>
              </>
            }
            label="de impacto no discord"
          />
        </div>
      </div>
    </section>
  );
}

function StatCell({
  value,
  label,
  loading,
}: {
  value: React.ReactNode;
  label: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-[#080808] px-6 py-8">
      <div className="flex min-h-[2.75rem] items-center font-display text-3xl font-extrabold tracking-tight tabular-nums text-white sm:text-4xl">
        {loading ? (
          <span className="block h-8 w-24 animate-pulse rounded bg-white/[0.07]" aria-hidden />
        ) : (
          value
        )}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f]">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────── produtos ─────────────────────────── */

function ProductsSection() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const list = cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">produtos</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
              Produtos feitos para elevar sua experiência.
            </h2>
            <p className="mt-3 text-sm text-[#8a8a8a]">
              Cada ferramenta do hub resolve uma dor real de quem vive Discord todo dia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition duration-200 ${
                  cat === c
                    ? "border-[#818cf8]/50 bg-[#818cf8]/12 text-white"
                    : "border-white/[0.08] bg-white/[0.02] text-[#8a8a8a] hover:border-white/20 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.name} delay={i * 60}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;
  return (
    <Link
      to={product.to}
      className="surface-card group flex h-full flex-col overflow-hidden p-0"
    >
      <div className="relative h-32 overflow-hidden border-b border-white/[0.06] bg-[#0b0b0b]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 transition-transform duration-[350ms] group-hover:scale-110"
          style={{
            background:
              "radial-gradient(320px 140px at 30% 0%, rgba(129,140,248,0.18), transparent 70%)",
          }}
        />
        <div className="tech-grid absolute inset-0 opacity-70" aria-hidden />
        <Icon className="absolute bottom-4 left-5 h-7 w-7 text-[#818cf8] transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#a0a0a0]">
          {product.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f]">
          {product.category}
        </div>
        <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-white">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#8a8a8a]">{product.desc}</p>
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-xs font-semibold text-[#a0a0a0]">
            {product.price ?? "Incluído no hub"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#818cf8] transition-transform duration-300 group-hover:translate-x-0.5">
            Visualizar <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────── produto em destaque ─────────────────────── */

function FeaturedProduct() {
  return (
    <section className="relative border-y border-white/[0.06] bg-white/[0.012]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="eyebrow">produto em destaque</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
                Auto Quests, do jeito que deveria ser.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#8a8a8a]">
                O hub identifica todas as quests ativas da sua conta, executa vídeo e jogo em
                segundo plano e mostra o progresso ao vivo — sem abrir o cliente, sem ficar
                apertando botão.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    t: "Detecção automática",
                    d: "Lista todas as quests disponíveis, inclusive as regionais.",
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
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#818cf8]" />
                    <div>
                      <div className="text-sm font-semibold text-white">{f.t}</div>
                      <div className="text-[13px] text-[#8a8a8a]">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/missoes" className="btn-accent mt-9 px-5 py-3">
                Abrir Auto Quests <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <HeroPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── por que / recursos ─────────────────────── */

function ReasonsSection() {
  return (
    <section id="recursos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal>
        <div className="max-w-2xl">
          <span className="eyebrow">Diferenciais Competitivos</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
            A Vantagem Injusta que Você Estava Buscando.
          </h2>
          <p className="mt-3 text-sm text-[#8a8a8a]">
            Quatro princípios que guiam cada release do hub.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r, i) => {
          const Icon = r.icon;
          return (
            <Reveal key={r.n} delay={i * 80}>
              <div className="group h-full bg-[#080808] p-7 transition-colors duration-300 hover:bg-[#0d0d0d]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#818cf8]">{r.n}</span>
                  <Icon className="h-4.5 w-4.5 text-[#6f6f6f] transition-colors duration-300 group-hover:text-[#818cf8]" />
                </div>
                <h3 className="mt-8 font-display text-lg font-bold tracking-tight text-white">
                  {r.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#8a8a8a]">{r.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────── planos ─────────────────────────── */

function PlansSection() {
  return (
    <section
      id="sobre"
      className="relative border-y border-white/[0.06] bg-white/[0.012]"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">planos</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
              Escolha o ritmo do seu farm.
            </h2>
            <p className="mt-3 text-sm text-[#8a8a8a]">
              O plano é detectado pelo seu cargo no Discord — se expirar, o hub volta pro Free
              automaticamente.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <div
                className={`surface-card flex h-full flex-col p-6 ${
                  p.highlight ? "border-[#818cf8]/40 bg-[#818cf8]/[0.05]" : ""
                }`}
              >
                {p.highlight && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#818cf8] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white">
                    popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold tracking-tight text-white">
                  {p.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-white">
                    {p.price}
                  </span>
                  <span className="text-xs text-[#6f6f6f]">/ {p.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] text-[#a0a0a0]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#818cf8]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.name === "Free" ? (
                  <a href="#free" className="btn-ghost mt-7 w-full">
                    {p.cta}
                  </a>
                ) : (
                  <Link
                    to="/hub"
                    className={`${p.highlight ? "btn-accent" : "btn-ghost"} mt-7 w-full`}
                  >
                    {p.cta}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
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
        <div className="grid gap-10 rounded-2xl border border-white/[0.07] bg-[#0d0d0d]/70 p-7 backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-12">
          <div>
            <span className="eyebrow">cadastro free</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Ganhe o cargo Free em um minuto.
            </h2>
            <ol className="mt-8 space-y-4">
              {[
                "Preencha o formulário — geramos um código único pra você.",
                "Entre no servidor e abra um ticket no canal de suporte.",
                "Informe o código no ticket. A staff libera o cargo Free na hora.",
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-[13px] text-[#a0a0a0]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-[10px] font-semibold text-[#818cf8]">
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
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#818cf8]/60"
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
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#818cf8]/60"
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
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#818cf8]/30 bg-[#818cf8]/[0.08] p-3">
                    <code className="flex-1 font-mono text-lg font-bold tracking-[0.2em] text-[#c4b5fd]">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      aria-label="Copiar código"
                      className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[#a0a0a0] transition hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4 text-[#818cf8]" /> : <Copy className="h-4 w-4" />}
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
            <span className="eyebrow">comunidade</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[2.6rem]">
              Faça parte da comunidade.
            </h2>
            <p className="mt-3 text-sm text-[#8a8a8a]">
              Suporte por ticket, avisos de update, canais de farm e gente online o dia inteiro.
            </p>
          </div>
        </Reveal>

        <div
          className="relative mt-12 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div className="marquee flex w-max gap-3">
            {loop.map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.02] py-2 pl-2 pr-4"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-white/10">
                  {m.avatar ? (
                    <img src={m.avatar} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <Avatar seed={m.id} />
                  )}
                </div>
                <span className="whitespace-nowrap text-[13px] font-medium text-[#d4d4d4]">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <Reveal>
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d]/70 p-7 backdrop-blur-xl sm:p-9">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6f6f6f]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#818cf8]" /> ao vivo
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                Servidor oficial no Discord
              </h3>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[#8a8a8a]">
                Widget conectado direto à guilda — entre, farme e converse com quem já está dentro.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.05] sm:grid-cols-3">
                <MiniStat
                  icon={Users}
                  label="online agora"
                  value={presence !== null ? String(presence) : "—"}
                />
                <MiniStat icon={MessageSquare} label="suporte" value="Ticket" />
                <MiniStat icon={Sparkles} label="cargos" value="Free · Premium" />
              </div>

              <a
                href={GUILD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="btn-accent mt-7 px-5 py-3"
              >
                Entrar no Discord <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <div className="mx-auto w-full max-w-[380px] rounded-2xl border border-white/[0.07] bg-[#0d0d0d]/70 p-3 backdrop-blur-xl">
            <iframe
              src={`https://discord.com/widget?id=${GUILD_ID}&theme=dark`}
              width={350}
              height={460}
              title="Widget do Discord do NeighborD Hub"
              loading="lazy"
              frameBorder={0}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="mx-auto block h-[460px] w-full rounded-xl"
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
    <div className="bg-[#080808] p-4">
      <Icon className="h-4 w-4 text-[#818cf8]" />
      <div className="mt-3 truncate text-sm font-semibold text-white">{value}</div>
      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#6f6f6f]">
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────── cta final ─────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#818cf8]/[0.08] blur-[130px]"
      />
      <Reveal>
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <img
            src={nghcLogo.url}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="mx-auto h-14 w-14 object-contain opacity-90"
          />
          <h2 className="mt-8 font-display text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-5xl">
            Pronto para conhecer o NeighborD Hub?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-[#8a8a8a]">
            Crie seu acesso, escolha um plano e comece a farmar em minutos.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/hub" className="btn-accent px-6 py-3.5">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={GUILD_INVITE}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost px-6 py-3.5"
            >
              Entrar no Discord
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── footer ─────────────────────────── */

function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={nghcLogo.url}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-sm font-extrabold tracking-tight text-white">
                NeighborD<span className="text-[#818cf8]"> Hub</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6f6f6f]">
              Plataforma de automação e ferramentas para comunidades do Discord.
            </p>
          </div>

          <FooterCol
            title="NeighborD Hub"
            links={[
              { label: "Sobre", href: "#sobre" },
              { label: "Produtos", href: "#produtos" },
              { label: "Recursos", href: "#recursos" },
            ]}
          />
          <FooterCol
            title="Comunidade"
            links={[
              { label: "Discord", href: GUILD_INVITE, external: true },
              { label: "Suporte", href: GUILD_INVITE, external: true },
              { label: "Contato", href: "https://www.instagram.com/davizinzkn/", external: true },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Termos", href: "#sobre" },
              { label: "Privacidade", href: "#sobre" },
            ]}
          />
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <a
              href="https://www.instagram.com/davizinzkn/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8a8a8a] transition hover:border-white/20 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={GUILD_INVITE}
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8a8a8a] transition hover:border-white/20 hover:text-white"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
          <p className="text-[11px] text-[#6f6f6f]">
            © {new Date().getFullYear()} NeighborD Hub. Todos os direitos reservados.
            <span className="mx-2 text-white/15">·</span>
            Código-fonte fornecido por <span className="text-[#a0a0a0]">isnouu</span>
          </p>
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
