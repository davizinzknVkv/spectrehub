import { createFileRoute } from "@tanstack/react-router";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { History, Target, Gift, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Histórico — SPECTRE" }] }),
  component: HistoryPage,
});

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  completed: { label: "Sucesso", color: "text-primary" },
  failed: { label: "Falha", color: "text-rose-500" },
  skipped: { label: "Ignorada", color: "text-amber-500" },
};

function HistoryPage() {
  const runs = useQuestStore((s) => s.runs);
  const done = runs.filter((r) => r.status === "completed").length;
  const failed = runs.filter((r) => r.status === "failed").length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="history --trace"
        icon={History}
        title="Registro de"
        highlight="Atividade"
        description="Rastreamento completo de todas as operações realizadas neste terminal local."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem label="Total de Runs" val={String(runs.length)} />
        <StatItem label="Concluídas" val={String(done)} color="text-primary" />
        <StatItem label="Interrompidas" val={String(failed)} color="text-rose-500" />
      </div>

      <div className="ds-card mt-8 overflow-hidden border-white/5 bg-white/[0.02]">
        <div className="hidden md:grid grid-cols-[1fr_150px_150px_200px] gap-6 px-8 py-5 border-b border-white/5 bg-white/[0.01]">
            <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Operação</span>
            <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Recompensa</span>
            <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic text-center">Status</span>
            <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic text-right">Timestamp</span>
        </div>

        {runs.length === 0 ? (
            <div className="py-20 text-center space-y-4">
                <Clock className="w-8 h-8 mx-auto text-white/10" />
                <p className="font-display text-[10px] uppercase tracking-widest text-white/20 italic">Sem registros no terminal</p>
            </div>
        ) : (
            <ul className="divide-y divide-white/[0.02]">
                {runs.map(r => (
                    <li key={r.id} className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_200px] gap-4 md:gap-6 px-8 py-5 items-center group hover:bg-white/[0.02] transition-colors">
                        <div className="min-w-0 space-y-1">
                            <div className="font-display text-sm text-white uppercase italic tracking-tighter truncate">{r.quest_name}</div>
                            <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{r.task_type}</div>
                        </div>
                        <div className="font-display text-[10px] text-white/60 uppercase italic tracking-widest truncate">{r.reward_text || "—"}</div>
                        <div className="flex justify-center">
                            <span className={`font-display text-[9px] uppercase italic tracking-widest font-bold ${STATUS_MAP[r.status]?.color || 'text-white/40'}`}>
                                {STATUS_MAP[r.status]?.label || r.status}
                            </span>
                        </div>
                        <div className="text-right font-mono text-[9px] text-white/20 uppercase tracking-widest">
                            {new Date(r.started_at).toLocaleString('pt-BR')}
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, val, color = "text-white" }: any) {
    return (
        <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-2">
            <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{label}</div>
            <div className={`font-display text-2xl italic tracking-tighter ${color}`}>{val}</div>
        </div>
    )
}
