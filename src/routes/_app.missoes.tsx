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
import { PageHeader } from "@/components/PageHeader";
import { Button, Badge } from "@/components/ui/ds";
import { Target } from "lucide-react";
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
        <div className="ds-card">
          <div className="ds-label">status --token</div>
          <h2 className="ds-h2 mt-3">Nenhum token configurado</h2>
          <p className="mt-2 max-w-md ds-body">
            Configure seu token do Discord para carregar e executar missões.
          </p>
          <Link to="/settings" className="mt-6 inline-block">
            <Button variant="primary">→ configurar token</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="quests --list"
        icon={Target}
        title="Missões"
        highlight="disponíveis"
        description="Quests disponíveis do Discord. Complete para ganhar recompensas."
        actions={
          running ? (
            <Button variant="danger" size="sm" onClick={requestStop}>
              ■ stop
            </Button>
          ) : null
        }
      />


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
            {quests.length > 0 && <span className="ds-label">{quests.length} disponíveis</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadQuests}
              disabled={loadingQuests || running}
            >
              {loadingQuests ? "sondando…" : "→ scan missões"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCaptchaAll(true)}
              disabled={running || quests.length === 0 || remaining <= 0}
              title={remaining <= 0 ? `Limite diário do plano ${limits.label} atingido` : undefined}
            >
              ▶ run all
            </Button>
          </div>
        </div>

        {quests.length === 0 && !loadingQuests && <EmptyState onScan={loadQuests} />}
        {loadingQuests && quests.length === 0 && (
          <div className="ds-card text-center">
            <span className="ds-label">
              <span className="pulse-dot inline-block">▮</span> sondando o discord…
            </span>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
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
          <div className="overflow-hidden rounded-xl border border-[var(--border-1)]" style={{ background: "#0c0c0c" }}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-1)] px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2 ds-label">
                <span className="truncate">neighborshub — log</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={running ? "success" : "default"}>{running ? "live" : "idle"}</Badge>
                <Button variant="ghost" size="sm" onClick={clearLogs}>
                  clear
                </Button>
              </div>
            </div>
            <div className="max-h-[360px] min-h-[200px] overflow-y-auto p-4 font-mono text-[12px] leading-6">
              {logs.length === 0 ? (
                <div className="ds-small">
                  <span className="text-[var(--accent-soft)]">›</span> aguardando eventos…
                </div>
              ) : (
                logs.slice(-100).map((l) => (
                  <div
                    key={l.id}
                    className={
                      l.level === "error"
                        ? "text-[var(--danger)]"
                        : l.level === "success"
                          ? "text-[var(--ok)]"
                          : "text-[var(--text-2)]"
                    }
                  >
                    <span className="mr-2 ds-small">
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
