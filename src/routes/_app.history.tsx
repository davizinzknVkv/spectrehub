import { createFileRoute } from "@tanstack/react-router";
import { useQuestStore } from "@/lib/quest-store";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Histórico — DiscordHub" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const runs = useQuestStore((s) => s.runs);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Histórico</h1>
      <p className="text-sm text-slate-400">
        Salvo apenas neste navegador. Limpar o localStorage apaga o histórico.
      </p>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Missão</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Recompensa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quando</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runs.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.quest_name}</td>
                <td className="px-4 py-3 text-slate-400">{r.task_type}</td>
                <td className="px-4 py-3 text-slate-400">{r.reward_text ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.status === "completed"
                        ? "rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300"
                        : r.status === "failed"
                          ? "rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-300"
                          : "rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-300"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(r.started_at).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Nenhuma execução registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
