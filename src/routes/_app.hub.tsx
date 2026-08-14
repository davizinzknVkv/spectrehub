import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
import { ArrowRight, Sparkles, Zap, Gift, LayoutDashboard, X, ShieldCheck, Mail, History, Target, Tractor, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/ds";
import { cn } from "@/lib/utils";
import { WelcomeTour } from "@/components/WelcomeTour";

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
  head: () => ({ meta: [{ title: "Hub — Spectre Hub" }] }),
  component: HubPage,
});



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

export function formatDuration(seconds: number) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m${s.toString().padStart(2, "0")}` : `${m}m`;
  }
  return `${seconds}s`;
}


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
        setUser(u as any);
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

  // Welcome Tour Logic
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  useEffect(() => {
    if (creds && !localStorage.getItem(WELCOME_KEY)) {
      const timer = setTimeout(() => setWelcomeOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [creds]);

  const closeWelcome = () => {
    localStorage.setItem(WELCOME_KEY, "true");
    setWelcomeOpen(false);
  };

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
        {/* Hero */}
        <section className="pt-2">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#c4b5fd]">
                <Sparkles className="h-3 w-3" /> hub de elite ativado
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight xs:text-5xl sm:text-6xl md:text-7xl">
                Maximize sua conta
                <br />
                <span className="text-[#7c3aed]">em minutos.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                Conecte sua conta e assuma o controle. Nossa infraestrutura automatiza as tarefas repetitivas para que você possa focar no que realmente importa. Segurança máxima com processamento local.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 rounded-none bg-[#7c3aed] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#7c3aed]/20 transition hover:bg-[#7c3aed]/90 hover:shadow-[#7c3aed]/40"
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

            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(400px 300px at 50% 50%, rgba(88,101,242,0.35), transparent 65%)",
                }}
              />
              <img
                src={logoAsset.url}
                alt="NGHC"
                className="relative mx-auto h-40 w-40 object-contain sm:h-56 sm:w-56 md:h-72 md:w-72"
                style={{
                  filter:
                    "drop-shadow(0 0 30px rgba(167,139,250,0.55)) drop-shadow(0 20px 60px rgba(88,101,242,0.55))",
                }}
              />
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
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-full rounded-xl bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-xl bg-white/5" />)}
          </div>
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

      {welcomeOpen && <WelcomeTour onDismiss={closeWelcome} />}

      <section
        className="fade-up relative overflow-hidden rounded-none border border-white/5 bg-[#030303] backdrop-blur-xl"
        style={{ boxShadow: "0 18px 50px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03)" }}
      >
        <div
          className="relative h-20 w-full sm:h-28"
          style={
            bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: accentBg }
          }
        >
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative -mt-8 flex flex-col gap-4 px-5 pb-5 sm:-mt-10 sm:flex-row sm:items-end sm:gap-5 sm:px-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#030303] ring-4 ring-[#030303] sm:h-20 sm:w-20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.username ?? "avatar"}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="text-xs font-bold text-slate-700">?</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-0.5">
              <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                {user?.global_name || user?.username || "—"}
              </h2>
              {user?.username && (
                <div className="truncate font-mono text-xs text-slate-500">@{user.username}</div>
              )}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {user?.premium_type !== undefined && user.premium_type > 0 && (
                <div className="flex items-center gap-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-purple-300">
                  <Zap className="h-2.5 w-2.5" />
                  {NITRO_LABELS[user.premium_type] || "Nitro"}
                </div>
              )}
              {profileBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img 
                        src={`https://cdn.discordapp.com/badge-icons/${badge.icon}.png`} 
                        alt={badge.description}
                        className="h-5 w-5 opacity-80 transition-opacity hover:opacity-100"
                      />
                    </TooltipTrigger>
                    <TooltipContent className={TOOLTIP_CLS}>
                      {badge.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          
          <div className="flex shrink-0 flex-wrap gap-2 self-start sm:self-end">
            {created && (
              <div className="hidden flex-col items-end sm:flex">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">criada há</span>
                <span className="text-xs font-bold text-slate-400">{formatAge(created)}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={copyId}
                className="rounded-none border border-white/[0.09] bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#c5a059]/5 hover:text-[#c5a059]"
              >
                copiar id
              </button>
              <button
                onClick={copyAvatar}
                className="rounded-none border border-white/[0.09] bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#c5a059]/5 hover:text-[#c5a059]"
              >
                copiar foto
              </button>
              <a
                href={`https://discord.com/users/${user?.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-none border border-white/[0.09] bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#c5a059]/5 hover:text-[#c5a059]"
              >
                abrir perfil
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={LayoutDashboard}
              label="Servidores"
              value={stats.guilds === null ? "…" : String(stats.guilds)}
              tone="cyan"
              hint="guilds do usuário"
            />
            <StatCard
              icon={Sparkles}
              label="Amigos"
              value={stats.friends === null ? "…" : String(stats.friends)}
              tone="mint"
              hint="relacionamentos ativos"
            />
            <StatCard
              icon={Mail}
              label="DMs"
              value={stats.dms === null ? "…" : String(stats.dms)}
              tone="purple"
              hint="conversas abertas"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-none border border-white/5 bg-[#030303] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center bg-[#c5a059]/10 text-[#c5a059]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-tight text-white">Ações Rápidas</h3>
                    <p className="text-[10px] text-slate-600">Atalhos para as funções mais usadas.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <QuickAction to="/missoes" icon={Target} title="Missões" sub="Rode um scan para ver o disponível" />
                <QuickAction to="/farms" icon={Tractor} title="Farms" sub="Automação de farm" />
                <QuickAction to="/resgatar" icon={Gift} title="Resgatar Orbs" sub="Loja de recompensas" />
                <QuickAction to="/history" icon={History} title="Histórico" sub="0 execuções" />
              </div>
            </div>

            <div className="rounded-none border border-white/5 bg-[#030303] p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center bg-[#c5a059]/10 text-[#c5a059]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">segurança & detalhes</h3>
                  <p className="text-[10px] text-slate-600">Informações críticas da conta</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoField icon={Mail} label="Email Principal" value={user?.email ?? "—"} sensitive />
                <InfoField icon={ShieldCheck} label="Autenticação 2FA" value={user?.mfa_enabled ? "ATIVADO" : "DESATIVADO"} accent={user?.mfa_enabled} />
              </div>
            </div>

            <div className="rounded-none border border-white/5 bg-[#030303] p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center bg-[#c5a059]/10 text-[#c5a059]">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">userinfo premium</h3>
                  <p className="text-[10px] text-slate-600">Consulte badges, idade, servidores em comum e banner de qualquer usuário.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="ID do usuário (deixe vazio para você)" 
                    className="w-full rounded-none border border-white/5 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white outline-none transition-colors focus:border-[#c5a059]/50 focus:bg-white/[0.04]"
                  />
                </div>
                <button className="w-full bg-[#c5a059] py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90">
                  buscar perfil
                </button>
              </div>
            </div>
          </div>

          {stats.bio && (
            <div className="rounded-none border border-white/5 bg-[#030303] p-6">
              <div className="mb-4 flex items-center gap-2">
                <History className="h-3 w-3 text-slate-600" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">sobre / bio</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 font-mono whitespace-pre-wrap">
                {stats.bio}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-[#030303] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">quest status</h3>
              <Badge variant={orbQuests > 0 ? "accent" : "default"}>
                {orbQuests} ativas
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Missões Hoje</span>
                <span className="font-bold text-white">{limits.daily === Infinity ? "∞" : `${runsCount}/${limits.daily}`}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c5a059] transition-all duration-500" 
                  style={{ width: limits.daily === Infinity ? '100%' : `${(runsCount / limits.daily) * 100}%` }}
                />
              </div>
              <p className="text-[10px] leading-relaxed text-slate-500 italic">
                {plan === 'free' ? 'Upgrade para Premium e tenha missões ilimitadas.' : 'Seu plano de elite permite execução contínua.'}
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-[#c5a059]/20 bg-[#c5a059]/5 p-6 transition-all hover:border-[#c5a059]/40">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#c5a059] mb-2">
                <Gift className="h-4 w-4" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">resgatar orbs</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Troque seus orbs acumulados por cosméticos e itens exclusivos no Spectre Hub.
              </p>
              <Link
                to="/resgatar"
                className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-[#c5a059] py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02]"
              >
                abrir loja <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon?: any; label: string; value: string; hint: string; tone: string }) {
  return (
    <div className="rounded-none border border-white/5 bg-[#030303] p-4 transition-colors hover:border-white/10">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-3 w-3 text-slate-600" />}
        <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{label}</div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] text-slate-600 uppercase tracking-tighter">{hint}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, sub }: { to: string; icon: any; title: string; sub: string }) {
  return (
    <Link 
      to={to} 
      className="group flex items-center justify-between border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-[#c5a059]/30 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 place-items-center border border-white/5 bg-white/[0.03] text-slate-400 group-hover:text-[#c5a059]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-tight text-white">{title}</div>
          <div className="truncate text-[9px] text-slate-500">{sub}</div>
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-slate-700 transition-transform group-hover:translate-x-1 group-hover:text-[#c5a059]" />
    </Link>
  );
}

function InfoField({ icon: Icon, label, value, sensitive, accent }: { icon?: any; label: string; value: string; sensitive?: boolean; accent?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const display = sensitive && !revealed ? "••••••••" : value;
  return (
    <div className="rounded-none border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-3 w-3 text-slate-600" />}
        <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{label}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn(
          "font-mono text-sm tracking-tight",
          accent ? "text-[#c5a059] font-bold" : "text-white"
        )}>
          {display}
        </span>
        {sensitive && (
          <button onClick={() => setRevealed(!revealed)} className="text-[9px] font-bold uppercase tracking-widest text-[#c5a059] hover:underline">
            {revealed ? "ocultar" : "ver"}
          </button>
        )}
      </div>
    </div>
  );
}
