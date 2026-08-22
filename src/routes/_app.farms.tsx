import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { PLAN_LIMITS, getGateStatus } from "@/lib/quest-runner";
import { Card, StatCard, EmptyState as DSEmptyState } from "@/components/ui/ds";
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
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/farms")({
  head: () => ({ meta: [{ title: "Farms — SPECTRE" }] }),
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
  }, [running, activeQuestId, runs, now]);
  
  const activeMs = running && activeStart ? now - activeStart : 0;

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Sistemas Offline</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans italic">As ferramentas de farm automatizada requerem uma autorização ativa do terminal.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="farms --monitor"
        icon={Tractor}
        title="Operação de"
        highlight="Farm"
        description="Monitoramento em tempo real das automações e colheita de orbs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatItem icon={Activity} label="Status" value={running ? "Operando" : "Standby"} sub={running ? "Em execução" : "Aguardando"} active={running} />
        <StatItem icon={Clock} label="Tempo Ativo" value={running ? fmtDuration(activeMs) : "00:00"} sub="Duração da run" />
        <StatItem icon={Timer} label="Cooldown" value={remainingCd > 0 ? fmtDuration(remainingCd) : "Livre"} sub={limits.label} active={remainingCd > 0} />
        <StatItem icon={CheckCircle2} label="Concluídas" value={String(stats.todayDone)} sub={`Limite: ${limits.daily === Infinity ? '∞' : limits.daily}`} />
      </div>

      {running && progress && (
        <div className="ds-card p-6 border-primary/20 bg-primary/5 space-y-4 mt-8">
            <div className="flex justify-between items-center">
                <span className="font-display text-[9px] uppercase tracking-widest text-primary italic font-bold">Progresso da Missão</span>
                <span className="font-mono text-xs text-white">{progress.current} / {progress.total}</span>
            </div>
            <div className="h-1 bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${Math.min(100, (progress.current / Math.max(1, progress.total)) * 100)}%` }} 
                />
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-8">
        <div className="space-y-8">
            <div className="ds-card p-8 border-white/5 bg-white/[0.02]">
                <h3 className="font-display text-xs uppercase tracking-widest text-white mb-6 italic">Performance de Colheita</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <div className="text-[9px] uppercase tracking-widest text-white/30">Total Orbs</div>
                        <div className="font-display text-2xl text-white italic">{stats.totalOrbs.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[9px] uppercase tracking-widest text-white/30">Hoje</div>
                        <div className="font-display text-2xl text-primary italic">{stats.todayOrbs.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[9px] uppercase tracking-widest text-white/30">Taxa Sucesso</div>
                        <div className="font-display text-2xl text-white italic">{runs.length ? `${Math.round((stats.done / runs.length) * 100)}%` : '0%'}</div>
                    </div>
                </div>
            </div>

            <div className="ds-card p-8 border-white/5 bg-white/[0.02]">
                <h3 className="font-display text-xs uppercase tracking-widest text-white mb-6 italic">Terminal de Eventos</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {logs.length === 0 ? (
                        <p className="text-white/20 font-mono text-xs italic">Aguardando sinais do servidor...</p>
                    ) : (
                        logs.slice().reverse().map(l => (
                            <div key={l.id} className="font-mono text-[10px] py-1 border-b border-white/[0.02] flex gap-3">
                                <span className="text-white/20 shrink-0">[{new Date(l.ts).toLocaleTimeString()}]</span>
                                <span className={l.level === 'error' ? 'text-rose-500' : l.level === 'success' ? 'text-primary' : 'text-white/60'}>
                                    {l.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <aside className="space-y-6">
            <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
                <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Infraestrutura</div>
                <div className="space-y-4">
                    <InfraItem label="Plano Ativo" val={limits.label} />
                    <InfraItem label="Intervalo" val={`${limits.cooldownMs / 60000}m`} />
                    <InfraItem label="Limite Diário" val={limits.daily === Infinity ? 'Ilimitado' : String(limits.daily)} />
                    <InfraItem label="Status API" val="Online" color="text-emerald-500" />
                </div>
            </div>

            <div className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
                <div className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Resumo Global</div>
                <div className="space-y-2">
                    <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-white/40">Sucesso</span>
                        <span className="text-white">{stats.done}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-white/40">Falhas</span>
                        <span className="text-rose-500">{stats.failed}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-white/40">Ignoradas</span>
                        <span className="text-amber-500">{stats.skipped}</span>
                    </div>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, sub, active }: any) {
  return (
    <div className={`ds-card p-6 border-white/5 bg-white/[0.02] space-y-2 transition-all hover:border-primary/40 ${active ? 'border-primary/20' : ''}`}>
        <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-white/20'}`} />
            <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{label}</span>
        </div>
        <div className="font-display text-xl text-white uppercase italic tracking-tighter">{value}</div>
        <div className="text-[9px] text-white/20 uppercase tracking-widest font-mono">{sub}</div>
    </div>
  )
}

function InfraItem({ label, val, color = "text-white" }: any) {
    return (
        <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
            <span className="font-display text-[9px] uppercase tracking-widest text-white/20 italic">{label}</span>
            <span className={`font-mono text-[10px] uppercase ${color}`}>{val}</span>
        </div>
    )
}
