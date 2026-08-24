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
import { Target, Search, Sparkles, AlertCircle, Ban, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CaptchaModal,
  MissionEmptyState as EmptyState,
  MissionCard,
  PlanBanner,
} from "@/components/Missions";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/missoes")({
  head: () => ({ meta: [{ title: "Missões — SPECTRE" }] }),
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

  const loadQuests = async (includeCompleted = false) => {
    setLoadingQuests(true);
    try {
      const q = await fetchAvailableQuests(includeCompleted);
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
      <div className="pt-20 text-center space-y-8 font-sans">
        <div className="relative inline-block">
          <Ban className="w-16 h-16 mx-auto text-primary opacity-50" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        </div>
        <h1 className="font-display text-4xl uppercase tracking-tighter text-foreground">Missões Bloqueadas</h1>
        <p className="text-foreground-muted max-w-sm mx-auto italic">Para escanear e executar missões em sua conta, você deve estar autenticado no terminal.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack max-w-6xl mx-auto font-sans">
      <PageHeader
        eyebrow="quests --deploy"
        icon={Target}
        title="Protocolo de"
        highlight="Missões"
        description="Execute missões oficiais do Discord e colete recompensas exclusivas automaticamente."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 pb-20">
        <div className="space-y-6">
           <PlanBanner
            plan={plan}
            limits={limits}
            usedToday={usedToday}
            remaining={remaining}
            cooldownText={cooldownText}
            cooldownLeft={cooldownLeft}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center bg-[#030303] border border-white/5 p-8 gap-10">
             <div className="flex flex-col space-y-2">
                <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/10">TERMINAL_STATE</div>
                <div className="font-display text-[13px] text-white uppercase tracking-wider">
                  {quests.length} NODES_DETECTED
                </div>
             </div>
             <div className="flex gap-4 flex-wrap w-full sm:w-auto">
                <button 
                  onClick={() => loadQuests(false)}
                  disabled={loadingQuests || running}
                  className="ds-btn ds-btn-secondary !h-12 !px-6 !text-[10px] uppercase tracking-widest"
                >
                  {loadingQuests ? 'POLLING...' : 'SCAN_NODES'}
                </button>
                <button 
                  onClick={() => loadQuests(true)}
                  disabled={loadingQuests || running}
                  className="ds-btn ds-btn-secondary !h-12 !px-6 !text-[10px] uppercase tracking-widest"
                >
                  LOAD_HISTORY
                </button>
                <button 
                  onClick={async () => {
                    useQuestStore.getState().setRunning(true);
                    try {
                      await claimAllRewards(quests);
                    } finally {
                      useQuestStore.getState().setRunning(false);
                    }
                  }}
                  disabled={running || quests.length === 0}
                  className="ds-btn ds-btn-secondary !h-12 !px-6 !text-[10px] uppercase tracking-widest !text-primary border-primary/20"
                >
                  {running ? 'CLAIMING...' : 'AUTO_COLLECT'}
                </button>
                <button 
                  onClick={() => setCaptchaAll(true)}
                  disabled={running || quests.length === 0 || gateBlocked}
                  className="ds-btn ds-btn-primary !h-12 !px-8 !text-[10px] uppercase tracking-widest"
                >
                  DEPLOY_ALL
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
                gateHint={remaining <= 0 ? `Limite ${limits.label}` : cooldownText ? `Aguarde ${cooldownText}` : undefined}
                onExec={() => setCaptchaFor(q)}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
            <div className="bg-[#030303] border border-white/5 p-10 space-y-10 relative">
                <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <Activity className="w-4 h-4 text-primary opacity-50" />
                    <h3 className="font-display text-base text-white uppercase tracking-tighter">Terminal Log</h3>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#4DA09E]" />
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar font-mono text-[9px] uppercase tracking-[0.1em]">
                   {useQuestStore.getState().logs.length === 0 ? (
                       <p className="text-white/10 italic">WAITING_FOR_SEQUENCE...</p>
                   ) : (
                       useQuestStore.getState().logs.slice().reverse().map(l => (
                           <div key={l.id} className={cn(
                             "py-2 border-b border-white/5 leading-relaxed",
                             l.level === 'error' ? 'text-primary' : l.level === 'success' ? 'text-emerald-400' : 'text-white/20'
                           )}>
                               <span className="opacity-10 mr-4">[{new Date(l.ts).toLocaleTimeString()}]</span> 
                               {l.text}
                           </div>
                       ))
                   )}
                </div>
                
                {running && (
                    <button onClick={requestStop} className="w-full ds-btn ds-btn-secondary !text-rose-500 border-rose-500/20 !h-14 !text-[10px] uppercase tracking-[0.2em]">
                        ABORT_PROTOCOL
                    </button>
                )}
            </div>
            
            <div className="bg-[#030303] border border-primary/20 p-8 flex gap-6">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 opacity-50" />
              <div>
                <h4 className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/40 mb-2">OPERATIONAL_HINT</h4>
                <p className="font-sans text-[11px] text-white/30 uppercase tracking-[0.1em] leading-relaxed">
                  Utilize o <span className="text-primary">AUTO_COLLECT</span> após completar as missões para resgatar todas as recompensas instantaneamente.
                </p>
              </div>
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
