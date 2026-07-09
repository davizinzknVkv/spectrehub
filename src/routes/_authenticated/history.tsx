import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listQuestRuns } from "@/lib/discord.functions";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Histórico — DiscordHub" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["quest-runs"],
    queryFn: () => listQuestRuns(),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Histórico</h1>
      {isLoading && <div className="text-slate-400">Carregando...</div>}
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
            {(data ?? []).map((r) => (
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
            {data && data.length === 0 && (
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
