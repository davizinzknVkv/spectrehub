import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchAvailableQuests,
  fetchOrbs,
  fetchUserInfo,
  runAll,
  runQuest,
} from "@/lib/quest-runner";
import { useQuestStore, type Quest } from "@/lib/quest-store";

export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — DiscordHub" }] }),
  component: HubPage,
});

const TASK_LABEL: Record<string, { label: string; icon: string; tone: string }> = {
  WATCH_VIDEO: { label: "vídeo", icon: "▶", tone: "text-cyan" },
  WATCH_VIDEO_ON_MOBILE: { label: "vídeo", icon: "▶", tone: "text-cyan" },
  PLAY_ON_DESKTOP: { label: "desktop", icon: "◆", tone: "text-mint" },
  PLAY_ON_XBOX: { label: "xbox", icon: "◆", tone: "text-mint" },
  PLAY_ON_PLAYSTATION: { label: "ps", icon: "◆", tone: "text-mint" },
};

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
            onClick={() => runAll(quests)}
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orbs" value={(orbs ?? 0).toLocaleString("pt-BR")} tone="cyan" hint="saldo atual" />
        <StatCard label="Missões" value={String(quests.length)} tone="mint" hint={`${orbQuests} com orbs`} />
        <StatCard
          label="Tempo total"
          value={quests.length ? formatDuration(totalTarget) : "—"}
          tone="amber"
          hint="se rodar tudo"
        />
        <StatCard
          label="Histórico"
          value={String(runsCount)}
          tone="mute"
          hint="runs salvas"
        />
      </div>

      {/* Mission grid + Log panel */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Missions */}
        <section className="min-w-0 space-y-3">
          <SectionHeader
            title="fila de missões"
            right={
              quests.length > 0 ? (
                <span className="font-mono text-[11px] text-ink-mute">
                  {quests.length} pendente(s)
                </span>
              ) : null
            }
          />

          {quests.length === 0 && !loadingQuests && (
            <EmptyState onScan={loadQuests} />
          )}

          {loadingQuests && quests.length === 0 && (
            <div className="rounded-lg border border-line bg-surface/40 p-8 text-center font-mono text-xs text-ink-mute">
              <span className="pulse-dot inline-block">▮</span> sondando o discord…
            </div>
          )}

          <div className="space-y-2.5">
            {quests.map((q, i) => (
              <MissionRow
                key={q.questId}
                quest={q}
                index={i + 1}
                active={activeId === q.questId}
                progress={activeId === q.questId ? progress : null}
                disabled={running}
              />
            ))}
          </div>
        </section>

        {/* Terminal log */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-line bg-surface/70 scanline">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line/70 bg-surface px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose/70" />
                  <span className="h-2 w-2 rounded-full bg-amber/70" />
                  <span className="h-2 w-2 rounded-full bg-mint/70" />
                </span>
                <span className="ml-1 truncate">discordhub — log</span>
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
            <div className="max-h-[420px] min-h-[280px] overflow-y-auto p-4 font-mono text-[12px] leading-6">
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

          <div className="mt-3 rounded-lg border border-amber/25 bg-amber/[0.05] p-3 font-mono text-[11px] leading-relaxed text-amber/90">
            ⚠ mantenha esta aba aberta durante a execução. Fechando o navegador, o loop para.
          </div>
        </aside>
      </div>
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

function MissionRow({
  quest,
  index,
  active,
  progress,
  disabled,
}: {
  quest: Quest;
  index: number;
  active: boolean;
  progress: { current: number; total: number } | null;
  disabled: boolean;
}) {
  const pct = active && progress ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0;
  const meta = TASK_LABEL[quest.taskType] ?? { label: quest.taskType.toLowerCase(), icon: "◇", tone: "text-ink-dim" };
  const isOrbs = quest.rewardText.includes("Orbs");

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border transition ${
        active
          ? "border-cyan/60 bg-cyan/[0.06] glow-cyan"
          : "border-line bg-surface/50 hover:border-cyan/30 hover:bg-surface/70"
      }`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative shrink-0">
            {quest.imageUrl ? (
              <img
                src={quest.imageUrl}
                alt=""
                loading="lazy"
                onError={(e) => ((e.currentTarget.style.display = "none"))}
                className="h-14 w-14 rounded-md border border-line object-cover sm:h-16 sm:w-16"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-md border border-line bg-background/60 font-mono text-sm font-semibold text-ink-mute sm:h-16 sm:w-16">
                {index.toString().padStart(2, "0")}
              </div>
            )}
            <span className="absolute -left-1.5 -top-1.5 rounded border border-line bg-background px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan">
              {index.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">{quest.questName}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest">
              <span className={`inline-flex items-center gap-1.5 ${meta.tone}`}>
                <span>{meta.icon}</span>
                {meta.label}
              </span>
              <span className="text-ink-mute">
                <span className="text-ink-dim">{formatDuration(quest.target)}</span>
              </span>
              <span
                className={
                  isOrbs
                    ? "inline-flex items-center gap-1.5 text-amber"
                    : "inline-flex items-center gap-1.5 text-ink-dim"
                }
              >
                <span>◈</span>
                <span className="normal-case tracking-normal">{quest.rewardText}</span>
              </span>
              {quest.isEnrolled && (
                <span className="rounded border border-mint/30 px-1.5 py-0.5 text-[10px] text-mint">
                  enrolled
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => {
              useQuestStore.getState().resetStop();
              useQuestStore.getState().setRunning(true);
              runQuest(quest).finally(() => {
                useQuestStore.getState().setRunning(false);
                useQuestStore.getState().setActive(null);
              });
            }}
            disabled={disabled}
            className="rounded-md border border-cyan/50 bg-cyan/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan transition hover:bg-cyan/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▶ exec
          </button>
        </div>
      </div>
      {active && progress && (
        <div className="border-t border-line/60 bg-background/40 px-5 py-3">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            <span>
              <span className="text-cyan">progress</span> · {progress.current}/{progress.total}
            </span>
            <span className="text-cyan">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan via-mint to-amber transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </article>
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
