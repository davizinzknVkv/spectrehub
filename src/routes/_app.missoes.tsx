import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  fetchAvailableQuests,
  fetchUserPlan,
  PLAN_LIMITS,
  runAll,
  runQuest,
  claimAllRewards,
} from "@/lib/quest-runner";
import { useQuestStore, type Quest } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/ds";
import { Target } from "lucide-react";
import {
  CaptchaModal,
  MissionEmptyState as EmptyState,
  MissionCard,
  PlanBanner,
} from "@/components/Missions";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/missoes")({
  head: () => ({ meta: [{ title: "Missões — Spectre Hub" }] }),
  component: MissoesPage,
});

function MissoesPage() {
  const creds = useQuestStore((s) => s.creds);
  const quests = useQuestStore((s) => s.quests);
  const setQuests = useQuestStore((s) => s.setQuests);
  const loadingQuests = useQuestStore((s) => s.loadingQuests);
  const setLoadingQuests = useQuestStore((s) => s.setLoadingQuests);
  const running = useQuestStore((s) => s.running);
  const activeId = useQuestStore((s) => s.activeQuestId);
  const progress = useQuestStore((s) => s.progress);
  const plan = useQuestStore((s) => s.plan);
  const lastCompletedAt = useQuestStore((s) => s.lastCompletedAt);
  const runs = useQuestStore((s) => s.runs);
  const setPlan = useQuestStore((s) => s.setPlan);
  const requestStop = useQuestStore((s) => s.requestStop);
  
  const [captchaFor, setCaptchaFor] = useState<Quest | null>(null);
  const [captchaAll, setCaptchaAll] = useState(false);

  useEffect(() => {
    if (!creds) return;
    const refresh = () => {
      fetchUserPlan().then((p) => { if (p !== null) setPlan(p); }).catch(() => {});
    };
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [creds, setPlan]);

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
  const cooldownText = cooldownLeft > 0
      ? `${Math.floor(cooldownSecs / 60)}m${(cooldownSecs % 60).toString().padStart(2, "0")}s`
      : null;

  const loadQuests = async () => {
    setLoadingQuests(true);
    try {
      const q = await fetchAvailableQuests();
      setQuests(q);
      toast.success(`${q.length} missões localizadas.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoadingQuests(false);
    }
  };

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Missões Bloqueadas</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">Para escanear e executar missões em sua conta, você deve estar autenticado no terminal.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="quests --deploy"
        icon={Target}
        title="Protocolo de"
        highlight="Missões"
        description="Execute missões oficiais do Discord e colete recompensas exclusivas automaticamente."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
           <PlanBanner
            plan={plan}
            limits={limits}
            usedToday={usedToday}
            remaining={remaining}
            cooldownText={cooldownText}
            cooldownLeft={cooldownLeft}
          />

          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4">
             <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">
                {quests.length} Missões Disponíveis
             </div>
             <div className="flex gap-2 sm:gap-4 flex-wrap">
                <button 
                  onClick={loadQuests}
                  disabled={loadingQuests || running}
                  className="ds-btn ds-btn-secondary !py-2 !px-4 sm:!px-6 !text-[9px]"
                >
                  {loadingQuests ? 'Sondando...' : 'Scan'}
                </button>
                <button 
                  onClick={() => claimAllRewards(quests)}
                  disabled={running || quests.length === 0}
                  className="ds-btn ds-btn-secondary !py-2 !px-4 sm:!px-6 !text-[9px] !text-spectre-pink hover:!bg-spectre-pink/10"
                >
                  Resgatar Tudo
                </button>
                <button 
                  onClick={() => setCaptchaAll(true)}
                  disabled={running || quests.length === 0 || gateBlocked}
                  className="ds-btn ds-btn-primary !py-2 !px-4 sm:!px-6 !text-[9px]"
                >
                  Run All
                </button>
             </div>
          </div>

          {quests.length === 0 && !loadingQuests && <EmptyState onScan={loadQuests} />}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quests.map((q) => (
              <MissionCard
                key={q.questId}
                quest={q}
                active={activeId === q.questId}
                progress={activeId === q.questId ? progress : null}
                disabled={running || gateBlocked}
                gateHint={remaining <= 0 ? `Limite ${limits.label}` : cooldownText ? `Cooldown ${cooldownText}` : undefined}
                onExec={() => setCaptchaFor(q)}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
            <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
                <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Terminal Log</div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar font-mono text-[9px]">
                   {useQuestStore.getState().logs.length === 0 ? (
                       <p className="text-white/20 italic">Aguardando operação...</p>
                   ) : (
                       useQuestStore.getState().logs.slice().reverse().map(l => (
                           <div key={l.id} className={`py-1 border-b border-white/[0.02] ${l.level === 'error' ? 'text-rose-500' : l.level === 'success' ? 'text-spectre-pink' : 'text-white/60'}`}>
                               [{new Date(l.ts).toLocaleTimeString()}] {l.text}
                           </div>
                       ))
                   )}
                </div>
                {running && (
                    <button onClick={requestStop} className="w-full ds-btn ds-btn-secondary !text-rose-500 hover:!bg-rose-500 hover:!text-white border-rose-500/20">
                        Interromper Sequência
                    </button>
                )}
            </div>
        </aside>
      </div>

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
