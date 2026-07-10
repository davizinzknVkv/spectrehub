import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchAvailableQuests,
  fetchGuilds,
  fetchOrbs,
  fetchUserInfo,
  fetchUserPlan,
  
  PLAN_LIMITS,
  runAll,
  runQuest,
  type Guild,
} from "@/lib/quest-runner";
import { useQuestStore, type Quest } from "@/lib/quest-store";

export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — Neighborshub" }] }),
  component: HubPage,
});


function formatDuration(seconds: number) {
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
// Icons served from https://cdn.discordapp.com/badge-icons/{hash}.png
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
];

const LOG_ALLOWED_ID = "1217795750407442473";
const WELCOME_KEY = "nh:welcome-dismissed";


function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [orbs, setOrbs] = useState<number | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [captchaFor, setCaptchaFor] = useState<Quest | null>(null);
  const [captchaAll, setCaptchaAll] = useState(false);
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
  const [loadingQuests, setLoadingQuests] = useState(false);
  const [now, setNow] = useState(Date.now());
  const running = useQuestStore((s) => s.running);
  const activeId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const logs = useQuestStore((s) => s.logs);
  const plan = useQuestStore((s) => s.plan);
  const lastCompletedAt = useQuestStore((s) => s.lastCompletedAt);
  const runs = useQuestStore((s) => s.runs);
  const setPlan = useQuestStore((s) => s.setPlan);
  const requestStop = useQuestStore((s) => s.requestStop);
  const clearLogs = useQuestStore((s) => s.clearLogs);
  const runsCount = runs.length;
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // "auto" avoids smooth-scroll animation thrash while logs stream in
    logEnd.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [logs]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!creds) return;
    fetchUserInfo()
      .then((u) => u && setUser(u as typeof user))
      .catch(() => {});
    fetchGuilds()
      .then(setGuilds)
      .catch(() => {});
    const refreshPlan = () => {
      fetchUserPlan()
        .then((p) => {
          if (p === null) return; // erro transitório — mantém plano atual
          const prev = useQuestStore.getState().plan;
          setPlan(p);
          if (prev !== "free" && p === "free") {
            toast.error(`Seu plano ${prev === "boost" ? "Boost" : "Premium"} expirou (cargo removido no Discord).`);
            useQuestStore.getState().log(`⚠️ Cargo ${prev} não encontrado — voltando ao plano Free.`, "error");
          } else if (prev === "free" && p !== "free") {
            toast.success(`Plano ${p === "boost" ? "Boost" : "Premium"} ativado!`);
          }
        })
        .catch(() => {});
    };
    refreshPlan();
    const id = setInterval(refreshPlan, 5_000);
    const onFocus = () => refreshPlan();
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshPlan();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [creds, setPlan]);

  const limits = PLAN_LIMITS[plan];
  // Memoized so the setInterval(1s) that ticks `now` doesn't re-filter/reduce runs each tick.
  const usedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const t = start.getTime();
    return runs.filter(
      (r) => r.status === "completed" && new Date(r.started_at).getTime() >= t,
    ).length;
  }, [runs]);
  const remaining = limits.daily === Infinity ? Infinity : Math.max(0, limits.daily - usedToday);
  const cooldownLeft = Math.max(0, lastCompletedAt + limits.cooldownMs - now);
  const gateBlocked = remaining <= 0 || cooldownLeft > 0;
  const cooldownSecs = Math.ceil(cooldownLeft / 1000);
  const cooldownText = cooldownLeft > 0
    ? `${Math.floor(cooldownSecs / 60)}m${(cooldownSecs % 60).toString().padStart(2, "0")}s`
    : null;


  const avatarUrl = user?.id
    ? user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(user.id) >> 22n) % 6n}.png`
    : null;

  const created = user?.id ? snowflakeDate(user.id) : null;

  const loadQuests = async () => {
    setLoadingQuests(true);
    try {
      const [q, o] = await Promise.all([fetchAvailableQuests(), fetchOrbs()]);
      setQuests(q);
      setOrbs(o);
      useQuestStore.getState().log(`🎯 ${q.length} missão(ões) disponíveis`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoadingQuests(false);
    }
  };

  const copyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    toast.success("ID copiado");
  };


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

  const { totalTarget, orbQuests } = useMemo(() => ({
    totalTarget: quests.reduce((sum, q) => sum + q.target, 0),
    orbQuests: quests.filter((q) => q.rewardText.includes("Orbs")).length,
  }), [quests]);
  const totalOrbsEarned = useMemo(
    () =>
      runs
        .filter((r) => r.status === "completed" && r.reward_text?.includes("Orbs"))
        .reduce((sum, r) => {
          const m = r.reward_text?.match(/([\d.,]+)\s*Orbs/i);
          return sum + (m ? parseInt(m[1].replace(/[.,]/g, ""), 10) || 0 : 0);
        }, 0),
    [runs],
  );

  const bannerUrl = user?.id && user.banner
    ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=1024`
    : null;
  const accentBg = user?.accent_color
    ? `#${user.accent_color.toString(16).padStart(6, "0")}`
    : "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 40%, transparent), color-mix(in oklab, var(--surface-2) 90%, transparent))";

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

      {/* Unified profile + stats + account */}
      <section
        className="overflow-hidden rounded-2xl border border-purple/25 bg-surface/60 backdrop-blur"
        style={{ boxShadow: "0 0 40px -18px color-mix(in oklab, var(--purple) 55%, transparent)" }}
      >
        {/* Banner */}
        <div
          className="relative h-24 w-full sm:h-32"
          style={
            bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: accentBg }
          }
        >
          {!bannerUrl && <div className="absolute inset-0 grid-bg opacity-30" />}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
        </div>

        {/* Identity row */}
        <div className="flex flex-col gap-4 px-4 pb-5 -mt-10 sm:flex-row sm:items-end sm:gap-5 sm:px-6">
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
            {/* Insígnias (Discord flags) */}
            {user?.flags ? (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {USER_BADGES.filter((b) => (user.flags ?? 0) & b.bit).map((b) => {
                  const tone =
                    b.tone === "cyan"
                      ? "border-cyan/40 text-cyan"
                      : b.tone === "purple"
                        ? "border-purple/40 text-purple"
                        : b.tone === "mint"
                          ? "border-mint/40 text-mint"
                          : "border-amber/40 text-amber";
                  return (
                    <span
                      key={b.label}
                      title={b.label}
                      className={`inline-flex items-center gap-1.5 rounded-md border bg-background/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${tone}`}
                    >
                      <img
                        src={`https://cdn.discordapp.com/badge-icons/${b.icon}.png`}
                        alt=""
                        width={14}
                        height={14}
                        loading="lazy"
                        className="h-3.5 w-3.5"
                      />
                      {b.label}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
          {user?.id && (
            <button
              onClick={copyId}
              className="shrink-0 self-start rounded border border-purple/40 bg-purple/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-purple hover:bg-purple/20 sm:self-end"
            >
              copiar id
            </button>
          )}
        </div>

        {/* Stat grid (primary) */}
        <div className="grid gap-2 border-t border-line/60 px-4 py-4 sm:grid-cols-2 sm:gap-3 sm:px-6 lg:grid-cols-4">
          <StatCard
            label="Usuário"
            value={user?.global_name || user?.username || "—"}
            tone="cyan"
            hint={user?.id ? `id: ${user.id}` : "—"}
          />
          <StatCard label="Servidores" value={String(guilds.length)} tone="purple" hint="entrou" />
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

      {/* Servers list moved to /clone */}




      {/* Missions section */}
      <section id="missoes" className="min-w-0 space-y-4 scroll-mt-20">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Missões</h2>
            <p className="mt-1 text-sm text-ink-dim">
              Quests disponíveis do Discord. Complete para ganhar recompensas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {quests.length > 0 && (
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                {quests.length} disponíveis
              </span>
            )}
            <button
              onClick={loadQuests}
              disabled={loadingQuests || running}
              className="rounded-md border border-cyan/50 bg-gradient-to-r from-cyan/15 to-purple/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan transition hover:from-cyan/25 hover:to-purple/25 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ boxShadow: "0 0 16px -6px color-mix(in oklab, var(--cyan) 60%, transparent)" }}
            >
              {loadingQuests ? "sondando…" : "→ scan missões"}
            </button>
            <button
              onClick={() => setCaptchaAll(true)}
              disabled={running || quests.length === 0 || remaining <= 0}
              title={remaining <= 0 ? `Limite diário do plano ${limits.label} atingido` : undefined}
              className="rounded-md border border-purple/50 bg-purple/15 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-purple transition hover:bg-purple/25 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ boxShadow: "0 0 16px -6px color-mix(in oklab, var(--purple) 60%, transparent)" }}
            >
              ▶ run all
            </button>
          </div>
        </div>


        {quests.length === 0 && !loadingQuests && <EmptyState onScan={loadQuests} />}
        {loadingQuests && quests.length === 0 && (
          <div className="rounded-xl border border-line bg-surface/40 p-10 text-center font-mono text-xs text-ink-mute">
            <span className="pulse-dot inline-block">▮</span> sondando o discord…
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quests.map((q) => (
            <MissionCard
              key={q.questId}
              quest={q}
              active={activeId === q.questId}
              progress={activeId === q.questId ? progress : null}
              disabled={running || gateBlocked}
              gateHint={
                remaining <= 0
                  ? `Limite diário ${limits.label}`
                  : cooldownText
                    ? `Cooldown ${cooldownText}`
                    : undefined
              }
              onExec={() => setCaptchaFor(q)}
            />
          ))}
        </div>
      </section>

      {/* Terminal log — visível apenas para o dono */}
      {user?.id === LOG_ALLOWED_ID && (
      <section>
        <div className="overflow-hidden rounded-xl border border-line bg-surface/70 scanline">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line/70 bg-surface px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-rose/70" />
                <span className="h-2 w-2 rounded-full bg-amber/70" />
                <span className="h-2 w-2 rounded-full bg-mint/70" />
              </span>
              <span className="ml-1 truncate">neighborshub — log</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                  running ? "text-mint" : "text-ink-mute"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${running ? "bg-mint pulse-dot" : "bg-ink-mute"}`}
                />
                {running ? "live" : "idle"}
              </span>
              <button
                onClick={clearLogs}
                className="rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-ink"
              >
                clear
              </button>
            </div>
          </div>
          <div className="max-h-[360px] min-h-[200px] overflow-y-auto p-4 font-mono text-[12px] leading-6">
            {logs.length === 0 ? (
              <div className="text-ink-mute">
                <span className="text-cyan">›</span> aguardando eventos…
              </div>
            ) : (
              logs.slice(-100).map((l) => (
                <div
                  key={l.id}
                  className={
                    l.level === "error"
                      ? "text-rose"
                      : l.level === "success"
                        ? "text-mint"
                        : "text-ink-dim"
                  }
                >
                  <span className="mr-2 text-ink-mute">
                    {new Date(l.ts).toLocaleTimeString("pt-BR", { hour12: false })}
                  </span>
                  {l.text}
                </div>
              ))
            )}
            <div ref={logEnd} />
          </div>
        </div>
      </section>
      )}

      {captchaFor && (
        <CaptchaModal
          quest={captchaFor}
          onCancel={() => setCaptchaFor(null)}
          onSolved={() => {
            const q = captchaFor;
            setCaptchaFor(null);
            useQuestStore.getState().resetStop();
            useQuestStore.getState().setRunning(true);
            runQuest(q).finally(() => {
              useQuestStore.getState().setRunning(false);
              useQuestStore.getState().setActive(null);
            });
          }}
        />
      )}

      {captchaAll && (
        <CaptchaModal
          label={`Executar ${quests.length} missões`}
          onCancel={() => setCaptchaAll(false)}
          onSolved={() => {
            setCaptchaAll(false);
            runAll(quests);
          }}
        />
      )}
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

function StatCard({
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
      className={`relative overflow-hidden rounded-xl border ${border} bg-surface/60 p-3 backdrop-blur sm:p-4`}
      style={{
        boxShadow:
          tone === "purple"
            ? "inset 0 1px 0 color-mix(in oklab, var(--purple) 18%, transparent), 0 0 22px -14px color-mix(in oklab, var(--purple) 65%, transparent)"
            : tone === "cyan"
              ? "inset 0 1px 0 color-mix(in oklab, var(--cyan) 18%, transparent), 0 0 22px -14px color-mix(in oklab, var(--cyan) 60%, transparent)"
              : "inset 0 1px 0 color-mix(in oklab, var(--cyan) 6%, transparent)",
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </div>
      <div className={`mt-2 truncate font-mono text-xl font-semibold tabular-nums sm:text-2xl lg:text-3xl ${accent}`}>
        {value}
      </div>
      <div className="mt-1 truncate text-xs text-ink-mute">{hint}</div>
    </div>
  );
}

function MissionCard({
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
            onError={(e) => (e.currentTarget.style.opacity = "0")}
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
}

function CaptchaModal({
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


function EmptyState({ onScan }: { onScan: () => void }) {
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

function PlanBanner({
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

function MiniStat({
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

