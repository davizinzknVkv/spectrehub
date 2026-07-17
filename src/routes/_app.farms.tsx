import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { PLAN_LIMITS, getGateStatus } from "@/lib/quest-runner";
import {
  Tractor,
  Activity,
  Clock,
  Timer,
  CheckCircle2,
  Coins,
  CalendarDays,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/_app/farms")({
  head: () => ({ meta: [{ title: "Farms — Neighborshub" }] }),
  component: FarmsPage,
});

function parseOrbs(reward: string | null): number {
  if (!reward) return 0;
  const m = reward.match(/(\d+)\s*Orbs?/i);
  return m ? Number(m[1]) : 0;
}

function fmtDuration(ms: number) {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

function FarmsPage() {
  const runs = useQuestStore((s) => s.runs);
  const logs = useQuestStore((s) => s.logs);
  const plan = useQuestStore((s) => s.plan);
  const running = useQuestStore((s) => s.running);
  const activeQuestId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const lastCompletedAt = useQuestStore((s) => s.lastCompletedAt);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const t = startOfDay.getTime();

    let totalOrbs = 0;
    let todayOrbs = 0;
    let todayDone = 0;
    let done = 0;
    let failed = 0;
    let skipped = 0;

    for (const r of runs) {
      const orbs = parseOrbs(r.reward_text);
      const ts = new Date(r.started_at).getTime();
      if (r.status === "completed") {
        done++;
        totalOrbs += orbs;
        if (ts >= t) {
          todayDone++;
          todayOrbs += orbs;
        }
      } else if (r.status === "failed") failed++;
      else if (r.status === "skipped") skipped++;
    }

    return { totalOrbs, todayOrbs, todayDone, done, failed, skipped };
  }, [runs]);

  const gate = getGateStatus();
  const limits = PLAN_LIMITS[plan];

  // Tempo restante até próxima missão liberada (cooldown)
  const remainingCd = Math.max(0, lastCompletedAt + limits.cooldownMs - now);

  // Tempo ativo (heurística): tempo desde o started_at da run mais recente enquanto running
  const activeStart = useMemo(() => {
    if (!running) return null;
    const active = runs.find((r) => r.quest_id === activeQuestId);
    return active ? new Date(active.started_at).getTime() : now;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeQuestId, runs]);
  const activeMs = running && activeStart ? now - activeStart : 0;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="farms --dashboard"
        icon={Tractor}
        title="Farms"
        highlight="ativas"
        description="Painel dedicado das suas farms de missões. Dados locais deste navegador."
      />


      {/* Status live */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BigStat
          icon={<Activity className="h-4 w-4" />}
          label="Status"
          value={running ? "Executando" : "Ocioso"}
          tone={running ? "mint" : "ink-mute"}
          sub={running && activeQuestId ? `#${activeQuestId.slice(-6)}` : "—"}
        />
        <BigStat
          icon={<Clock className="h-4 w-4" />}
          label="Tempo ativo"
          value={running ? fmtDuration(activeMs) : "—"}
          tone="cyan"
          sub={running ? "farm em curso" : "sem farm ativa"}
        />
        <BigStat
          icon={<Timer className="h-4 w-4" />}
          label="Tempo restante"
          value={remainingCd > 0 ? fmtDuration(remainingCd) : "livre"}
          tone={remainingCd > 0 ? "amber" : "mint"}
          sub={`cooldown ${limits.label}`}
        />
        <BigStat
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Missões hoje"
          value={
            limits.daily === Infinity
              ? `${stats.todayDone}`
              : `${stats.todayDone}/${limits.daily}`
          }
          tone="purple"
          sub={`${gate.remaining === Infinity ? "∞" : gate.remaining} restantes`}
        />
      </section>

      {/* Progress da run ativa */}
      {running && progress && (
        <section className="rounded-xl border border-cyan/30 bg-surface/60 p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-ink-dim">
            <span className="font-mono uppercase tracking-widest text-cyan">progresso</span>
            <span className="font-mono tabular-nums">
              {progress.current}/{progress.total}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/60">
            <div
              className="h-full bg-gradient-to-r from-cyan via-purple to-mint transition-all"
              style={{
                width: `${Math.min(100, (progress.current / Math.max(1, progress.total)) * 100)}%`,
              }}
            />
          </div>
        </section>
      )}

      {/* Ganhos */}
      <section className="grid gap-3 sm:grid-cols-3">
        <EarningCard
          icon={<Coins className="h-4 w-4" />}
          label="Ganhos totais"
          value={stats.totalOrbs}
          suffix="Orbs"
          tone="amber"
        />
        <EarningCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Ganhos diários"
          value={stats.todayOrbs}
          suffix="Orbs hoje"
          tone="mint"
        />
        <EarningCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Missões concluídas"
          value={stats.done}
          suffix={`${stats.failed} falhas`}
          tone="cyan"
        />
      </section>

      {/* Estatísticas + Histórico */}
      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-line bg-surface/60 p-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
            <span className="text-purple">◆</span> estatísticas
          </div>
          <dl className="space-y-2 text-sm">
            <Row k="Total de runs" v={String(runs.length)} />
            <Row k="Concluídas" v={String(stats.done)} tone="text-mint" />
            <Row k="Falhas" v={String(stats.failed)} tone="text-rose" />
            <Row k="Puladas" v={String(stats.skipped)} tone="text-amber" />
            <Row
              k="Taxa de sucesso"
              v={
                runs.length
                  ? `${Math.round((stats.done / runs.length) * 100)}%`
                  : "—"
              }
              tone="text-cyan"
            />
            <Row k="Plano ativo" v={limits.label} tone="text-purple" />
            <Row
              k="Cooldown"
              v={`${limits.cooldownMs / 60000}m`}
              tone="text-ink"
            />
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-surface/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
              <span className="text-cyan">◆</span> histórico recente
            </div>
            <span className="font-mono text-[10px] text-ink-mute">
              últimas {Math.min(10, runs.length)}
            </span>
          </div>
          <ul className="divide-y divide-line/40">
            {runs.slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    r.status === "completed"
                      ? "bg-mint"
                      : r.status === "failed"
                        ? "bg-rose"
                        : "bg-amber"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate text-ink">{r.quest_name}</span>
                <span className="hidden shrink-0 font-mono text-[11px] text-ink-mute sm:inline">
                  {r.reward_text ?? "—"}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-ink-mute">
                  {new Date(r.started_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
            {runs.length === 0 && (
              <li className="py-6 text-center font-mono text-xs text-ink-mute">
                <span className="text-cyan">›</span> nenhuma farm executada ainda
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Logs live */}
      <section className="rounded-xl border border-line bg-surface/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
            <Terminal className="h-3.5 w-3.5 text-cyan" /> logs
          </div>
          <span className="font-mono text-[10px] text-ink-mute">
            {logs.length} eventos
          </span>
        </div>
        <div className="max-h-72 overflow-auto rounded-md border border-line/60 bg-background/60 p-3 font-mono text-[12px] leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-ink-mute">
              <span className="text-cyan">›</span> nenhum log ainda
            </div>
          ) : (
            logs
              .slice()
              .reverse()
              .map((l) => (
                <div
                  key={l.id}
                  className={
                    l.level === "success"
                      ? "text-mint"
                      : l.level === "error"
                        ? "text-rose"
                        : "text-ink-dim"
                  }
                >
                  <span className="text-ink-mute">
                    [{new Date(l.ts).toLocaleTimeString("pt-BR")}]
                  </span>{" "}
                  {l.text}
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
  tone,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "mint" | "purple" | "amber" | "ink-mute";
  sub?: string;
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan border-cyan/30"
      : tone === "mint"
        ? "text-mint border-mint/30"
        : tone === "purple"
          ? "text-purple border-purple/30"
          : tone === "amber"
            ? "text-amber border-amber/30"
            : "text-ink-mute border-line";
  return (
    <div className={`rounded-xl border bg-surface/60 p-4 ${toneClass}`}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-ink-mute">{sub}</div>}
    </div>
  );
}

function EarningCard({
  icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  tone: "amber" | "mint" | "cyan";
}) {
  const toneClass =
    tone === "amber"
      ? "from-amber/15 to-transparent border-amber/30 text-amber"
      : tone === "mint"
        ? "from-mint/15 to-transparent border-mint/30 text-mint"
        : "from-cyan/15 to-transparent border-cyan/30 text-cyan";
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneClass} p-5`}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
        {icon}
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-4xl font-semibold tabular-nums text-ink">
          {value.toLocaleString("pt-BR")}
        </span>
        <span className="text-xs text-ink-dim">{suffix}</span>
      </div>
    </div>
  );
}

function Row({ k, v, tone = "text-ink" }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line/30 pb-2 last:border-0">
      <span className="text-ink-dim">{k}</span>
      <span className={`font-mono tabular-nums ${tone}`}>{v}</span>
    </div>
  );
}
