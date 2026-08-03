import { createFileRoute } from "@tanstack/react-router";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, StatCard, Badge, EmptyState } from "@/components/ui/ds";
import { History } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Histórico — Neighborshub" }] }),
  component: HistoryPage,
});

const STATUS_VARIANT: Record<string, "success" | "danger" | "warning" | "default"> = {
  completed: "success",
  failed: "danger",
  skipped: "warning",
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

      <div className="ds-grid-4">
        <StatCard label="Total" value={runs.length} accent={false} />
        <StatCard label="Concluídas" value={done} />
        <StatCard label="Falhas" value={failed} accent={false} />
        <StatCard label="Puladas" value={skipped} accent={false} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(0,1fr)_120px_1fr_120px_160px] gap-4 border-b border-[var(--border-1)] px-5 py-3 ds-label md:grid">
          <div>missão</div>
          <div>tipo</div>
          <div>recompensa</div>
          <div>status</div>
          <div className="text-right">quando</div>
        </div>
        <ul className="divide-y divide-[var(--border-1)]">
          {runs.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[minmax(0,1fr)_120px_1fr_120px_160px] md:items-center md:gap-4"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[var(--text-1)]">{r.quest_name}</div>
                {r.error_message && (
                  <div className="mt-1 truncate ds-small text-[var(--danger)]">
                    {r.error_message}
                  </div>
                )}
              </div>
              <div className="ds-small uppercase tracking-widest">
                {r.task_type.replace(/^(PLAY|WATCH)_?/i, "").toLowerCase() || r.task_type.toLowerCase()}
              </div>
              <div className="ds-body">{r.reward_text ?? "—"}</div>
              <div>
                <Badge variant={STATUS_VARIANT[r.status] ?? "default"}>{r.status}</Badge>
              </div>
              <div className="ds-small md:text-right">
                {new Date(r.started_at).toLocaleString("pt-BR")}
              </div>
            </li>
          ))}
        </ul>
        {runs.length === 0 && (
          <EmptyState
            icon={History}
            title="Nenhuma execução registrada"
            description="Assim que uma farm rodar, o histórico aparecerá aqui."
          />
        )}
      </Card>
    </div>
  );
}
