import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import logoAsset from "@/assets/spectre-hub-final-logo.jpg.asset.json";
import { ArrowRight, Sparkles, Zap, Gift, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

import { toast } from "sonner";
import {
  fetchUserInfoDetailed,
  fetchUserPlan,
  fetchGuilds,
  fetchRelationshipsCount,
  fetchDMsCount,
  fetchProfileBio,
  fetchProfileBadges,
  type ProfileBadge,
  PLAN_LIMITS,
} from "@/lib/quest-runner";
import { useQuestStore, type Quest } from "@/lib/quest-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — Neighborshub" }] }),
  component: HubPage,
});


export function formatDuration(seconds: number) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m${s.toString().padStart(2, "0")}` : `${m}m`;
  }
  return `${seconds}s`;
}

const DISCORD_EPOCH = 1420070400000n;
function snowflakeDate(id: string): Date | null {
  try {
    return new Date(Number((BigInt(id) >> 22n) + DISCORD_EPOCH));
  } catch {
    return null;
  }
}

function formatAge(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years > 0) return `${years}a ${months}m`;
  if (months > 0) return `${months}m ${days % 30}d`;
  return `${days}d`;
}

// Estilo unificado dos tooltips (tema obsidiana / glass)
const TOOLTIP_CLS =
  "border border-white/10 bg-[#0b0b0b]/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-200 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl";

const NITRO_LABELS: Record<number, string> = {
  1: "Nitro Classic",
  2: "Nitro",
  3: "Nitro Basic",
};


// Discord public user flags → badge label + official icon hash
const USER_BADGES: Array<{ bit: number; label: string; tone: "cyan" | "purple" | "mint" | "amber"; icon: string }> = [
  { bit: 1 << 0, label: "STAFF", tone: "cyan", icon: "5e74e9b61934fc1f67c65515d1f7e60d" },
  { bit: 1 << 1, label: "PARTNER", tone: "purple", icon: "3f9748e53446a137a052f3454e2de41e" },
  { bit: 1 << 2, label: "HYPESQUAD EVENTS", tone: "purple", icon: "bf01d1073931f921909045f3a39fd264" },
  { bit: 1 << 3, label: "BUG HUNTER", tone: "mint", icon: "2717692c7dca7289b35297368a940dd0" },
  { bit: 1 << 6, label: "BRAVERY", tone: "amber", icon: "8a88d63823d8a71cd5e390baa45efa02" },
  { bit: 1 << 7, label: "BRILLIANCE", tone: "purple", icon: "011940fd013da3f7fb926e4a1cd2e618" },
  { bit: 1 << 8, label: "BALANCE", tone: "cyan", icon: "3aa41de486fa12454c3761e8e223442e" },
  { bit: 1 << 9, label: "EARLY SUPPORTER", tone: "purple", icon: "7060786766c9c840eb3019e725d2b358" },
  { bit: 1 << 14, label: "BUG HUNTER 2", tone: "mint", icon: "848f79194d4be5ff5f81505cbd0ce1e6" },
  { bit: 1 << 17, label: "EARLY DEV", tone: "cyan", icon: "6df5892e0f35b051f8b61eace34f4967" },
  { bit: 1 << 18, label: "MOD ALUMNI", tone: "mint", icon: "fee1624003e2fee35cb398e125dc479b" },
  { bit: 1 << 22, label: "ACTIVE DEV", tone: "mint", icon: "6bdc42827a38498929a4920da12695d9" },
  { bit: 1 << 23, label: "LEGACY USERNAME", tone: "purple", icon: "6de6d34650760ba5551a79732e98ed60" },

];

const WELCOME_KEY = "nh:welcome-dismissed";


function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const quests = useQuestStore((s) => s.quests);
  const [user, setUser] = useState<{
    username?: string;
    global_name?: string;
    id?: string;
    avatar?: string | null;
    discriminator?: string;
    email?: string;
    verified?: boolean;
    phone?: string | null;
    mfa_enabled?: boolean;
    premium_type?: number;
    locale?: string;
    banner?: string | null;
    accent_color?: number | null;
    flags?: number;
    nsfw_allowed?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    guilds: number | null;
    friends: number | null;
    dms: number | null;
    bio: string | null;
  }>({ guilds: null, friends: null, dms: null, bio: null });
  const [profileBadges, setProfileBadges] = useState<ProfileBadge[]>([]);
  const running = useQuestStore((s) => s.running);
  const plan = useQuestStore((s) => s.plan);
  const runs = useQuestStore((s) => s.runs);
  const setPlan = useQuestStore((s) => s.setPlan);
  const requestStop = useQuestStore((s) => s.requestStop);
  const runsCount = runs.length;

  useEffect(() => {
    if (!creds) return;
    setLoadError(null);
    setLoading(true);
    fetchUserInfoDetailed()
      .then((r) => {
        if (!r.ok) {
          setLoadError(r.message);
          toast.error(r.message);
          return;
        }
        const u = r.data;
        setUser(u as typeof user);
        const uid = (u as { id?: string }).id;
        const uBio = (u as { bio?: string }).bio;
        if (uBio) setStats((s) => ({ ...s, bio: uBio }));
        if (uid) {
          fetchProfileBio(uid).then((b) => b && setStats((s) => ({ ...s, bio: b }))).catch(() => {});
          fetchProfileBadges(uid).then(setProfileBadges).catch(() => {});
        }
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Erro de rede ao carregar perfil";
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));

    fetchGuilds().then((g) => setStats((s) => ({ ...s, guilds: g.length }))).catch(() => {});
    fetchRelationshipsCount()
      .then((r) => r && setStats((s) => ({ ...s, friends: r.friends })))
      .catch(() => {});
    fetchDMsCount().then((n) => n !== null && setStats((s) => ({ ...s, dms: n }))).catch(() => {});

    const refreshPlan = () => {
      fetchUserPlan()
        .then((p) => {
          if (p === null) return;
          const prev = useQuestStore.getState().plan;
          setPlan(p);
          if (prev !== "free" && p === "free") {
            toast.error(`Seu plano ${prev === "boost" ? "Boost" : "Premium"} expirou.`);
          } else if (prev === "free" && p !== "free") {
            toast.success(`Plano ${p === "boost" ? "Boost" : "Premium"} ativado!`);
          }
        })
        .catch(() => {});
    };
    refreshPlan();
    const id = setInterval(refreshPlan, 30_000);
    return () => clearInterval(id);
  }, [creds, setPlan]);

  const limits = PLAN_LIMITS[plan];

  const avatarUrl = user?.id
    ? user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(user.id) >> 22n) % 6n}.png`
    : null;

  const created = user?.id ? snowflakeDate(user.id) : null;

  const copyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    toast.success("ID copiado");
  };

  const copyAvatar = async () => {
    if (!avatarUrl) return;
    try {
      await navigator.clipboard.writeText(avatarUrl);
      toast.success("Foto do perfil copiada.");
    } catch {
      toast.error("Não foi possível copiar a foto. Copie manualmente pelo link do avatar.");
    }
  };


  const orbQuests = useMemo(
    () => quests.filter((q) => q.rewardText.includes("Orbs")).length,
    [quests],
  );

  const bannerUrl = user?.id && user.banner
    ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=1024`
    : null;
  const accentBg = user?.accent_color
    ? `#${user.accent_color.toString(16).padStart(6, "0")}`
    : "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 40%, transparent), color-mix(in oklab, var(--surface-2) 90%, transparent))";

  if (!creds) {
    return (
      <div className="space-y-14 sm:space-y-20">
        {/* Hero — mesmo estilo da home */}
        <section className="pt-2">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#c4b5fd]">
                <Sparkles className="h-3 w-3" /> hub de elite ativado
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight xs:text-5xl sm:text-6xl md:text-7xl">
                Maximize sua conta
                <br />
                <span className="text-[#818cf8]">em minutos.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                Conecte sua conta e assuma o controle. Nossa infraestrutura automatiza as tarefas repetitivas para que você possa focar no que realmente importa. Segurança máxima com processamento local.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 rounded-md bg-[#818cf8] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
                >
                  Configurar token <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 rounded-md border border-[#818cf8]/40 bg-[#818cf8]/10 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white backdrop-blur transition hover:border-[#818cf8]/70 hover:bg-[#818cf8]/20"
                >
                  Login por email
                </Link>
              </div>

              <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                ◆ o token fica só no seu navegador (localStorage)
              </div>
            </div>

            {/* Logo mark com órbitas + raio, igual à home */}
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(400px 300px at 50% 50%, rgba(88,101,242,0.35), transparent 65%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <div
                  className="h-[110%] w-[110%] rounded-full border border-[#a78bfa]/15"
                  style={{ animation: "hub-spin-slow 28s linear infinite" }}
                />
                <div
                  className="absolute h-[85%] w-[85%] rounded-full border border-[#818cf8]/20"
                  style={{ animation: "hub-spin-slow 22s linear infinite reverse" }}
                />
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-[#c4b5fd]"
                    style={{
                      boxShadow: "0 0 12px 2px #a78bfa",
                      top: `${20 + i * 12}%`,
                      left: `${15 + i * 15}%`,
                      animation: `hub-spark ${3 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
                    }}
                  />
                ))}
              </div>

              <div className="relative text-center">
                <svg
                  aria-hidden
                  viewBox="0 0 100 200"
                  className="pointer-events-none absolute -top-16 left-1/2 -z-[1] h-56 w-28 -translate-x-1/2 sm:h-72 sm:w-36 md:-top-24 md:h-96 md:w-48"
                  style={{ animation: "hub-bolt 3.2s ease-in-out infinite" }}
                >
                  <defs>
                    <linearGradient id="hub-bolt-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="35%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M62 4 L28 96 L48 96 L34 168 L74 74 L52 74 L66 4 Z"
                    fill="url(#hub-bolt-grad)"
                    stroke="#e9d5ff"
                    strokeWidth="0.8"
                  />
                </svg>
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 rounded-full sm:top-10 sm:h-24 sm:w-24 md:h-32 md:w-32"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(196,181,253,0.85), rgba(139,92,246,0.35) 45%, transparent 70%)",
                    filter: "blur(6px)",
                    animation: "hub-impact 3.2s ease-in-out infinite",
                  }}
                />
                <img
                  src={nghcLogo.url}
                  alt="NGHC"
                  className="relative mx-auto h-40 w-40 object-contain sm:h-56 sm:w-56 md:h-72 md:w-72"
                  style={{
                    filter:
                      "drop-shadow(0 0 30px rgba(167,139,250,0.55)) drop-shadow(0 20px 60px rgba(88,101,242,0.55))",
                  }}
                />
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
                  neighborshub
                </div>
              </div>

              <style>{`
                @keyframes hub-bolt {
                  0%, 100% { opacity: 0; transform: translate(-50%, -12px) scale(0.9); }
                  6%       { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
                  10%      { opacity: 0.35; }
                  14%      { opacity: 1; transform: translate(-50%, 2px) scale(1); }
                  22%      { opacity: 0; }
                  92%      { opacity: 0; }
                }
                @keyframes hub-impact {
                  0%, 100% { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
                  8%       { opacity: 1; transform: translate(-50%, 0) scale(1.15); }
                  20%      { opacity: 0; transform: translate(-50%, 0) scale(1.4); }
                }
                @keyframes hub-spin-slow { to { transform: rotate(360deg); } }
                @keyframes hub-spark {
                  0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                  50%      { transform: translate(6px, -8px); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                  svg[viewBox="0 0 100 200"],
                  [style*="hub-impact"],
                  [style*="hub-spin-slow"],
                  [style*="hub-spark"] { animation: none !important; }
                }
              `}</style>
            </div>
          </div>

          {/* Stat row estilo home */}
          <div className="mt-14 grid gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
            {[
              { value: "240+", label: "quests suportadas" },
              { value: "100+", label: "membros ativos" },
              { value: "0.18ms", label: "latência média" },
            ].map((s) => (
              <div key={s.label} className="px-2">
                <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {s.value.includes("ms") ? (
                    <>
                      {s.value.replace("ms", "")}
                      <span className="text-[#818cf8]">ms</span>
                    </>
                  ) : (
                    s.value
                  )}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status --token: aviso destacado igual à home */}
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            <Zap className="h-3 w-3" /> status --token
          </div>
          <div className="mt-4 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight xs:text-4xl sm:text-5xl">
                Autenticação <span className="text-[#818cf8]">Necessária</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Para ativar os módulos de automação, é necessário vincular sua identidade. Utilizamos criptografia local para garantir que suas credenciais <span className="text-white">nunca deixem este dispositivo</span>.
              </p>
              <Link
                to="/settings"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#818cf8] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30 transition hover:bg-[#4752c4]"
              >
                → vincular conta agora
              </Link>
            </div>
            <div className="grid gap-3">
              {[
                {
                  icon: Sparkles,
                  title: "Detecção automática",
                  desc: "Lista todas as quests ativas do seu Discord.",
                },
                {
                  icon: Zap,
                  title: "Execução em fila",
                  desc: "Run all respeita cooldowns e roda uma atrás da outra.",
                },
                {
                  icon: Gift,
                  title: "Farm de Orbs",
                  desc: "Barra por missão, log e histórico persistido.",
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-[#818cf8]/40"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#818cf8]/30 bg-[#818cf8]/10 text-[#c4b5fd]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{f.title}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }




  if (loading && !loadError) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="account --overview"
          icon={LayoutDashboard}
          title="Dashboard"
          highlight="pessoal"
          description="Visão geral da sua conta e estatísticas."
        />
        <div className="fade-up relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]/85 backdrop-blur-xl">
          <div className="relative h-20 w-full animate-pulse bg-white/[0.03] sm:h-28" />
          <div className="relative -mt-8 px-5 pb-5 sm:-mt-10 sm:px-7">
            <div className="h-16 w-16 animate-pulse rounded-xl bg-white/5 ring-4 ring-[#080808] sm:h-20 sm:w-20" />
            <div className="mt-4 space-y-2">
              <div className="h-6 w-48 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="account --overview"
        icon={LayoutDashboard}
        title="Dashboard"
        highlight="pessoal"
        description="Visão geral da sua conta e estatísticas."
        actions={
          running ? (
            <button
              onClick={requestStop}
              className="shrink-0 rounded-md border border-rose-400/40 bg-rose-500/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 sm:px-4"
            >
              ■ stop
            </button>
          ) : null
        }
      />

      <NotificationsCard />

      <section
        className="fade-up relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]/85 backdrop-blur-xl"
        style={{ boxShadow: "0 18px 50px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03)" }}
      >
        {loadError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 sm:px-6">
            <div>
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.25em] text-rose-400/80">
                ⚠ perfil
              </span>
              {loadError}
            </div>
            <Link
              to="/settings"
              className="rounded border border-rose-400/40 bg-rose-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-rose-400 hover:bg-rose-500/20"
            >
              revisar token
            </Link>
          </div>
        )}
        <div
          className="relative h-20 w-full sm:h-28"
          style={
            bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: accentBg }
          }
        >
          {!bannerUrl && <div className="absolute inset-0 grid-bg opacity-20" />}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />
        </div>

        <div className="relative -mt-8 flex flex-col gap-4 px-5 pb-5 sm:-mt-10 sm:flex-row sm:items-end sm:gap-5 sm:px-7">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={user?.username ?? "avatar"}
              width={80}
              height={80}
              decoding="async"
              fetchPriority="high"
              className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover ring-4 ring-[#080808] transition-transform duration-300 hover:scale-[1.02] sm:h-20 sm:w-20"
              style={{ boxShadow: "0 12px 30px -22px rgba(0,0,0,0.9)" }}
            />
          )}


          <div className="min-w-0 flex-1">
            <TooltipProvider delayDuration={100}>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {user?.global_name || user?.username || "—"}
                </h2>
                {user?.mfa_enabled && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        className="cursor-default rounded-md border border-emerald-400/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400 transition-colors duration-200 hover:border-emerald-400/60 hover:bg-emerald-400/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                      >
                        2fa
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className={TOOLTIP_CLS}>
                      Autenticação de dois fatores ativada
                    </TooltipContent>
                  </Tooltip>
                )}
                {user?.premium_type ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        className="cursor-default rounded-md border border-[#a78bfa]/40 bg-[#a78bfa]/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#a78bfa] transition-colors duration-200 hover:border-[#a78bfa]/70 hover:bg-[#a78bfa]/[0.14] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]/50"
                      >
                        nitro
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className={TOOLTIP_CLS}>
                      {NITRO_LABELS[user.premium_type] ?? "Assinante Nitro"}
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            </TooltipProvider>

            {user?.username && (
              <div className="mt-1 truncate font-mono text-xs text-slate-500">@{user.username}</div>
            )}

            {/* Insígnias — combina flags + badges do perfil (Nitro, Boost, Quests, etc.) */}
            {(() => {
              const flagBadges = USER_BADGES
                .filter((b) => (user?.flags ?? 0) & b.bit)
                .map((b) => ({
                  key: `flag:${b.label}`,
                  label: b.label,
                  src: `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
                }));
              const apiBadges = profileBadges.map((b) => ({
                key: `api:${b.id}`,
                label: b.description,
                src: `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
              }));
              const seen = new Set<string>();
              const all = [...apiBadges, ...flagBadges].filter((b) => {
                const k = b.src;
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
              });
              if (all.length === 0) return null;
              return (
                <TooltipProvider delayDuration={100}>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {all.map((b) => (
                      <Tooltip key={b.key}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={b.label}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#818cf8]/40 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8]/60"
                          >
                            <img
                              src={b.src}
                              alt={b.label}
                              width={20}
                              height={20}
                              loading="lazy"
                              className="h-5 w-5"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className={TOOLTIP_CLS}>
                          {b.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              );
            })()}



          </div>
          {user?.id && (
            <div className="flex shrink-0 flex-wrap gap-1.5 self-start sm:self-end">
              <button
                onClick={copyId}
                className="rounded-md border border-white/[0.09] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300 transition-all duration-200 hover:border-[#a78bfa]/50 hover:text-[#c4b5fd]"
              >
                copiar id
              </button>
              <button
                onClick={copyAvatar}
                disabled={!avatarUrl}
                className="rounded-md border border-white/[0.09] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300 transition-all duration-200 hover:border-[#a78bfa]/50 hover:text-[#c4b5fd] disabled:cursor-not-allowed disabled:opacity-40"
              >
                copiar foto
              </button>
              <a
                href={`https://discord.com/users/${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/[0.09] bg-white/[0.02] px-2.5 py-1.5 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300 transition-all duration-200 hover:border-[#818cf8]/50 hover:text-[#c4b5fd]"
              >
                abrir perfil
              </a>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="border-t border-white/[0.06] px-5 py-4 sm:px-7 sm:py-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <span className="mr-1 text-[#c4b5fd]">◆</span> bio
          </div>
          {stats.bio ? (
            <p className="max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-300">{stats.bio}</p>
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              Este usuário ainda não adicionou uma bio.
            </p>
          )}
        </div>

        {/* Stat grid (primary) */}
        <div className="grid gap-2.5 border-t border-white/[0.06] px-5 py-5 sm:grid-cols-3 sm:px-7 lg:grid-cols-6">


          <StatCard
            label="Servidores"
            value={stats.guilds === null ? "…" : String(stats.guilds)}
            tone="cyan"
            hint="guilds do usuário"
          />
          <StatCard
            label="Amigos"
            value={stats.friends === null ? "…" : String(stats.friends)}
            tone="mint"
            hint="relacionamentos ativos"
          />
          <StatCard
            label="DMs"
            value={stats.dms === null ? "…" : String(stats.dms)}
            tone="purple"
            hint="conversas abertas"
          />
          <StatCard
            label="Missões"
            value={String(quests.length)}
            tone="cyan"
            hint={`${orbQuests} com orbs`}
          />
          <StatCard
            label="Idade da conta"
            value={created ? String(Math.floor((Date.now() - created.getTime()) / 86400000)) : "—"}
            tone="purple"
            hint={created ? `dias · ${created.toLocaleDateString("pt-BR")}` : "—"}
          />
          <StatCard
            label="Plano"
            value={limits.label}
            tone={plan === "boost" ? "mint" : plan === "premium" ? "purple" : "cyan"}
            hint={plan === "free" ? `${limits.daily}/dia · cd ${limits.cooldownMs / 60000}m` : "sem limites"}
          />
        </div>

        {/* Account details */}
        {user && (
          <div className="border-t border-white/[0.06] px-5 py-5 sm:px-7">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              <span className="text-[#a78bfa]">◆</span> detalhes da conta
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">


              <InfoField
                label="Email"
                value={user.email ?? "—"}
                badge={user.verified ? "verificado" : undefined}
                badgeTone="mint"
                sensitive
              />
              <InfoField label="Telefone" value={user.phone || "—"} sensitive />
              <InfoField
                label="2FA"
                value={user.mfa_enabled ? "ativado" : "desativado"}
                badgeTone={user.mfa_enabled ? "mint" : "amber"}
              />
              <InfoField label="Locale" value={user.locale ?? "—"} />
              <InfoField label="NSFW" value={user.nsfw_allowed ? "permitido" : "bloqueado"} />
              <InfoField label="Flags" value={String(user.flags ?? 0)} />
              <InfoField
                label="Criada em"
                value={created ? created.toLocaleDateString("pt-BR") : "—"}
                hint={created ? `há ${formatAge(created)}` : undefined}
              />
            </div>
          </div>
        )}
      </section>

      {/* Ações rápidas — atalhos para ferramentas já existentes */}
      <QuickLinks questCount={quests.length} orbQuests={orbQuests} runsCount={runsCount} />

      <QuickActions />

      <DonateBanner />

      <DonorsCard />




      <WelcomeModal />
    </div>
  );
}




function QuickActions() {
  const [profileId, setProfileId] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [foundUser, setFoundUser] = useState<Record<string, unknown> | null>(null);

  const [clearTarget, setClearTarget] = useState("");
  const [clearMode, setClearMode] = useState<"dm" | "channel">("dm");

  const [dms, setDms] = useState<Array<{ id: string; label: string; sub: string; avatarUrl: string | null }>>([]);
  const [loadingDms, setLoadingDms] = useState(false);

  const [guildsList, setGuildsList] = useState<Array<{ id: string; name: string; icon: string | null; owner: boolean }> | null>(null);
  const [loadingGuilds, setLoadingGuilds] = useState(false);

  const loadDms = async () => {
    setLoadingDms(true);
    try {
      const { fetchDMChannels } = await import("@/lib/quest-runner");
      const list = await fetchDMChannels();
      const mapped = list.slice(0, 30).map((c) => {
        const r = c.recipients?.[0];
        const label = c.name || r?.global_name || r?.username || "Grupo";
        const sub = r ? `@${r.username}` : `${c.recipients?.length ?? 0} pessoas`;
        const avatarUrl = r?.avatar && r.id
          ? `https://cdn.discordapp.com/avatars/${r.id}/${r.avatar}.png?size=64`
          : r?.id
            ? `https://cdn.discordapp.com/embed/avatars/${(BigInt(r.id) >> 22n) % 6n}.png`
            : null;
        return { id: c.id, label, sub, avatarUrl };
      });
      setDms(mapped);
    } catch {
      toast.error("Falha ao carregar DMs");
    } finally {
      setLoadingDms(false);
    }
  };

  useEffect(() => { loadDms(); }, []);

  const searchProfile = async () => {
    setLoadingProfile(true);
    setFoundUser(null);
    try {
      const { fetchUserById, fetchUserInfo } = await import("@/lib/quest-runner");
      const id = profileId.trim();
      const u = id ? await fetchUserById(id) : await fetchUserInfo();
      if (!u) { toast.error("Usuário não encontrado"); return; }
      setFoundUser(u);
    } catch {
      toast.error("Erro ao buscar perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const listGuilds = async () => {
    setLoadingGuilds(true);
    try {
      const { fetchGuilds } = await import("@/lib/quest-runner");
      const list = await fetchGuilds();
      setGuildsList(list);
    } catch {
      toast.error("Erro ao listar servidores");
    } finally {
      setLoadingGuilds(false);
    }
  };

  const clearMessages = () => {
    const t = clearTarget.trim();
    if (!t) { toast.error("Informe um ID"); return; }
    toast("Limpeza em fila — recurso em finalização", {
      description: `${clearMode === "dm" ? "DM" : "Canal"}: ${t}`,
    });
  };

  const leaveAll = async () => {
    if (!confirm("Tem certeza que quer sair de TODOS os servidores? Ação irreversível.")) return;
    setLoadingGuilds(true);
    try {
      const { fetchGuilds, leaveGuild, sleep } = await import("@/lib/quest-runner");
      const list = await fetchGuilds();
      if (list.length === 0) {
        toast.info("Você não está em nenhum servidor.");
        return;
      }
      toast.info(`Saindo de ${list.length} servidores...`);
      let count = 0;
      for (const g of list) {
        if (g.owner) continue; // Skip owned servers to avoid errors
        const ok = await leaveGuild(g.id);
        if (ok) count++;
        await sleep(1000 + Math.random() * 1000); // Respect rate limits
      }
      toast.success(`Você saiu de ${count} servidores.`);
      listGuilds(); // Refresh list
    } catch {
      toast.error("Erro ao processar saída dos servidores");
    } finally {
      setLoadingGuilds(false);
    }
  };

  return (
    <section className="min-w-0 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Ações Rápidas</h2>
        <p className="mt-0.5 text-xs text-slate-400">Atalhos para as funções mais usadas.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {/* UserInfo Premium */}
        <div className="rounded-xl border border-[#818cf8]/30 bg-white/5 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#c4b5fd]">
            <span>◎</span> UserInfo Premium
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Consulte badges, idade, servidores em comum e banner de qualquer usuário.
          </p>
          <input
            value={profileId}
            onChange={(e) => setProfileId(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))}
            placeholder="ID do usuário (deixe vazio para você)"
            className="mt-3 w-full rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#818cf8]"
          />
          <button
            onClick={searchProfile}
            disabled={loadingProfile}
            className="mt-2 w-full rounded-md border border-[#818cf8]/50 bg-[#818cf8]/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#c4b5fd] transition hover:bg-[#818cf8]/25 disabled:opacity-40"
          >
            {loadingProfile ? "buscando…" : "Buscar Perfil"}
          </button>
          {foundUser && (
            <div className="mt-3 rounded-md border border-white/10 bg-black/40 p-2.5 text-xs">
              <div className="font-semibold text-white">
                {(foundUser.global_name as string) || (foundUser.username as string)}
              </div>
              <div className="font-mono text-[10px] text-slate-500">@{foundUser.username as string} · {foundUser.id as string}</div>
              <a
                href={`https://discord.com/users/${foundUser.id as string}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-[#c4b5fd] hover:underline"
              >
                → abrir no discord
              </a>
            </div>
          )}
        </div>

        {/* Limpar Mensagens */}
        <div className="rounded-xl border border-[#a78bfa]/30 bg-white/5 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#a78bfa]">
            <span>⌫</span> Limpar Mensagens
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Apague rapidamente suas mensagens de uma DM ou canal de servidor.
          </p>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <input
              value={clearTarget}
              onChange={(e) => setClearTarget(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))}
              placeholder="ID do usuário ou canal"
              className="rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#a78bfa]"
            />
            <select
              value={clearMode}
              onChange={(e) => setClearMode(e.target.value as "dm" | "channel")}
              className="rounded-md border border-white/10 bg-[#0b0d12] px-2 py-2 font-mono text-xs text-white outline-none focus:border-[#a78bfa]"
            >
              <option value="dm">DM</option>
              <option value="channel">Canal</option>
            </select>
          </div>
          <button
            onClick={clearMessages}
            className="mt-2 w-full rounded-md border border-[#a78bfa]/50 bg-[#a78bfa]/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#a78bfa] transition hover:bg-[#a78bfa]/25"
          >
            Limpar
          </button>

          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500">
            <span className="font-mono">DMs Abertas / Amigos:</span>
            <button
              onClick={loadDms}
              disabled={loadingDms}
              className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-slate-500 hover:text-white disabled:opacity-40"
            >
              {loadingDms ? "…" : "↻"}
            </button>
          </div>
          <div className="mt-1 max-h-32 space-y-1 overflow-y-auto pr-1">
            {dms.length === 0 && !loadingDms && (
              <div className="py-2 text-center font-mono text-[10px] text-slate-500">nenhuma DM</div>
            )}
            {dms.map((d) => (
              <button
                key={d.id}
                onClick={() => setClearTarget(d.id)}
                className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-left transition hover:border-[#a78bfa]/50"
              >
                {d.avatarUrl && (
                  <img src={d.avatarUrl} alt="" width={22} height={22} className="h-5 w-5 rounded-full object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] text-white">{d.label}</div>
                  <div className="truncate font-mono text-[9px] text-slate-500">{d.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gerenciar Servidores */}
        <div className="rounded-xl border border-emerald-400/30 bg-white/5 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald-400">
            <span>⚙</span> Gerenciar Servidores
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Liste todos os servidores ou saia de todos de uma vez.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={listGuilds}
              disabled={loadingGuilds}
              className="rounded-md border border-emerald-400/50 bg-emerald-500/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400 transition hover:bg-emerald-500/25 disabled:opacity-40"
            >
              {loadingGuilds ? "…" : "Listar Servidores"}
            </button>
            <button
              onClick={leaveAll}
              className="rounded-md border border-rose-400/50 bg-rose-500/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400 transition hover:bg-rose-500/20"
            >
              Sair de Todos
            </button>
          </div>
          {guildsList && (
            <div className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-md border border-white/10 bg-black/40 p-2">
              {guildsList.length === 0 ? (
                <div className="py-2 text-center font-mono text-[10px] text-slate-500">nenhum servidor</div>
              ) : (
                guildsList.map((g) => (
                  <div key={g.id} className="flex items-center gap-2 py-1">
                    {g.icon ? (
                      <img
                        src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=32`}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded object-cover"
                      />
                    ) : (
                      <div className="grid h-5 w-5 place-items-center rounded bg-white/5 font-mono text-[9px] text-slate-500">
                        {g.name.slice(0, 1)}
                      </div>
                    )}
                    <span className="flex-1 truncate text-[11px] text-white">{g.name}</span>
                    {g.owner && (
                      <span className="rounded border border-amber-400/40 px-1 font-mono text-[9px] text-amber-300">owner</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


type Step = "intro" | "discord" | "instagram" | "donate" | null;

function WelcomeModal() {
  const [step, setStep] = useState<Step>(null);
  useEffect(() => {
    try {
      if (!localStorage.getItem(WELCOME_KEY)) setStep("intro");
    } catch {
      setStep("intro");
    }
  }, []);
  const finish = () => {
    try { localStorage.setItem(WELCOME_KEY, "1"); } catch { /* noop */ }
    setStep(null);
  };
  if (!step) return null;

  const next: Record<Exclude<Step, null>, Step> = {
    intro: "discord",
    discord: "instagram",
    instagram: "donate",
    donate: null,
  };
  const advance = () => {
    const n = next[step];
    if (n === null) finish();
    else setStep(n);
  };

  const content: Record<Exclude<Step, null>, {
    tag: string;
    title: React.ReactNode;
    body: React.ReactNode;
    href?: string;
    action: string;
    tone: "cyan" | "purple" | "mint";
  }> = {
    intro: {
      tag: "$ bem-vindo",
      title: <>O que é o Neighbors<span className="text-[#c4b5fd]">hub</span>?</>,
      body: (
        <>
          Automatize suas <span className="text-[#c4b5fd]">Discord Quests</span> em segundo
          plano — assista vídeos e "jogue" sem esforço, ganhando{" "}
          <span className="text-emerald-400">Orbs</span> e recompensas exclusivas.
          Totalmente client-side, seu token nunca sai criptografado do seu navegador.
        </>
      ),
      action: "começar tour →",
      tone: "cyan",
    },
    discord: {
      tag: "$ comunidade",
      title: <>Entre no nosso <span className="text-[#a78bfa]">Discord</span></>,
      body: <>Suporte, avisos de atualização e canal exclusivo pra membros Premium e Boost.</>,
      href: "https://discord.gg/JK7cC9je87",
      action: "💬 abrir Discord",
      tone: "purple",
    },
    instagram: {
      tag: "$ criador",
      title: <>Siga no <span className="text-[#c4b5fd]">Instagram</span></>,
      body: <>Bastidores do projeto, novidades e outras coisas feitas pelo criador.</>,
      href: "https://www.instagram.com/davizinzkn/",
      action: "📸 abrir Instagram",
      tone: "cyan",
    },
    donate: {
      tag: "$ apoie",
      title: <>Ajude o projeto a continuar <span className="text-emerald-400">gratuito</span></>,
      body: <>Servidores, domínio e desenvolvimento saem do bolso. Qualquer valor conta muito.</>,
      href: "https://livepix.gg/davizinzkngg",
      action: "💖 doar via LivePix",
      tone: "mint",
    },
  };

  const c = content[step];
  const toneBorder = { cyan: "border-[#818cf8]/40", purple: "border-[#a78bfa]/40", mint: "border-emerald-400/40" }[c.tone];
  const toneBg = { cyan: "bg-[#818cf8]/10 hover:bg-[#818cf8]/20", purple: "bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20", mint: "bg-emerald-500/10 hover:bg-emerald-500/20" }[c.tone];
  const toneText = { cyan: "text-[#c4b5fd]", purple: "text-[#a78bfa]", mint: "text-emerald-400" }[c.tone];

  const stepOrder: Exclude<Step, null>[] = ["intro", "discord", "instagram", "donate"];
  const stepIdx = stepOrder.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-md">
      <div
        className={`ds-card relative w-full max-w-md border ${toneBorder} p-6`}
      >
        <button
          onClick={finish}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border border-white/10 text-slate-500 hover:border-[#818cf8]/50 hover:text-[#c4b5fd]"
        >
          ✕
        </button>
        <div className={`font-mono text-[10px] uppercase tracking-[0.3em] ${toneText}`}>
          {c.tag}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>

        <div className="mt-5 flex flex-col gap-2">
          {c.href ? (
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setTimeout(advance, 300)}
              className={`flex items-center justify-center gap-2 rounded-lg border ${toneBorder} ${toneBg} px-4 py-3 text-sm font-medium text-white transition`}
            >
              {c.action}
            </a>
          ) : (
            <button
              onClick={advance}
              className={`rounded-lg border ${toneBorder} ${toneBg} px-4 py-3 text-sm font-medium text-white transition`}
            >
              {c.action}
            </button>
          )}
          <button
            onClick={advance}
            className="font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-[#c4b5fd]"
          >
            {stepIdx === stepOrder.length - 1 ? "concluir" : "pular →"}
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {stepOrder.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIdx ? "w-6 bg-[#818cf8]" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}



function InfoField({
  label,
  value,
  hint,
  badge,
  badgeTone,
  sensitive,
}: {
  label: string;
  value: string;
  hint?: string;
  badge?: string;
  badgeTone?: "cyan" | "mint" | "amber";
  sensitive?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const tone =
    badgeTone === "mint"
      ? "border-emerald-400/30 text-emerald-400"
      : badgeTone === "amber"
        ? "border-amber-400/30 text-amber-300"
        : "border-[#818cf8]/30 text-[#c4b5fd]";
  const hidden = sensitive && !revealed && value !== "—";
  const shown = hidden ? "•".repeat(Math.min(value.length, 14)) : value;
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-[#111111]/70 p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-[#141414]/90">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
        {label}
      </div>
      <div
        className="mt-3 truncate text-sm text-white/90 transition-opacity duration-300"
        title={revealed ? value : undefined}
      >
        {shown}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {badge && (
          <span className={`rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] ${tone}`}>
            {badge}
          </span>
        )}
        {sensitive && value !== "—" && (
          <button
            onClick={() => setRevealed((v) => !v)}
            className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 transition-colors duration-200 hover:border-[#818cf8]/40 hover:text-[#c4b5fd]"
          >
            {revealed ? "ocultar" : "mostrar"}
          </button>
        )}
        {hint && <span className="font-mono text-[10px] text-slate-600">{hint}</span>}
      </div>
    </div>
  );
}

const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "cyan" | "purple" | "mint" | "amber" | "mute";
}) {
  const accent =
    tone === "cyan"
      ? "text-[#c4b5fd]"
      : tone === "purple"
        ? "text-[#a78bfa]"
        : tone === "mint"
          ? "text-emerald-400"
          : tone === "amber"
            ? "text-amber-300"
            : "text-white";
  const border =
    tone === "cyan"
      ? "hover:border-[#818cf8]/40"
      : tone === "purple"
        ? "hover:border-[#a78bfa]/40"
        : tone === "mint"
          ? "hover:border-emerald-400/40"
          : tone === "amber"
            ? "hover:border-amber-400/40"
            : "hover:border-white/20";
  const dot =
    tone === "mint"
      ? "bg-emerald-400"
      : tone === "amber"
        ? "bg-amber-300"
        : tone === "purple"
          ? "bg-[#a78bfa]"
          : tone === "cyan"
            ? "bg-[#c4b5fd]"
            : "bg-white/40";
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#101010]/80 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#141414]/90 ${border}`}
      style={{ boxShadow: "0 1px 0 0 color-mix(in oklab, white 3%, transparent) inset" }}
    >

      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot} opacity-70 transition group-hover:opacity-100`} />
        <div className="truncate font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-slate-500">
          {label}
        </div>
      </div>
      <div className={`mt-2 truncate text-2xl font-semibold tabular-nums tracking-tight ${accent}`}>
        {value}
      </div>
      <div className="mt-1 truncate text-[11px] leading-relaxed text-slate-500">{hint}</div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${dot}`}
      />
    </div>
  );
});



export const MissionCard = memo(function MissionCard({
  quest,
  active,
  progress,
  disabled,
  gateHint,
  onExec,
}: {
  quest: Quest;
  active: boolean;
  progress: { current: number; total: number } | null;
  disabled: boolean;
  gateHint?: string;
  onExec: () => void;
}) {
  const pct = active && progress ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0;
  const isOrbs = quest.rewardText.includes("Orbs");
  const expires = quest.expiresAt
    ? new Date(quest.expiresAt).toLocaleDateString("pt-BR")
    : null;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border transition duration-300 ${
        active
          ? "border-[color-mix(in_oklab,var(--accent-1)_45%,transparent)]"
          : "border-[var(--border-1)] hover:border-[color-mix(in_oklab,var(--accent-1)_28%,transparent)]"
      }`}
      style={{
        // selected card stays fully opaque — no transparency artefacts
        background: active ? "#101014" : "color-mix(in oklab, #0c0c0c 88%, transparent)",
        backdropFilter: active ? undefined : "blur(10px)",
        isolation: "isolate",
      }}
    >
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#08080a]">
        {quest.imageUrl ? (
          <img
            src={quest.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget;
              const tried = img.dataset.tried ?? "0";
              if (tried === "0" && quest.imageUrl) {
                img.dataset.tried = "1";
                img.src = quest.imageUrl.replace("/quests/", "/assets/quests/");
              } else if (tried === "1" && quest.imageUrl) {
                img.dataset.tried = "2";
                img.src = quest.imageUrl.replace(/\.png$/, ".jpg");
              } else {
                img.style.opacity = "0";
              }
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">
            sem imagem
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/20 to-transparent" />
        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest backdrop-blur-md ${
            quest.isEnrolled
              ? "bg-[color-mix(in_oklab,var(--ok)_18%,transparent)] text-[var(--ok)]"
              : "bg-[color-mix(in_oklab,var(--accent-1)_18%,transparent)] text-[var(--accent-soft)]"
          }`}
        >
          {quest.isEnrolled ? "aceita" : "disponível"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold tracking-tight text-[var(--text-1)]">
            {quest.questName}
          </h3>
          {quest.publisher && (
            <p className="mt-0.5 truncate text-[11px] text-[var(--text-3)]">{quest.publisher}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--text-3)]">
          {expires && <span>exp {expires}</span>}
          {expires && <span className="opacity-30">·</span>}
          <span>{formatDuration(quest.target)}</span>
          <span className="opacity-30">·</span>
          <span className={isOrbs ? "text-amber-300" : "text-[var(--text-2)]"}>
            ◈ {quest.rewardText}
          </span>
        </div>

        {active && progress && (
          <div className="mt-0.5">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[var(--text-3)]">
              <span>{progress.current}/{progress.total}</span>
              <span className="text-[var(--accent-soft)]">{pct}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#08080a]">
              <div
                className="h-full rounded-full bg-[var(--accent-1)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onExec}
          disabled={disabled}
          title={gateHint}
          className="mt-auto rounded-lg border border-[var(--border-1)] bg-[#0a0a0a] px-3 py-1.5 text-[12px] font-medium text-[var(--text-1)] transition hover:border-[color-mix(in_oklab,var(--accent-1)_45%,transparent)] hover:text-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {gateHint ?? "Completar"}
        </button>
      </div>
    </article>
  );
});


export function CaptchaModal({
  quest,
  label,
  onSolved,
  onCancel,
}: {
  quest?: Quest;
  label?: string;
  onSolved: () => void;
  onCancel: () => void;
}) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const useTurnstile = Boolean(siteKey);

  // Math fallback (used when Turnstile key isn't configured)
  const [challenge] = useState(() => ({
    a: Math.floor(Math.random() * 9) + 1,
    b: Math.floor(Math.random() * 9) + 1,
  }));
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  // Turnstile widget bootstrap
  const turnstileRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const onSolvedRef = useRef(onSolved);
  useEffect(() => { onSolvedRef.current = onSolved; }, [onSolved]);
  useEffect(() => {
    if (!useTurnstile) return;
    const SCRIPT_ID = "cf-turnstile-script";
    const render = () => {
      const ts = (window as unknown as { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string } }).turnstile;
      if (!ts || !turnstileRef.current || renderedRef.current) return;
      renderedRef.current = true;
      ts.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: () => onSolvedRef.current(),
        "error-callback": () => setError(true),
      });
    };
    if (document.getElementById(SCRIPT_ID)) { render(); return; }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [useTurnstile, siteKey]);

  const submit = () => {
    if (parseInt(value, 10) === challenge.a + challenge.b) onSolved();
    else { setError(true); setValue(""); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="ds-card w-full max-w-sm p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
          $ verify --human
        </div>
        <h3 className="mt-2 text-lg font-semibold text-white">Verificação de Segurança</h3>
        <p className="mt-1 text-sm text-slate-400">
          {label ?? quest?.questName ?? "Valide sua identidade para prosseguir com a execução."}
        </p>

        <div className="mt-4 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
            ⚠ protocolo de segurança
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
            A execução automatizada {label ? "em lote " : ""}
            pode ser interpretada como comportamento anômalo pelos sistemas de auditoria do Discord, o que pode resultar em{" "}
            <span className="text-rose-400">restrições permanentes na conta</span>. A responsabilidade operacional é integralmente do usuário.
          </p>
        </div>

        {useTurnstile ? (
          <div className="mt-5 grid place-items-center rounded-lg border border-white/10 bg-black/40 p-4 min-h-[80px]">
            <div ref={turnstileRef} />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xl text-white">
            <span className="text-center">{challenge.a}</span>
            <span className="text-[#c4b5fd]">+</span>
            <span className="text-center">{challenge.b}</span>
            <span className="text-[#c4b5fd]">=</span>
            <input
              autoFocus
              inputMode="numeric"
              value={value}
              onChange={(e) => { setError(false); setValue(e.target.value.replace(/\D/g, "").slice(0, 3)); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full rounded border border-white/10 bg-[#0b0d12] px-2 py-1 text-center text-white outline-none focus:border-[#818cf8]"
            />
          </div>
        )}
        {error && (
          <p className="mt-2 font-mono text-[11px] text-rose-400">
            {useTurnstile ? "✗ verificação falhou, tente novamente" : "✗ resposta incorreta, tente de novo"}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-white/10 px-3 py-2 font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white"
          >
            cancelar
          </button>
          {!useTurnstile && (
            <button
              onClick={submit}
              className="flex-1 rounded-md bg-[#818cf8] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:brightness-110"
            >
              confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export function EmptyState({ onScan }: { onScan: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
        $ scan --available
      </div>
      <p className="mt-3 max-w-sm text-sm text-slate-400">
        Nenhuma missão detectada na fila atual. Inicie uma varredura para identificar oportunidades disponíveis no Discord.
      </p>
      <button
        onClick={onScan}
        className="mt-5 rounded-md border border-[#818cf8]/40 bg-[#818cf8]/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#c4b5fd] hover:bg-[#818cf8]/20"
      >
        → iniciar varredura
      </button>
    </div>
  );
}

export function PlanBanner({
  plan,
  limits,
  usedToday,
  remaining,
  cooldownText,
  cooldownLeft,
}: {
  plan: "free" | "premium" | "boost";
  limits: { daily: number; cooldownMs: number; label: string };
  usedToday: number;
  remaining: number;
  cooldownText: string | null;
  cooldownLeft: number;
}) {
  const tone =
    plan === "boost"
      ? { border: "border-amber-400/30", bg: "", text: "text-amber-300" }
      : plan === "premium"
        ? { border: "border-[#818cf8]/30", bg: "", text: "text-[#c4b5fd]" }
        : { border: "", bg: "", text: "text-[#a1a1aa]" };

  const dailyText = limits.daily === Infinity ? "ilimitado" : `${usedToday}/${limits.daily}`;
  const cooldownPct = cooldownLeft > 0 ? Math.min(100, (cooldownLeft / limits.cooldownMs) * 100) : 0;

  return (
    <section className={`ds-card overflow-hidden ${tone.border} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-lg border ${tone.border} font-mono text-sm font-bold ${tone.text}`}
          >
            {plan === "boost" ? "★" : plan === "premium" ? "◆" : "◯"}
          </span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              plano ativo
            </div>
            <div className={`text-lg font-semibold ${tone.text}`}>{limits.label}</div>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap gap-4 sm:justify-end">
          <MiniStat label="uso hoje" value={dailyText} />
          <MiniStat
            label="cooldown"
            value={`${Math.floor(limits.cooldownMs / 60000)}m entre missões`}
          />
          <MiniStat
            label="próxima"
            value={cooldownText ?? (remaining > 0 ? "pronta" : "limite atingido")}
            tone={cooldownText ? "amber" : remaining > 0 ? "mint" : "rose"}
          />
        </div>
      </div>

      {cooldownLeft > 0 && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#818cf8] via-emerald-400 to-amber-400 transition-all"
            style={{ width: `${100 - cooldownPct}%` }}
          />
        </div>
      )}

      {plan === "free" && (
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Free: 3 missões/dia · 10min entre cada. Boost o servidor ou pegue o cargo Premium pra rodar sem limite diário e cooldown menor.
        </p>
      )}
    </section>
  );
}

export function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "mint" | "amber" | "rose";
}) {
  const c =
    tone === "mint"
      ? "text-emerald-400"
      : tone === "amber"
        ? "text-amber-300"
        : tone === "rose"
          ? "text-rose-400"
          : "text-white";
  return (
    <div className="min-w-[110px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 font-mono text-sm ${c}`}>{value}</div>
    </div>
  );
}


type Donor = { name: string; amount: string; tier: "boost" | "premium" | "apoiador"; note?: string };

const DONORS: Donor[] = [];

function DonorsCard() {
  const [donationsNonce, setDonationsNonce] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDonationsNonce((n) => n + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const tierStyle = (t: Donor["tier"]) =>
    t === "boost"
      ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/30"
      : t === "premium"
        ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
        : "bg-emerald-500/15 text-emerald-400 border-emerald-400/30";
  const tierLabel = (t: Donor["tier"]) =>
    t === "boost" ? "Boost" : t === "premium" ? "Premium" : "Apoiador";

  return (
    <div className="ds-card mt-6 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            💜 Doadores
          </h3>
          <p className="mt-0.5 text-xs text-white/60">
            Quem mantém o Neighborshub online. Muito obrigado!
          </p>
        </div>
        <a
          href="https://livepix.gg/davizinzkngg"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          Apoiar
        </a>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            Meta
          </div>
          <iframe
            src="https://widget.livepix.gg/embed/a54bd0f8-2254-4afe-92e0-8422aa984ff1"
            title="Meta LivePix"
            className="h-[180px] w-full rounded-lg border-0 bg-transparent"
            loading="lazy"
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            Últimas doações
          </div>
          <iframe
            key={donationsNonce}
            src={`https://widget.livepix.gg/embed/567da913-a34b-4517-8b00-2be51f004bf6?t=${donationsNonce}`}
            title="Doações LivePix"
            className="h-[360px] w-full rounded-lg border-0 bg-transparent"
            loading="lazy"
          />



        </div>
      </div>
      {DONORS.length > 0 && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DONORS.map((d, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/40 to-indigo-500/40 text-sm font-bold text-white">
                  {d.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{d.name}</div>
                  {d.note && <div className="truncate text-[11px] text-white/50">{d.note}</div>}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-xs text-white/80">{d.amount}</span>
                <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${tierStyle(d.tier)}`}>
                  {tierLabel(d.tier)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}


function NotificationsCard() {
  const runs = useQuestStore((s) => s.runs);
  const logs = useQuestStore((s) => s.logs);
  const plan = useQuestStore((s) => s.plan);
  const lastCompletedAt = useQuestStore((s) => s.lastCompletedAt);
  const limits = PLAN_LIMITS[plan];

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cdLeft = Math.max(0, lastCompletedAt + limits.cooldownMs - now);
  const lastError = logs.slice().reverse().find((l) => l.level === "error");
  const lastCompleted = runs.find((r) => r.status === "completed");

  const items: Array<{
    tone: "mint" | "cyan" | "amber" | "rose";
    title: string;
    body: string;
  }> = [];

  if (cdLeft > 0) {
    const s = Math.ceil(cdLeft / 1000);
    const m = Math.floor(s / 60);
    items.push({
      tone: "amber",
      title: "Cooldown ativo",
      body: `Próxima farm em ${m}m${(s % 60).toString().padStart(2, "0")}s (plano ${limits.label}).`,
    });
  } else if (lastCompletedAt > 0) {
    items.push({
      tone: "mint",
      title: "Pronto pra rodar",
      body: "Cooldown zerado — pode iniciar a próxima missão.",
    });
  }

  if (lastCompleted) {
    items.push({
      tone: "cyan",
      title: "Última recompensa",
      body: `${lastCompleted.quest_name} · ${lastCompleted.reward_text ?? "—"}`,
    });
  }

  if (lastError) {
    items.push({
      tone: "rose",
      title: "Último erro",
      body: lastError.text,
    });
  }

  if (items.length === 0) {
    items.push({
      tone: "cyan",
      title: "Tudo tranquilo",
      body: "Nenhum aviso no momento. Bora farmar!",
    });
  }

  return (
    <section className="ds-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
        <span className="text-[#c4b5fd]">◆</span> avisos
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((it, i) => {
          const tone =
            it.tone === "mint"
              ? "border-emerald-400/30 bg-emerald-500/5 text-emerald-400"
              : it.tone === "cyan"
                ? "border-[#818cf8]/30 bg-[#818cf8]/5 text-[#c4b5fd]"
                : it.tone === "amber"
                  ? "border-amber-400/30 bg-amber-500/5 text-amber-300"
                  : "border-rose-400/30 bg-rose-500/5 text-rose-400";
          return (
            <li key={i} className={`rounded-lg border px-3 py-2 ${tone}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-90">
                {it.title}
              </div>
              <div className="mt-0.5 text-sm text-white">{it.body}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function QuickLinks({
  questCount,
  orbQuests,
  runsCount,
}: {
  questCount: number;
  orbQuests: number;
  runsCount: number;
}) {
  const items = [
    {
      to: "/missoes" as const,
      label: "Missões",
      desc:
        questCount > 0
          ? `${questCount} carregadas · ${orbQuests} com Orbs`
          : "Rode um scan para ver o disponível",
      icon: Zap,
    },
    { to: "/farms" as const, label: "Farms", desc: "Automação de farm", icon: Sparkles },
    { to: "/resgatar" as const, label: "Resgatar Orbs", desc: "Loja de recompensas", icon: Gift },
    { to: "/history" as const, label: "Histórico", desc: `${runsCount} execuções`, icon: LayoutDashboard },
  ];

  return (
    <section className="section-stack">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
        <span className="mr-1 text-[#a78bfa]">◆</span> ações rápidas
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0c0c0c]/70 px-3.5 py-3 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#818cf8]/40 hover:bg-[#121212]/80"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#c4b5fd]">
              <it.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">
                {it.label}
              </span>
              <span className="block truncate text-[11px] text-slate-500">{it.desc}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-[#c4b5fd]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function DonateBanner() {
  return (
    <section className="section-stack">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0a]/80 p-5 backdrop-blur-xl sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 120% at 100% 0%, color-mix(in oklab, #a78bfa 12%, transparent), transparent 65%)",
          }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
              <span className="mr-1">◆</span> apoie o projeto
            </div>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
              Mantenha o NGHC no ar
            </h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">
              Doações cobrem servidores, proxies e desenvolvimento contínuo. Qualquer valor ajuda.
            </p>
          </div>
          <a
            href="https://livepix.gg/davizinzkngg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#a78bfa]/40 bg-[#a78bfa]/10 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4b5fd] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a78bfa]/20"
          >
            <Gift className="h-3.5 w-3.5" />
            doar agora
          </a>
        </div>
      </div>
    </section>
  );
}
