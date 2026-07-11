import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
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
        }
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Erro de rede ao carregar perfil";
        setLoadError(msg);
        toast.error(msg);
      });

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
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-xl border border-amber/30 bg-surface/60 p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber to-transparent" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
            $ status --token
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Nenhum token configurado</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-dim">
            Cole seu token do Discord para o hub começar a executar missões. Ele fica salvo apenas
            no seu navegador (localStorage).
          </p>
          <Link
            to="/settings"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110"
          >
            → configurar token
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-dim">Visão geral da sua conta e estatísticas.</p>
        </div>
        {running && (
          <button
            onClick={requestStop}
            className="shrink-0 rounded-md border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-rose hover:bg-rose/20 sm:px-4"
          >
            ■ stop
          </button>
        )}
      </div>

      {/* Avisos / Notificações */}
      <NotificationsCard />


      {/* Unified profile + stats + account */}
      <section
        className="overflow-hidden rounded-3xl border border-line bg-surface/40 backdrop-blur-xl"
        style={{ boxShadow: "0 30px 80px -40px color-mix(in oklab, var(--purple) 55%, transparent), inset 0 1px 0 color-mix(in oklab, white 4%, transparent)" }}
      >

        {loadError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose sm:px-6">
            <div>
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.25em] text-rose/80">
                ⚠ perfil
              </span>
              {loadError}
            </div>
            <Link
              to="/settings"
              className="rounded border border-rose/40 bg-rose/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-rose hover:bg-rose/20"
            >
              revisar token
            </Link>
          </div>
        )}
        {/* Banner */}
        <div
          className="relative h-28 w-full sm:h-40"
          style={
            bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: accentBg }
          }
        >
          {!bannerUrl && <div className="absolute inset-0 grid-bg opacity-30" />}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
        </div>


        {/* Identity row */}
        <div className="flex flex-col gap-4 px-4 pb-5 pt-4 sm:flex-row sm:items-start sm:gap-5 sm:px-6">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={user?.username ?? "avatar"}
              width={96}
              height={96}
              decoding="async"
              fetchPriority="high"
              className="h-20 w-20 shrink-0 rounded-full border-4 border-surface object-cover sm:h-24 sm:w-24"
              style={{ boxShadow: "0 0 24px -4px color-mix(in oklab, var(--purple) 60%, transparent)" }}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-semibold text-ink sm:text-2xl">
                {user?.global_name || user?.username || "—"}
              </h2>
              {user?.mfa_enabled && (
                <span className="rounded border border-mint/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-mint">
                  2fa
                </span>
              )}
              {user?.premium_type ? (
                <span className="rounded border border-purple/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-purple">
                  nitro
                </span>
              ) : null}
            </div>
            {user?.username && (
              <div className="mt-0.5 truncate font-mono text-xs text-ink-mute">@{user.username}</div>
            )}
            {/* Insígnias (Discord flags) — só ícones inline */}
            {user?.flags ? (
              <TooltipProvider delayDuration={100}>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {USER_BADGES.filter((b) => (user.flags ?? 0) & b.bit).map((b) => (
                    <Tooltip key={b.label}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={b.label}
                          className="shrink-0 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
                        >
                          <img
                            src={`https://cdn.discordapp.com/badge-icons/${b.icon}.png`}
                            alt={b.label}
                            width={20}
                            height={20}
                            loading="lazy"
                            className="h-5 w-5"
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="font-mono text-[11px]">
                        {b.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            ) : null}


          </div>
          {user?.id && (
            <div className="flex shrink-0 flex-wrap gap-2 self-start sm:flex-col sm:self-end">
              <button
                onClick={copyId}
                className="rounded border border-purple/40 bg-purple/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-purple hover:bg-purple/20"
              >
                copiar id
              </button>
              <a
                href={`https://discord.com/users/${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-cyan/40 bg-cyan/10 px-2 py-1 text-center font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20"
              >
                abrir perfil
              </a>
            </div>
          )}
        </div>

        {/* Bio */}
        {stats.bio && (
          <div className="border-t border-line/60 px-4 py-4 sm:px-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
              <span className="text-cyan">◆</span> bio
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-dim">{stats.bio}</p>
          </div>
        )}

        {/* Stat grid (primary) */}
        <div className="grid gap-2 border-t border-line/60 px-4 py-4 sm:grid-cols-2 sm:gap-3 sm:px-6 lg:grid-cols-3">
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
          <div className="border-t border-line/60 px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-mute">
              <span className="text-purple">◆</span> detalhes da conta
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
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

      {/* Missões, log e execução movidos para /missoes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/missoes"
          className="card-hover group flex items-center justify-between gap-3 rounded-2xl border border-line bg-gradient-to-br from-cyan/[0.08] via-surface/40 to-purple/[0.08] px-6 py-5 backdrop-blur-md"
        >
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan">
              $ next
            </div>
            <div className="mt-1.5 text-lg font-semibold tracking-tight text-ink">Ir para Missões</div>
            <div className="mt-1 truncate text-xs text-ink-dim">
              {quests.length > 0
                ? `${quests.length} carregadas · ${orbQuests} com Orbs`
                : "Rode um scan para ver o que está disponível"}
            </div>
          </div>
          <span className="font-mono text-2xl text-cyan opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </Link>
        <Link
          to="/history"
          className="card-hover group flex items-center justify-between gap-3 rounded-2xl border border-line bg-gradient-to-br from-purple/[0.08] via-surface/40 to-cyan/[0.05] px-6 py-5 backdrop-blur-md"
        >
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-purple">
              $ log
            </div>
            <div className="mt-1.5 text-lg font-semibold tracking-tight text-ink">Ver Histórico</div>
            <div className="mt-1 truncate text-xs text-ink-dim">
              {runsCount} execuções registradas
            </div>
          </div>
          <span className="font-mono text-2xl text-purple opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </Link>
      </div>


      <QuickActions />

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

  const leaveAll = () => {
    if (!confirm("Tem certeza que quer sair de TODOS os servidores? Ação irreversível.")) return;
    toast("Ação bloqueada por segurança — confirme via suporte", {
      description: "Prevenção contra cliques acidentais",
    });
  };

  return (
    <section className="min-w-0 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Ações Rápidas</h2>
        <p className="mt-0.5 text-xs text-ink-dim">Atalhos para as funções mais usadas.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {/* UserInfo Premium */}
        <div className="rounded-xl border border-cyan/30 bg-surface/60 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan">
            <span>◎</span> UserInfo Premium
          </div>
          <p className="text-xs leading-relaxed text-ink-dim">
            Consulte badges, idade, servidores em comum e banner de qualquer usuário.
          </p>
          <input
            value={profileId}
            onChange={(e) => setProfileId(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))}
            placeholder="ID do usuário (deixe vazio para você)"
            className="mt-3 w-full rounded-md border border-line bg-background px-3 py-2 font-mono text-xs text-ink outline-none focus:border-cyan"
          />
          <button
            onClick={searchProfile}
            disabled={loadingProfile}
            className="mt-2 w-full rounded-md border border-cyan/50 bg-cyan/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan transition hover:bg-cyan/25 disabled:opacity-40"
          >
            {loadingProfile ? "buscando…" : "Buscar Perfil"}
          </button>
          {foundUser && (
            <div className="mt-3 rounded-md border border-line/60 bg-background/60 p-2.5 text-xs">
              <div className="font-semibold text-ink">
                {(foundUser.global_name as string) || (foundUser.username as string)}
              </div>
              <div className="font-mono text-[10px] text-ink-mute">@{foundUser.username as string} · {foundUser.id as string}</div>
              <a
                href={`https://discord.com/users/${foundUser.id as string}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-cyan hover:underline"
              >
                → abrir no discord
              </a>
            </div>
          )}
        </div>

        {/* Limpar Mensagens */}
        <div className="rounded-xl border border-purple/30 bg-surface/60 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-purple">
            <span>⌫</span> Limpar Mensagens
          </div>
          <p className="text-xs leading-relaxed text-ink-dim">
            Apague rapidamente suas mensagens de uma DM ou canal de servidor.
          </p>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <input
              value={clearTarget}
              onChange={(e) => setClearTarget(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))}
              placeholder="ID do usuário ou canal"
              className="rounded-md border border-line bg-background px-3 py-2 font-mono text-xs text-ink outline-none focus:border-purple"
            />
            <select
              value={clearMode}
              onChange={(e) => setClearMode(e.target.value as "dm" | "channel")}
              className="rounded-md border border-line bg-background px-2 py-2 font-mono text-xs text-ink outline-none focus:border-purple"
            >
              <option value="dm">DM</option>
              <option value="channel">Canal</option>
            </select>
          </div>
          <button
            onClick={clearMessages}
            className="mt-2 w-full rounded-md border border-purple/50 bg-purple/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-purple transition hover:bg-purple/25"
          >
            Limpar
          </button>

          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-mute">
            <span className="font-mono">DMs Abertas / Amigos:</span>
            <button
              onClick={loadDms}
              disabled={loadingDms}
              className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-ink-mute hover:text-ink disabled:opacity-40"
            >
              {loadingDms ? "…" : "↻"}
            </button>
          </div>
          <div className="mt-1 max-h-32 space-y-1 overflow-y-auto pr-1">
            {dms.length === 0 && !loadingDms && (
              <div className="py-2 text-center font-mono text-[10px] text-ink-mute">nenhuma DM</div>
            )}
            {dms.map((d) => (
              <button
                key={d.id}
                onClick={() => setClearTarget(d.id)}
                className="flex w-full items-center gap-2 rounded-md border border-line/60 bg-background/40 px-2 py-1.5 text-left transition hover:border-purple/50"
              >
                {d.avatarUrl && (
                  <img src={d.avatarUrl} alt="" width={22} height={22} className="h-5 w-5 rounded-full object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] text-ink">{d.label}</div>
                  <div className="truncate font-mono text-[9px] text-ink-mute">{d.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gerenciar Servidores */}
        <div className="rounded-xl border border-mint/30 bg-surface/60 p-4">
          <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-mint">
            <span>⚙</span> Gerenciar Servidores
          </div>
          <p className="text-xs leading-relaxed text-ink-dim">
            Liste todos os servidores ou saia de todos de uma vez.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={listGuilds}
              disabled={loadingGuilds}
              className="rounded-md border border-mint/50 bg-mint/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-mint transition hover:bg-mint/25 disabled:opacity-40"
            >
              {loadingGuilds ? "…" : "Listar Servidores"}
            </button>
            <button
              onClick={leaveAll}
              className="rounded-md border border-rose/50 bg-rose/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-rose transition hover:bg-rose/20"
            >
              Sair de Todos
            </button>
          </div>
          {guildsList && (
            <div className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-md border border-line/60 bg-background/40 p-2">
              {guildsList.length === 0 ? (
                <div className="py-2 text-center font-mono text-[10px] text-ink-mute">nenhum servidor</div>
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
                      <div className="grid h-5 w-5 place-items-center rounded bg-surface font-mono text-[9px] text-ink-mute">
                        {g.name.slice(0, 1)}
                      </div>
                    )}
                    <span className="flex-1 truncate text-[11px] text-ink">{g.name}</span>
                    {g.owner && (
                      <span className="rounded border border-amber/40 px-1 font-mono text-[9px] text-amber">owner</span>
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
      title: <>O que é o Neighbors<span className="text-cyan">hub</span>?</>,
      body: (
        <>
          Automatize suas <span className="text-cyan">Discord Quests</span> em segundo
          plano — assista vídeos e "jogue" sem esforço, ganhando{" "}
          <span className="text-mint">Orbs</span> e recompensas exclusivas.
          Totalmente client-side, seu token nunca sai criptografado do seu navegador.
        </>
      ),
      action: "começar tour →",
      tone: "cyan",
    },
    discord: {
      tag: "$ comunidade",
      title: <>Entre no nosso <span className="text-purple">Discord</span></>,
      body: <>Suporte, avisos de atualização e canal exclusivo pra membros Premium e Boost.</>,
      href: "https://discord.gg/EMsfMZFyGS",
      action: "💬 abrir Discord",
      tone: "purple",
    },
    instagram: {
      tag: "$ criador",
      title: <>Siga no <span className="text-cyan">Instagram</span></>,
      body: <>Bastidores do projeto, novidades e outras coisas feitas pelo criador.</>,
      href: "https://www.instagram.com/davizinzkn/",
      action: "📸 abrir Instagram",
      tone: "cyan",
    },
    donate: {
      tag: "$ apoie",
      title: <>Ajude o projeto a continuar <span className="text-mint">gratuito</span></>,
      body: <>Servidores, domínio e desenvolvimento saem do bolso. Qualquer valor conta muito.</>,
      href: "https://livepix.gg/davizinzkngg",
      action: "💖 doar via LivePix",
      tone: "mint",
    },
  };

  const c = content[step];
  const toneBorder = { cyan: "border-cyan/40", purple: "border-purple/40", mint: "border-mint/40" }[c.tone];
  const toneBg = { cyan: "bg-cyan/10 hover:bg-cyan/20", purple: "bg-purple/10 hover:bg-purple/20", mint: "bg-mint/10 hover:bg-mint/20" }[c.tone];
  const toneText = { cyan: "text-cyan", purple: "text-purple", mint: "text-mint" }[c.tone];

  const stepOrder: Exclude<Step, null>[] = ["intro", "discord", "instagram", "donate"];
  const stepIdx = stepOrder.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/40 p-4 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md rounded-2xl border ${toneBorder} bg-surface/70 p-6 backdrop-blur-xl`}
        style={{
          boxShadow: "0 0 60px -10px color-mix(in oklab, var(--purple) 55%, transparent), 0 0 40px -20px color-mix(in oklab, var(--cyan) 60%, transparent)",
        }}
      >
        <button
          onClick={finish}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border border-line/60 text-ink-mute hover:border-cyan/50 hover:text-cyan"
        >
          ✕
        </button>
        <div className={`font-mono text-[10px] uppercase tracking-[0.3em] ${toneText}`}>
          {c.tag}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-ink">{c.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">{c.body}</p>

        <div className="mt-5 flex flex-col gap-2">
          {c.href ? (
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setTimeout(advance, 300)}
              className={`flex items-center justify-center gap-2 rounded-lg border ${toneBorder} ${toneBg} px-4 py-3 text-sm font-medium text-ink transition`}
            >
              {c.action}
            </a>
          ) : (
            <button
              onClick={advance}
              className={`rounded-lg border ${toneBorder} ${toneBg} px-4 py-3 text-sm font-medium text-ink transition`}
            >
              {c.action}
            </button>
          )}
          <button
            onClick={advance}
            className="font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-cyan"
          >
            {stepIdx === stepOrder.length - 1 ? "concluir" : "pular →"}
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {stepOrder.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIdx ? "w-6 bg-cyan" : "w-1.5 bg-line"
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
      ? "border-mint/30 text-mint"
      : badgeTone === "amber"
        ? "border-amber/30 text-amber"
        : "border-cyan/30 text-cyan";
  const hidden = sensitive && !revealed && value !== "—";
  const shown = hidden ? "•".repeat(Math.min(value.length, 14)) : value;
  return (
    <div className="rounded-lg border border-line/70 bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
          {label}
        </div>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${tone}`}>
              {badge}
            </span>
          )}
          {sensitive && value !== "—" && (
            <button
              onClick={() => setRevealed((v) => !v)}
              className="rounded border border-line/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink-mute hover:border-cyan/40 hover:text-cyan"
            >
              {revealed ? "ocultar" : "mostrar"}
            </button>
          )}
        </div>
      </div>
      <div className="mt-1.5 truncate text-sm text-ink" title={revealed ? value : undefined}>
        {shown}
      </div>
      {hint && <div className="mt-0.5 font-mono text-[10px] text-ink-mute">{hint}</div>}
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
      ? "text-cyan"
      : tone === "purple"
        ? "text-purple"
        : tone === "mint"
          ? "text-mint"
          : tone === "amber"
            ? "text-amber"
            : "text-ink";
  const border =
    tone === "cyan"
      ? "border-cyan/40"
      : tone === "purple"
        ? "border-purple/40"
        : tone === "mint"
          ? "border-mint/40"
          : tone === "amber"
            ? "border-amber/40"
            : "border-line";
  return (
    <div
      className={`card-hover group relative overflow-hidden rounded-2xl border ${border} bg-surface/50 p-4 backdrop-blur-md sm:p-5`}
      style={{
        boxShadow:
          tone === "purple"
            ? "inset 0 1px 0 color-mix(in oklab, var(--purple) 18%, transparent), 0 0 30px -18px color-mix(in oklab, var(--purple) 70%, transparent)"
            : tone === "cyan"
              ? "inset 0 1px 0 color-mix(in oklab, var(--cyan) 18%, transparent), 0 0 30px -18px color-mix(in oklab, var(--cyan) 65%, transparent)"
              : tone === "mint"
                ? "inset 0 1px 0 color-mix(in oklab, var(--mint) 15%, transparent), 0 0 30px -18px color-mix(in oklab, var(--mint) 55%, transparent)"
                : "inset 0 1px 0 color-mix(in oklab, var(--cyan) 6%, transparent)",
      }}
    >
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-mute">
        {label}
      </div>
      <div className={`mt-3 truncate font-mono text-2xl font-bold tabular-nums sm:text-3xl lg:text-4xl ${accent}`}>
        {value}
      </div>
      <div className="mt-1.5 truncate text-xs text-ink-mute">{hint}</div>
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface/60 backdrop-blur transition ${
        active
          ? "border-cyan/60 glow-cyan"
          : "border-line hover:border-cyan/40 hover:bg-surface/80"
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
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
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-mono text-xs text-ink-mute">
            sem imagem
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent" />
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${
            quest.isEnrolled
              ? "bg-mint/90 text-background"
              : "bg-cyan/90 text-background"
          }`}
        >
          {quest.isEnrolled ? "aceita" : "disponível"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{quest.questName}</h3>
          {quest.publisher && (
            <p className="mt-0.5 truncate text-xs text-ink-dim">{quest.publisher}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          {expires && <span>Expira: {expires}</span>}
          <span className="opacity-40">·</span>
          <span>{formatDuration(quest.target)}</span>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-md border px-2.5 py-1 text-xs ${
            isOrbs
              ? "border-amber/30 bg-amber/10 text-amber"
              : "border-line bg-background/40 text-ink-dim"
          }`}
        >
          <span>◈</span>
          {quest.rewardText}
        </div>

        {active && progress && (
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              <span>{progress.current}/{progress.total}</span>
              <span className="text-cyan">{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan via-mint to-amber transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onExec}
          disabled={disabled}
          title={gateHint}
          className="mt-auto rounded-md border border-line bg-background/60 px-3 py-2 text-sm font-medium text-ink transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-30"
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-cyan/30 bg-surface p-6 shadow-2xl">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
          $ verify --human
        </div>
        <h3 className="mt-2 text-lg font-semibold text-ink">Confirme que é humano</h3>
        <p className="mt-1 text-sm text-ink-dim">
          {label ?? quest?.questName ?? "Antes de executar, resolva o desafio."}
        </p>

        <div className="mt-4 rounded-lg border border-amber/40 bg-amber/10 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber">
            ⚠ aviso de risco
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-dim">
            Automatizar missões {label ? "em lote (run all) aumenta o risco de detecção e " : ""}
            viola os Termos de Serviço do Discord e pode resultar em{" "}
            <span className="text-rose">suspensão ou banimento</span> da sua conta. Use por sua conta e risco.
          </p>
        </div>

        {useTurnstile ? (
          <div className="mt-5 grid place-items-center rounded-lg border border-line bg-background/60 p-4 min-h-[80px]">
            <div ref={turnstileRef} />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 rounded-lg border border-line bg-background/60 p-3 font-mono text-xl text-ink">
            <span className="text-center">{challenge.a}</span>
            <span className="text-cyan">+</span>
            <span className="text-center">{challenge.b}</span>
            <span className="text-cyan">=</span>
            <input
              autoFocus
              inputMode="numeric"
              value={value}
              onChange={(e) => { setError(false); setValue(e.target.value.replace(/\D/g, "").slice(0, 3)); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full rounded border border-line bg-background px-2 py-1 text-center text-ink outline-none focus:border-cyan"
            />
          </div>
        )}
        {error && (
          <p className="mt-2 font-mono text-[11px] text-rose">
            {useTurnstile ? "✗ verificação falhou, tente novamente" : "✗ resposta incorreta, tente de novo"}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink"
          >
            cancelar
          </button>
          {!useTurnstile && (
            <button
              onClick={submit}
              className="flex-1 rounded-md bg-cyan px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:brightness-110"
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
    <div className="grid place-items-center rounded-xl border border-dashed border-line bg-surface/30 p-10 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
        $ scan --available
      </div>
      <p className="mt-3 max-w-sm text-sm text-ink-dim">
        Nenhuma missão carregada. Rode um scan pra ver o que o Discord tem disponível agora.
      </p>
      <button
        onClick={onScan}
        className="mt-5 rounded-md border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan hover:bg-cyan/20"
      >
        → sondar missões
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
      ? { border: "border-amber/40", bg: "bg-amber/10", text: "text-amber" }
      : plan === "premium"
        ? { border: "border-cyan/40", bg: "bg-cyan/10", text: "text-cyan" }
        : { border: "border-line", bg: "bg-surface/60", text: "text-ink-dim" };

  const dailyText = limits.daily === Infinity ? "ilimitado" : `${usedToday}/${limits.daily}`;
  const cooldownPct = cooldownLeft > 0 ? Math.min(100, (cooldownLeft / limits.cooldownMs) * 100) : 0;

  return (
    <section className={`overflow-hidden rounded-2xl border ${tone.border} ${tone.bg} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-lg border ${tone.border} font-mono text-sm font-bold ${tone.text}`}
          >
            {plan === "boost" ? "★" : plan === "premium" ? "◆" : "◯"}
          </span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
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
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan via-mint to-amber transition-all"
            style={{ width: `${100 - cooldownPct}%` }}
          />
        </div>
      )}

      {plan === "free" && (
        <p className="mt-3 font-mono text-[11px] text-ink-mute">
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
      ? "text-mint"
      : tone === "amber"
        ? "text-amber"
        : tone === "rose"
          ? "text-rose"
          : "text-ink";
  return (
    <div className="min-w-[110px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
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
        : "bg-mint/15 text-mint border-mint/30";
  const tierLabel = (t: Donor["tier"]) =>
    t === "boost" ? "Boost" : t === "premium" ? "Premium" : "Apoiador";

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
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
    <section
      className="rounded-2xl border border-purple/25 bg-surface/60 p-4 sm:p-5 backdrop-blur"
      style={{ boxShadow: "0 0 30px -20px color-mix(in oklab, var(--purple) 55%, transparent)" }}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
        <span className="text-cyan">◆</span> avisos
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((it, i) => {
          const tone =
            it.tone === "mint"
              ? "border-mint/30 bg-mint/5 text-mint"
              : it.tone === "cyan"
                ? "border-cyan/30 bg-cyan/5 text-cyan"
                : it.tone === "amber"
                  ? "border-amber/30 bg-amber/5 text-amber"
                  : "border-rose/30 bg-rose/5 text-rose";
          return (
            <li key={i} className={`rounded-lg border px-3 py-2 ${tone}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-90">
                {it.title}
              </div>
              <div className="mt-0.5 text-sm text-ink">{it.body}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
