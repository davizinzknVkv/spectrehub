import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchAvailableQuests,
  fetchGuilds,
  fetchOrbs,
  fetchUserInfo,
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

const PREMIUM_LABEL: Record<number, string> = {
  0: "sem nitro",
  1: "nitro classic",
  2: "nitro",
  3: "nitro basic",
};


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
  const running = useQuestStore((s) => s.running);
  const activeId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const logs = useQuestStore((s) => s.logs);
  const requestStop = useQuestStore((s) => s.requestStop);
  const clearLogs = useQuestStore((s) => s.clearLogs);
  const runsCount = useQuestStore((s) => s.runs.length);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!creds) return;
    fetchUserInfo()
      .then((u) => u && setUser(u as typeof user))
      .catch(() => {});
    fetchGuilds()
      .then(setGuilds)
      .catch(() => {});
  }, [creds]);

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

  const totalTarget = quests.reduce((sum, q) => sum + q.target, 0);
  const orbQuests = quests.filter((q) => q.rewardText.includes("Orbs")).length;
  const runs = useQuestStore.getState().runs;
  const totalOrbsEarned = runs
    .filter((r) => r.status === "completed" && r.reward_text?.includes("Orbs"))
    .reduce((sum, r) => {
      const m = r.reward_text?.match(/([\d.,]+)\s*Orbs/i);
      return sum + (m ? parseInt(m[1].replace(/[.,]/g, ""), 10) || 0 : 0);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={user?.username ?? "avatar"}
              className="h-14 w-14 shrink-0 rounded-full border border-cyan/40 object-cover shadow-[0_0_0_2px_rgba(0,0,0,0.4),0_0_24px_-4px_var(--cyan)]"
            />
          )}
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-dim">
              $ hub --live
            </div>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {user?.global_name || user?.username || "Console"}
            </h1>
            {user?.username && (
              <div className="mt-1 font-mono text-xs text-ink-mute">
                @{user.username}
                {user.id && <span className="mx-2 opacity-40">·</span>}
                {user.id && <span className="opacity-60">id {user.id.slice(0, 12)}…</span>}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={loadQuests}
            disabled={loadingQuests || running}
            className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loadingQuests ? "sondando…" : "→ scan"}
          </button>
          <button
            onClick={() => setCaptchaAll(true)}
            disabled={running || quests.length === 0}
            className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-mint transition hover:bg-mint/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶ run all ({quests.length})
          </button>
          {running && (
            <button
              onClick={requestStop}
              className="inline-flex items-center gap-2 rounded-md border border-rose/40 bg-rose/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-rose transition hover:bg-rose/20"
            >
              ■ stop
            </button>
          )}
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Orbs" value={(orbs ?? 0).toLocaleString("pt-BR")} tone="cyan" hint="saldo atual" />
        <StatCard
          label="Orbs coletadas"
          value={totalOrbsEarned.toLocaleString("pt-BR")}
          tone="amber"
          hint="total do histórico"
        />
        <StatCard
          label="Orbs usadas"
          value={Math.max(0, totalOrbsEarned - (orbs ?? 0)).toLocaleString("pt-BR")}
          tone="cyan"
          hint="gastas na loja"
        />
        <StatCard label="Missões" value={String(quests.length)} tone="mint" hint={`${orbQuests} com orbs`} />
        <StatCard
          label="Servidores"
          value={String(guilds.length)}
          tone="mint"
          hint="entrou"
        />
        <StatCard
          label="Idade da conta"
          value={created ? String(Math.floor((Date.now() - created.getTime()) / 86400000)) : "—"}
          tone="amber"
          hint={created ? `dias desde criação · ${created.toLocaleDateString("pt-BR")}` : "—"}
        />
        <StatCard
          label="Tempo total"
          value={quests.length ? formatDuration(totalTarget) : "—"}
          tone="mute"
          hint="se rodar tudo"
        />
        <StatCard
          label="Histórico"
          value={String(runsCount)}
          tone="mute"
          hint="runs salvas"
        />
      </div>

      {/* Account panel */}
      {user && (
        <section className="rounded-xl border border-line bg-surface/50 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-mute">
              <span className="text-cyan">◆</span> conta
            </div>
            {user.id && (
              <button
                onClick={copyId}
                className="rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-cyan"
              >
                copiar id
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoField label="Email" value={user.email ?? "—"} badge={user.verified ? "verificado" : undefined} badgeTone="mint" />
            <InfoField label="Telefone" value={user.phone || "—"} />
            <InfoField
              label="Nitro"
              value={PREMIUM_LABEL[user.premium_type ?? 0] ?? "—"}
              badgeTone={user.premium_type ? "cyan" : undefined}
            />
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
        </section>
      )}

      {/* Servers */}
      {guilds.length > 0 && (
        <section className="rounded-xl border border-line bg-surface/50 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-mute">
              <span className="text-cyan">◆</span> servidores
              <span className="text-ink-mute">· {guilds.length}</span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {guilds.map((g) => {
              const iconUrl = g.icon
                ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`
                : null;
              const initials = g.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 rounded-lg border border-line/70 bg-background/40 p-2.5"
                  title={g.name}
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      loading="lazy"
                      className="h-9 w-9 shrink-0 rounded-md border border-line object-cover"
                    />
                  ) : (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-[11px] font-semibold text-cyan">
                      {initials || "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-ink">{g.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                      {g.owner ? "owner" : "membro"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}




      {/* Missions section */}
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Missões</h2>
            <p className="mt-1 text-sm text-ink-dim">
              Quests disponíveis do Discord. Complete para ganhar recompensas.
            </p>
          </div>
          {quests.length > 0 && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
              {quests.length} disponíveis
            </span>
          )}
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
              disabled={running}
              onExec={() => setCaptchaFor(q)}
            />
          ))}
        </div>
      </section>

      {/* Terminal log full width below */}
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
              logs.map((l) => (
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


function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-mute">
        <span className="text-cyan">◆</span>
        {title}
      </div>
      {right}
    </div>
  );
}

function InfoField({
  label,
  value,
  hint,
  badge,
  badgeTone,
}: {
  label: string;
  value: string;
  hint?: string;
  badge?: string;
  badgeTone?: "cyan" | "mint" | "amber";
}) {
  const tone =
    badgeTone === "mint"
      ? "border-mint/30 text-mint"
      : badgeTone === "amber"
        ? "border-amber/30 text-amber"
        : "border-cyan/30 text-cyan";
  return (
    <div className="rounded-lg border border-line/70 bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
          {label}
        </div>
        {badge && (
          <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${tone}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-1.5 truncate text-sm text-ink" title={value}>
        {value}
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
  tone: "cyan" | "mint" | "amber" | "mute";
}) {
  const accent =
    tone === "cyan"
      ? "text-cyan"
      : tone === "mint"
        ? "text-mint"
        : tone === "amber"
          ? "text-amber"
          : "text-ink";
  const glow =
    tone === "mute"
      ? ""
      : "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:to-transparent before:opacity-70";
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-surface/60 p-4 backdrop-blur ${glow}`}
      style={{
        boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--cyan) 6%, transparent)",
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </div>
      <div className={`mt-2 font-mono text-3xl font-semibold tabular-nums ${accent}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-ink-mute">{hint}</div>
    </div>
  );
}

function MissionCard({
  quest,
  active,
  progress,
  disabled,
  onExec,
}: {
  quest: Quest;
  active: boolean;
  progress: { current: number; total: number } | null;
  disabled: boolean;
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
          className="mt-auto rounded-md border border-line bg-background/60 px-3 py-2 text-sm font-medium text-ink transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-30"
        >
          Completar
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
  const [challenge] = useState(() => ({
    a: Math.floor(Math.random() * 9) + 1,
    b: Math.floor(Math.random() * 9) + 1,
  }));
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (parseInt(value, 10) === challenge.a + challenge.b) {
      onSolved();
    } else {
      setError(true);
      setValue("");
    }
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

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 rounded-lg border border-line bg-background/60 p-3 font-mono text-xl text-ink">
          <span className="text-center">{challenge.a}</span>
          <span className="text-cyan">+</span>
          <span className="text-center">{challenge.b}</span>
          <span className="text-cyan">=</span>
          <input
            autoFocus
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setError(false);
              setValue(e.target.value.replace(/\D/g, "").slice(0, 3));
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded border border-line bg-background px-2 py-1 text-center text-ink outline-none focus:border-cyan"
          />
        </div>
        {error && (
          <p className="mt-2 font-mono text-[11px] text-rose">✗ resposta incorreta, tente de novo</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink"
          >
            cancelar
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-md bg-cyan px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:brightness-110"
          >
            confirmar
          </button>
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
