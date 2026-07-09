import { createFileRoute } from "@tanstack/react-router";
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

function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [orbs, setOrbs] = useState<number | null>(null);
  const [user, setUser] = useState<{ username?: string; global_name?: string } | null>(null);
  const [loadingQuests, setLoadingQuests] = useState(false);
  const running = useQuestStore((s) => s.running);
  const activeId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const logs = useQuestStore((s) => s.logs);
  const requestStop = useQuestStore((s) => s.requestStop);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!creds) return;
    fetchUserInfo()
      .then((u) => u && setUser(u as { username?: string; global_name?: string }))
      .catch(() => {});
  }, [creds]);

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

  if (!creds) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/[0.05] p-6">
        <h2 className="text-lg font-semibold text-yellow-300">Configure seu token</h2>
        <p className="mt-2 text-sm text-slate-300">
          Antes de usar o hub, cole seu token do Discord em{" "}
          <a href="/settings" className="underline hover:text-white">
            Token
          </a>
          . Ele fica salvo apenas no seu navegador (localStorage).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Conta Discord</div>
            <div className="mt-1 text-xl font-semibold">
              {user?.global_name || user?.username || "—"}
              {user?.username && (
                <span className="ml-2 text-sm text-slate-500">@{user.username}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500">Orbs</div>
            <div className="mt-1 text-2xl font-bold text-[#5865F2]">
              {(orbs ?? 0).toLocaleString("pt-BR")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={loadQuests}
          disabled={loadingQuests || running}
          className="rounded-md bg-[#5865F2] px-4 py-2 text-sm font-semibold hover:bg-[#4752c4] disabled:opacity-50"
        >
          {loadingQuests ? "Buscando..." : "Buscar missões"}
        </button>
        <button
          onClick={() => runAll(quests)}
          disabled={running || quests.length === 0}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
        >
          Executar todas ({quests.length})
        </button>
        {running && (
          <button
            onClick={requestStop}
            className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
          >
            Parar
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {quests.map((q) => {
          const isActive = activeId === q.questId;
          const pct =
            isActive && progress
              ? Math.min(100, Math.round((progress.current / progress.total) * 100))
              : 0;
          return (
            <div
              key={q.questId}
              className={`rounded-xl border p-4 transition ${
                isActive ? "border-[#5865F2] bg-[#5865F2]/5" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{q.questName}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {q.taskType} · {Math.floor(q.target / 60)}min · 🎁 {q.rewardText}
                  </div>
                </div>
                <button
                  onClick={() => {
                    useQuestStore.getState().resetStop();
                    useQuestStore.getState().setRunning(true);
                    runQuest(q).finally(() => {
                      useQuestStore.getState().setRunning(false);
                      useQuestStore.getState().setActive(null);
                    });
                  }}
                  disabled={running}
                  className="rounded-md bg-[#5865F2] px-3 py-1.5 text-xs font-semibold hover:bg-[#4752c4] disabled:opacity-50"
                >
                  Executar
                </button>
              </div>
              {isActive && progress && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#5865F2] to-[#a78bfa] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {progress.current} / {progress.total} ({pct}%)
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {quests.length === 0 && !loadingQuests && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
            Clique em "Buscar missões" para começar.
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1218]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-xs text-slate-500">
          <span>Log ao vivo</span>
          <span className="text-emerald-400">{running ? "● executando" : "○ parado"}</span>
        </div>
        <div className="max-h-72 overflow-y-auto p-4 font-mono text-xs leading-6">
          {logs.length === 0 ? (
            <div className="text-slate-600">Aguardando eventos...</div>
          ) : (
            logs.map((l) => (
              <div
                key={l.id}
                className={
                  l.level === "error"
                    ? "text-red-400"
                    : l.level === "success"
                      ? "text-emerald-400"
                      : "text-slate-300"
                }
              >
                {l.text}
              </div>
            ))
          )}
          <div ref={logEnd} />
        </div>
      </div>

      <div className="rounded-md border border-yellow-500/20 bg-yellow-500/[0.05] p-3 text-xs text-yellow-200/80">
        ⚠️ Mantenha esta aba aberta durante a execução. Fechando o navegador, o loop para.
      </div>
    </div>
  );
}
