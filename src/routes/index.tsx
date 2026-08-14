/**
 * Spectre Hub — Industrial Design System
 * 
 * Mix: BlackNetwork (Obsidian + Pink) & HubNetwork (High Contrast + Industrial).
 * Theme: Midnight Obsidian (#030303), Spectre Pink (#ff0055).
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
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

import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";
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

import { useInView, useCountUp } from "@/components/home/hooks";
import { Reveal } from "@/components/home/Reveal";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";

import { Avatar } from "@/components/home/Avatar";

/* ─────────────────────────── page ─────────────────────────── */

function Index() {
  return (
    <div
      id="topo"
      className="relative min-h-screen overflow-x-hidden bg-[#030303] font-sans text-[#f5f5f5] antialiased selection:bg-[#ff0055]/30"
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

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main>
        <Hero guildInvite={GUILD_INVITE} fallbackMembers={FALLBACK_MEMBERS} />
        <SocialProof widgetUrl={WIDGET_URL} products={PRODUCTS} />
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


/* ─────────────────────────── produtos ─────────────────────────── */

function ProductsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="ds-h1">
              CADA SISTEMA É UM
              <br />
              MOTIVO PRO
              <br />
              JOGADOR FICAR.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 ds-body max-w-xl text-[#8a8a8a]">
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
              className={`px-4 sm:px-8 py-3 ds-label border transition-all ${
                activeTab === i
                  ? "bg-[#ff0055] border-[#ff0055] text-white"
                  : "bg-white/5 border-white/10 text-[#8a8a8a] hover:bg-white/10"
              }`}
              style={{
                clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
              }}
            >
              {p.name}
            </button>
          ))}

        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <Reveal className="relative min-h-[300px] lg:min-h-[450px] bg-white/5 border border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff0055]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-10">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-tr from-[#ff0055] to-transparent opacity-20 blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
                  alt="Laptop Preview"
                  className="relative w-full rounded-lg border border-white/10 shadow-2xl"
                />
              </div>
            </div>
          </Reveal>

          <div className="relative flex flex-col justify-center py-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#ff0055] text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <h3 className="ds-h2">
                  {PRODUCTS[activeTab].name}
                </h3>
              </div>
              <span className="mt-4 block ds-label text-[#ff0055]">
                SPECTRE-{PRODUCTS[activeTab].id.toUpperCase()}
              </span>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-8 ds-body leading-relaxed text-[#8a8a8a]">
                {PRODUCTS[activeTab].desc}
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
              {["VRPEX", "CREATIVE", "STANDALONE"].map((tag) => (
                <span key={tag} className="bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-bold text-[#8a8a8a] uppercase tracking-widest hover:text-white transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </Reveal>

            <Reveal delay={300} className="mt-12">
              <Link
                to={PRODUCTS[activeTab].to}
                className="ds-btn ds-btn-primary ds-btn-lg w-full sm:w-auto"
              >
                <Zap className="h-4 w-4" /> Quero este sistema <ArrowUpRight className="ml-1 h-3 w-3" />
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
                   <div className="h-8 w-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#ff0055] group-hover:bg-[#ff0055] group-hover:text-white transition-all">
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
            <div className={`relative group border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full transition-all hover:border-[#ff0055]/30 ${p.highlight ? 'ring-1 ring-[#ff0055]/50' : ''}`}>
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-[#ff0055] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                  Popular
                </div>
              )}
              <h3 className="text-[10px] font-bold text-[#ff0055] uppercase tracking-[0.3em] mb-4">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-display font-extrabold text-white tracking-tighter">{p.price}</span>
                <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">/ {p.period}</span>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="h-3 w-3 text-[#ff0055]" />
                    <span className="text-xs font-medium text-[#8a8a8a]">{f}</span>
                  </div>
                ))}
              </div>

              {p.name === "Free" ? (
                <a href="#free" className="text-center bg-white/5 border border-white/10 text-white font-bold py-3 px-6 text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Começar Grátis
                </a>
              ) : (
                <Link to="/hub" className={`text-center font-bold py-3 px-6 text-[11px] uppercase tracking-widest transition-all ${p.highlight ? 'bg-[#ff0055] text-white hover:bg-[#ff0055]/90' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
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
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-[10px] font-semibold text-[#ff0055]">
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
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#ff0055]/60"
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
                    className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a5a5a] focus:border-[#ff0055]/60"
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
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#ff0055]/30 bg-[#ff0055]/[0.08] p-3">
                    <code className="flex-1 font-mono text-lg font-bold tracking-[0.2em] text-[#ff0055]">
                      {code}
                    </code>
                    <button
                      type="button"
                      onClick={copy}
                      aria-label="Copiar código"
                      className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[#a0a0a0] transition hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4 text-[#ff0055]" /> : <Copy className="h-4 w-4" />}
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
                className="flex shrink-0 items-center gap-4 border border-white/5 bg-[#0a0a0a] py-3 pl-3 pr-8 transition-all hover:border-[#ff0055]/30"
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
                className="flex shrink-0 items-center gap-4 border border-white/5 bg-[#0a0a0a] py-3 pl-3 pr-8 transition-all hover:border-[#ff0055]/30"
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
              <div className="flex items-center gap-3 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff0055]">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#ff0055]" /> Conexão Direta
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
                className="mt-10 inline-flex items-center gap-3 bg-[#ff0055] px-8 py-4 font-display text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#ff0055]/90"
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
      <Icon className="h-4 w-4 text-[#ff0055]" />
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
            <a href={GUILD_INVITE} target="_blank" rel="noreferrer" className="bg-[#ff0055] text-white font-bold py-4 px-10 rounded-sm uppercase tracking-widest hover:bg-[#ff0055]/90 transition-all flex items-center gap-2">
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

