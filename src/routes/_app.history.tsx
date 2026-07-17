import { createFileRoute } from "@tanstack/react-router";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { History } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Histórico — Neighborshub" }] }),
  component: HistoryPage,
});

const STATUS_STYLES: Record<string, string> = {
  completed: "border-mint/40 bg-mint/10 text-mint",
  failed: "border-rose/40 bg-rose/10 text-rose",
  skipped: "border-amber/40 bg-amber/10 text-amber",
};

function HistoryPage() {
  const runs = useQuestStore((s) => s.runs);
  const done = runs.filter((r) => r.status === "completed").length;
  const failed = runs.filter((r) => r.status === "failed").length;
  const skipped = runs.filter((r) => r.status === "skipped").length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="history --tail 200"
        icon={History}
        title="Histórico"
        highlight="local"
        description="Salvo apenas neste navegador. Limpar o localStorage apaga o registro."
      />

      <div className="card-grid-sm">

        <Stat label="Total" value={runs.length} tone="text-ink" />
        <Stat label="Concluídas" value={done} tone="text-mint" />
        <Stat label="Falhas" value={failed} tone="text-rose" />
        <Stat label="Puladas" value={skipped} tone="text-amber" />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface/60">
        <div className="hidden grid-cols-[minmax(0,1fr)_120px_1fr_120px_160px] gap-4 border-b border-line/60 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute md:grid">
          <div>missão</div>
          <div>tipo</div>
          <div>recompensa</div>
          <div>status</div>
          <div className="text-right">quando</div>
        </div>
        <ul className="divide-y divide-line/40">
          {runs.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[minmax(0,1fr)_120px_1fr_120px_160px] md:items-center md:gap-4"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink">{r.quest_name}</div>
                {r.error_message && (
                  <div className="mt-1 truncate font-mono text-[11px] text-rose/80">
                    {r.error_message}
                  </div>
                )}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">
                {r.task_type.replace(/^(PLAY|WATCH)_?/i, "").toLowerCase() || r.task_type.toLowerCase()}
              </div>
              <div className="text-sm text-ink-dim">{r.reward_text ?? "—"}</div>
              <div>
                <span
                  className={`inline-flex rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                    STATUS_STYLES[r.status] ?? "border-line text-ink-mute"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="font-mono text-[11px] text-ink-mute md:text-right">
                {new Date(r.started_at).toLocaleString("pt-BR")}
              </div>
            </li>
          ))}
          {runs.length === 0 && (
            <li className="p-10 text-center font-mono text-xs text-ink-mute">
              <span className="text-cyan">›</span> nenhuma execução registrada ainda
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </div>
      <div className={`mt-2 font-mono text-3xl font-semibold tabular-nums ${tone}`}>{value}</div>
    </div>
  );
}
