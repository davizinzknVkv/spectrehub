import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { PLAN_LIMITS, getGateStatus } from "@/lib/quest-runner";
import { Card, StatCard, Badge, Skeleton, EmptyState as DSEmptyState, Button } from "@/components/ui/ds";
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
  head: () => ({ meta: [{ title: "Farms — Spectre Hub" }] }),
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
  const creds = useQuestStore((s) => s.creds);
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

  const remainingCd = Math.max(0, lastCompletedAt + limits.cooldownMs - now);

  const activeStart = useMemo(() => {
    if (!running) return null;
    const active = runs.find((r) => r.quest_id === activeQuestId);
    return active ? new Date(active.started_at).getTime() : now;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeQuestId, runs]);
  const activeMs = running && activeStart ? now - activeStart : 0;

  if (!creds) {
    return (
      <div className="mx-auto w-full max-w-xl pt-10">
        <DSEmptyState
          icon={Tractor}
          title="Farms desativadas"
          description="Conecte seu token do Discord para visualizar estatísticas de farm e histórico de missões."
          action={
            <Link to="/settings">
              <Button variant="primary">→ configurar login</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="farms --dashboard"
        icon={Tractor}
        title="Farms"
        highlight="ativas"
        description="Painel dedicado das suas farms de missões. Dados locais deste navegador."
      />

      <Section eyebrow="status --live" title="Status ao vivo">
        <div className="ds-grid-4">
          <StatCard
            icon={Activity}
            label="Status"
            value={running ? "Executando" : "Ocioso"}
            hint={running && activeQuestId ? `#${activeQuestId.slice(-8)}` : "—"}
            accent={running}
          />
          <StatCard
            icon={Clock}
            label="Tempo ativo"
            value={running ? fmtDuration(activeMs) : "—"}
            hint={running ? "farm em curso" : "sem farm ativa"}
            accent={running}
          />
          <StatCard
            icon={Timer}
            label="Tempo restante"
            value={remainingCd > 0 ? fmtDuration(remainingCd) : "livre"}
            hint={`cooldown ${limits.label}`}
            accent={remainingCd === 0}
          />
          <StatCard
            icon={CheckCircle2}
            label="Missões hoje"
            value={
              limits.daily === Infinity
                ? `${stats.todayDone}`
                : `${stats.todayDone}/${limits.daily}`
            }
            hint={`${gate.remaining === Infinity ? "∞" : gate.remaining} restantes`}
          />
        </div>
      </Section>

      {running && progress && (
        <Section eyebrow="run --progress" title="Progresso da run">
          <Card>
            <div className="flex items-center justify-between">
              <span className="ds-label text-[var(--accent-soft)]">progresso</span>
              <span className="ds-small tabular-nums">
                {progress.current}/{progress.total}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-[var(--accent-1)] transition-all"
                style={{
                  width: `${Math.min(100, (progress.current / Math.max(1, progress.total)) * 100)}%`,
                }}
              />
            </div>
          </Card>
        </Section>
      )}

      <Section eyebrow="orbs --earnings" title="Ganhos">
        <div className="ds-grid-3">
          <StatCard
            icon={Coins}
            label="Ganhos totais"
            value={stats.totalOrbs.toLocaleString("pt-BR")}
            hint="Orbs"
          />
          <StatCard
            icon={CalendarDays}
            label="Ganhos diários"
            value={stats.todayOrbs.toLocaleString("pt-BR")}
            hint="Orbs hoje"
          />
          <StatCard
            icon={CheckCircle2}
            label="Missões concluídas"
            value={stats.done}
            hint={`${stats.failed} falhas`}
          />
        </div>
      </Section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <div className="ds-label mb-3">
            <span className="text-[var(--accent-soft)]">◆</span> estatísticas
          </div>
          <dl className="space-y-2 ds-body">
            <Row k="Total de runs" v={String(runs.length)} />
            <Row k="Concluídas" v={String(stats.done)} tone="text-[var(--ok)]" />
            <Row k="Falhas" v={String(stats.failed)} tone="text-[var(--danger)]" />
            <Row k="Puladas" v={String(stats.skipped)} tone="text-[var(--warn)]" />
            <Row
              k="Taxa de sucesso"
              v={
                runs.length
                  ? `${Math.round((stats.done / runs.length) * 100)}%`
                  : "—"
              }
            />
            <Row k="Plano ativo" v={limits.label} tone="text-[var(--accent-soft)]" />
            <Row k="Cooldown" v={`${limits.cooldownMs / 60000}m`} />
          </dl>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="ds-label">
              <span className="text-[var(--accent-soft)]">◆</span> histórico recente
            </div>
            <span className="ds-small">últimas {Math.min(10, runs.length)}</span>
          </div>
          {runs.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-[var(--border-1)] bg-white/[0.02]">
              <p className="ds-small text-[var(--text-3)]">Nenhuma farm executada ainda</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border-1)]">
              {runs.slice(0, 10).map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2 ds-body">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      r.status === "completed"
                        ? "bg-[var(--ok)]"
                        : r.status === "failed"
                          ? "bg-[var(--danger)]"
                          : "bg-[var(--warn)]"
                    }`}
                  />
                  <span className="min-w-0 flex-1 truncate text-[var(--text-1)]">{r.quest_name}</span>
                  <span className="hidden shrink-0 ds-small sm:inline">
                    {r.reward_text ?? "—"}
                  </span>
                  <span className="shrink-0 ds-small">
                    {new Date(r.started_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 ds-label">
            <Terminal className="h-3.5 w-3.5 text-[var(--accent-soft)]" /> logs
          </div>
          <span className="ds-small">{logs.length} eventos</span>
        </div>
        <div className="max-h-72 overflow-auto rounded-md border border-[var(--border-1)] bg-black/40 p-3 font-mono text-[12px] leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-[var(--text-3)]">
              <span className="text-[var(--accent-soft)]">›</span> Nenhum log ainda
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
                      ? "text-[var(--ok)]"
                      : l.level === "error"
                        ? "text-[var(--danger)]"
                        : "text-[var(--text-2)]"
                  }
                >
                  <span className="text-[var(--text-3)]">
                    [{new Date(l.ts).toLocaleTimeString("pt-BR")}]
                  </span>{" "}
                  {l.text}
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v, tone = "text-[var(--text-1)]" }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-1)] pb-2 last:border-0">
      <span className="text-[var(--text-2)]">{k}</span>
      <span className={`font-mono tabular-nums ${tone}`}>{v}</span>
    </div>
  );
}
