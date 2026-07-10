import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchAvailableQuests,
  fetchUserPlan,
  PLAN_LIMITS,
  runAll,
  runQuest,
} from "@/lib/quest-runner";
import { useQuestStore, type Quest } from "@/lib/quest-store";
import {
  CaptchaModal,
  EmptyState,
  MissionCard,
  PlanBanner,
} from "./_app.hub";

export const Route = createFileRoute("/_app/missoes")({
  head: () => ({ meta: [{ title: "Missões — Neighborshub" }] }),
  component: MissoesPage,
});

const LOG_ALLOWED_ID = "1217795750407442473";

function MissoesPage() {
  const creds = useQuestStore((s) => s.creds);
  const quests = useQuestStore((s) => s.quests);
  const setQuests = useQuestStore((s) => s.setQuests);
  const loadingQuests = useQuestStore((s) => s.loadingQuests);
  const setLoadingQuests = useQuestStore((s) => s.setLoadingQuests);
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
  const [captchaFor, setCaptchaFor] = useState<Quest | null>(null);
  const [captchaAll, setCaptchaAll] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [logs]);

  // Refresh plan while on this page
  useEffect(() => {
    if (!creds) return;
    const refresh = () => {
      fetchUserPlan()
        .then((p) => {
          if (p === null) return;
          setPlan(p);
        })
        .catch(() => {});
    };
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [creds, setPlan]);

  // Read user id once so we know whether to render the owner-only log
  useEffect(() => {
    if (!creds) return;
    import("@/lib/quest-runner").then(({ fetchUserInfo }) =>
      fetchUserInfo().then((u) => u && setOwnerId((u as { id?: string }).id ?? null)),
    );
  }, [creds]);

  const limits = PLAN_LIMITS[plan];
  const usedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const t = start.getTime();
    return runs.filter(
      (r) => r.status === "completed" && new Date(r.started_at).getTime() >= t,
    ).length;
  }, [runs]);
  const remaining = limits.daily === Infinity ? Infinity : Math.max(0, limits.daily - usedToday);
  const cooldownEnd = lastCompletedAt + limits.cooldownMs;
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (cooldownEnd <= Date.now()) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= cooldownEnd) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownEnd]);
  const cooldownLeft = Math.max(0, cooldownEnd - now);
  const gateBlocked = remaining <= 0 || cooldownLeft > 0;
  const cooldownSecs = Math.ceil(cooldownLeft / 1000);
  const cooldownText =
    cooldownLeft > 0
      ? `${Math.floor(cooldownSecs / 60)}m${(cooldownSecs % 60).toString().padStart(2, "0")}s`
      : null;

  const loadQuests = async () => {
    setLoadingQuests(true);
    try {
      const q = await fetchAvailableQuests();
      setQuests(q);
      useQuestStore.getState().log(`🎯 ${q.length} missão(ões) disponíveis`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoadingQuests(false);
    }
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
            Configure seu token do Discord para carregar e executar missões.
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
            Missões
          </h1>
          <p className="mt-1 text-sm text-ink-dim">
            Quests disponíveis do Discord. Complete para ganhar recompensas.
          </p>
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

      <PlanBanner
        plan={plan}
        limits={limits}
        usedToday={usedToday}
        remaining={remaining}
        cooldownText={cooldownText}
        cooldownLeft={cooldownLeft}
      />

      <section className="min-w-0 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            {quests.length > 0 && (
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                {quests.length} disponíveis
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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

      {ownerId === LOG_ALLOWED_ID && (
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
